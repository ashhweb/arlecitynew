/**
 * Framework-agnostic pan/zoom engine for panoramic images.
 *
 *  - The content element is laid out at its "base" size (image covers the viewport) and moved
 *    with a GPU-accelerated translate3d + scale transform.
 *  - Horizontal panning is always free (clamped to the image edges).
 *  - Vertical panning is locked at default zoom and unlocks gradually while zooming in.
 *  - Drag has inertia, all movement is eased (critically-damped lerp), zoom is cursor-centred.
 *  - Pins live INSIDE the content element and counter-scale through the --inv CSS variable.
 */

export interface ViewRect {
  /** All values normalised 0-1 relative to the image. */
  x: number;
  y: number;
  w: number;
  h: number;
  zoom: number;
}

export interface ViewSnapshot {
  cx: number;
  cy: number;
  zoom: number;
}

interface State {
  x: number;
  y: number;
  z: number;
}

type Listener = (view: ViewRect) => void;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export class PanZoomEngine {
  minZoom = 1;
  maxZoom = 3;
  reduceMotion = false;

  private vw = 1;
  private vh = 1;
  private iw = 2;
  private ih = 1;
  private base = 1;
  private initialized = false;

  private cur: State = { x: 0, y: 0, z: 1 };
  private tgt: State = { x: 0, y: 0, z: 1 };
  private vel = { x: 0, y: 0 };
  private inertia = false;
  private raf = 0;
  private last = 0;

  private container: HTMLElement | null = null;
  private content: HTMLElement | null = null;
  private listeners = new Set<Listener>();

  private pointers = new Map<number, { x: number; y: number }>();
  private drag: {
    sx: number;
    sy: number;
    lx: number;
    ly: number;
    moved: boolean;
    samples: { t: number; x: number; y: number }[];
  } | null = null;
  private pinchDist = 0;
  private pinchCenter = { x: 0, y: 0 };
  private dragEndedAt = 0;
  private willChangeTimer = 0;

  /* ────────────── lifecycle ────────────── */

  bind(container: HTMLElement, content: HTMLElement): () => void {
    this.container = container;
    this.content = content;
    this.initialized = false;

    container.addEventListener("pointerdown", this.onPointerDown);
    container.addEventListener("pointermove", this.onPointerMove);
    container.addEventListener("pointerup", this.onPointerUp);
    container.addEventListener("pointercancel", this.onPointerUp);
    container.addEventListener("wheel", this.onWheel, { passive: false });
    container.addEventListener("click", this.onClickCapture, true);
    container.addEventListener("dragstart", this.preventDefault);

    return () => {
      container.removeEventListener("pointerdown", this.onPointerDown);
      container.removeEventListener("pointermove", this.onPointerMove);
      container.removeEventListener("pointerup", this.onPointerUp);
      container.removeEventListener("pointercancel", this.onPointerUp);
      container.removeEventListener("wheel", this.onWheel);
      container.removeEventListener("click", this.onClickCapture, true);
      container.removeEventListener("dragstart", this.preventDefault);
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.container = null;
      this.content = null;
    };
  }

  /** Call whenever the viewport (or the image) size changes. */
  setSize(vw: number, vh: number, iw: number, ih: number, initialCenter = { x: 0.5, y: 0.5 }) {
    if (!vw || !vh) return;
    let center: { x: number; y: number } | null = null;
    let zoom = 1;
    if (this.initialized) {
      center = this.getTargetCenter();
      zoom = this.tgt.z;
    } else {
      center = initialCenter;
    }
    this.vw = vw;
    this.vh = vh;
    this.iw = iw;
    this.ih = ih;
    this.base = Math.max(vw / iw, vh / ih);
    if (this.content) {
      this.content.style.width = `${this.W0}px`;
      this.content.style.height = `${this.H0}px`;
    }
    this.initialized = true;
    this.tgt.z = clamp(zoom, this.minZoom, this.maxZoom);
    this.placeCenter(this.tgt, center.x, center.y);
    this.clampState(this.tgt);
    this.cur = { ...this.tgt };
    this.inertia = false;
    this.apply();
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    if (this.initialized) fn(this.getView());
    return () => {
      this.listeners.delete(fn);
    };
  }

  /* ────────────── public controls ────────────── */

  getView(): ViewRect {
    const s = this.cur;
    const cw = this.W0 * s.z;
    const ch = this.H0 * s.z;
    return {
      x: -s.x / cw,
      y: -s.y / ch,
      w: this.vw / cw,
      h: this.vh / ch,
      zoom: s.z,
    };
  }

  getSnapshot(): ViewSnapshot {
    const c = this.getTargetCenter();
    return { cx: c.x, cy: c.y, zoom: this.tgt.z };
  }

  restore(snap: ViewSnapshot, animate = false) {
    this.tgt.z = clamp(snap.zoom, this.minZoom, this.maxZoom);
    this.placeCenter(this.tgt, snap.cx, snap.cy);
    this.clampState(this.tgt);
    if (!animate) this.cur = { ...this.tgt };
    this.wake();
  }

  /** Glide so that the normalised image point (nx, ny) is centred; optionally change zoom. */
  focus(nx: number, ny: number, zoom?: number) {
    this.inertia = false;
    if (zoom !== undefined) this.tgt.z = clamp(zoom, this.minZoom, this.maxZoom);
    this.placeCenter(this.tgt, nx, ny);
    this.clampState(this.tgt);
    this.wake();
  }

  panBy(dx: number, dy = 0) {
    this.tgt.x += dx;
    this.tgt.y += dy;
    this.clampState(this.tgt);
    this.wake();
  }

  zoomBy(factor: number, cx = this.vw / 2, cy = this.vh / 2) {
    this.zoomTo(this.tgt.z * factor, cx, cy);
  }

  zoomTo(z: number, cx = this.vw / 2, cy = this.vh / 2) {
    const nz = clamp(z, this.minZoom, this.maxZoom);
    const ratio = nz / this.tgt.z;
    this.tgt.x = cx - (cx - this.tgt.x) * ratio;
    this.tgt.y = cy - (cy - this.tgt.y) * ratio;
    this.tgt.z = nz;
    this.clampState(this.tgt);
    this.wake();
  }

  get viewport() {
    return { w: this.vw, h: this.vh };
  }

  /* ────────────── geometry ────────────── */

  private get W0() {
    return this.iw * this.base;
  }
  private get H0() {
    return this.ih * this.base;
  }

  private getTargetCenter() {
    const cw = this.W0 * this.tgt.z;
    const ch = this.H0 * this.tgt.z;
    return {
      x: (this.vw / 2 - this.tgt.x) / cw,
      y: (this.vh / 2 - this.tgt.y) / ch,
    };
  }

  private placeCenter(s: State, nx: number, ny: number) {
    s.x = this.vw / 2 - nx * this.W0 * s.z;
    s.y = this.vh / 2 - ny * this.H0 * s.z;
  }

  private boundsX(z: number) {
    return { min: Math.min(0, this.vw - this.W0 * z), max: 0 };
  }

  /** Vertical range is locked to the centre at zoom 1 and opens up as the user zooms in. */
  private boundsY(z: number) {
    const full = Math.min(0, this.vh - this.H0 * z);
    const lock = clamp((z - 1) / 0.25, 0, 1);
    const centre = full / 2;
    const half = (-full / 2) * lock;
    return { min: centre - half, max: centre + half };
  }

  private clampState(s: State) {
    s.z = clamp(s.z, this.minZoom, this.maxZoom);
    const bx = this.boundsX(s.z);
    const by = this.boundsY(s.z);
    s.x = clamp(s.x, bx.min, bx.max);
    s.y = clamp(s.y, by.min, by.max);
  }

  /* ────────────── animation loop ────────────── */

  private wake() {
    if (!this.content) return;
    this.content.style.willChange = "transform";
    window.clearTimeout(this.willChangeTimer);
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  private tick = (now: number) => {
    this.raf = 0;
    const dt = Math.min(64, now - this.last || 16);
    this.last = now;

    if (this.inertia) {
      this.tgt.x += this.vel.x * dt;
      this.tgt.y += this.vel.y * dt;
      const decay = Math.pow(0.94, dt / 16);
      this.vel.x *= decay;
      this.vel.y *= decay;
      const bx = this.tgt.x;
      const by = this.tgt.y;
      this.clampState(this.tgt);
      if (this.tgt.x !== bx) this.vel.x = 0;
      if (this.tgt.y !== by) this.vel.y = 0;
      if (Math.hypot(this.vel.x, this.vel.y) < 0.015) this.inertia = false;
    }

    const k = this.reduceMotion ? 1 : 1 - Math.exp(-dt / 85);
    const c = this.cur;
    const t = this.tgt;
    c.x += (t.x - c.x) * k;
    c.y += (t.y - c.y) * k;
    c.z += (t.z - c.z) * k;

    const settled =
      Math.abs(t.x - c.x) < 0.08 && Math.abs(t.y - c.y) < 0.08 && Math.abs(t.z - c.z) < 0.0004;
    if (settled) {
      c.x = t.x;
      c.y = t.y;
      c.z = t.z;
    }
    // Safety clamp so empty space can never show.
    const bx = this.boundsX(c.z);
    const by = this.boundsY(c.z);
    c.x = clamp(c.x, bx.min, bx.max);
    c.y = clamp(c.y, by.min, by.max);

    this.apply();

    if (!settled || this.inertia) {
      this.raf = requestAnimationFrame(this.tick);
    } else if (this.content) {
      // Drop will-change when idle so the browser re-rasterises sharply at the final zoom.
      const el = this.content;
      this.willChangeTimer = window.setTimeout(() => {
        el.style.willChange = "auto";
      }, 160);
    }
  };

  private apply() {
    const el = this.content;
    if (el) {
      const c = this.cur;
      el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) scale(${c.z})`;
      el.style.setProperty("--inv", String(1 / c.z));
    }
    if (this.listeners.size) {
      const v = this.getView();
      this.listeners.forEach((fn) => fn(v));
    }
  }

  /* ────────────── input handling ────────────── */

  private preventDefault = (e: Event) => e.preventDefault();

  private onClickCapture = (e: MouseEvent) => {
    if (performance.now() - this.dragEndedAt < 120) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  private rect() {
    return this.container!.getBoundingClientRect();
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.inertia = false;
    this.vel.x = this.vel.y = 0;

    if (this.pointers.size === 1) {
      this.drag = {
        sx: e.clientX,
        sy: e.clientY,
        lx: e.clientX,
        ly: e.clientY,
        moved: false,
        samples: [{ t: performance.now(), x: e.clientX, y: e.clientY }],
      };
    } else if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      this.pinchCenter = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      if (this.drag) this.drag.moved = true;
      this.dragEndedAt = performance.now() + 100000; // suppress clicks during pinch
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    const p = this.pointers.get(e.pointerId);
    if (!p || !this.container) return;
    p.x = e.clientX;
    p.y = e.clientY;

    if (this.pointers.size >= 2) {
      const [a, b] = [...this.pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const r = this.rect();
      if (this.pinchDist > 0) {
        this.panBy(center.x - this.pinchCenter.x, center.y - this.pinchCenter.y);
        this.zoomTo((this.tgt.z * dist) / this.pinchDist, center.x - r.left, center.y - r.top);
      }
      this.pinchDist = dist;
      this.pinchCenter = center;
      return;
    }

    const d = this.drag;
    if (!d) return;
    if (!d.moved) {
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6) return;
      d.moved = true;
      d.lx = e.clientX;
      d.ly = e.clientY;
      try {
        this.container.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
      this.container.dataset.dragging = "true";
      return;
    }
    this.panBy(e.clientX - d.lx, e.clientY - d.ly);
    d.lx = e.clientX;
    d.ly = e.clientY;
    const now = performance.now();
    d.samples.push({ t: now, x: e.clientX, y: e.clientY });
    while (d.samples.length > 2 && now - d.samples[0].t > 120) d.samples.shift();
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.pointers.has(e.pointerId)) return;
    this.pointers.delete(e.pointerId);
    const d = this.drag;
    const now = performance.now();

    if (this.container) {
      try {
        this.container.releasePointerCapture(e.pointerId);
      } catch {
        /* not captured */
      }
    }

    if (this.pointers.size === 0) {
      if (this.container) delete this.container.dataset.dragging;
      if (d?.moved && e.type === "pointerup") {
        this.dragEndedAt = now;
        const first = d.samples[0];
        const lastS = d.samples[d.samples.length - 1];
        const dt = lastS.t - first.t;
        if (dt > 8 && now - lastS.t < 90 && !this.reduceMotion) {
          const vx = clamp((lastS.x - first.x) / dt, -4, 4);
          const vy = clamp((lastS.y - first.y) / dt, -4, 4);
          if (Math.hypot(vx, vy) > 0.08) {
            this.vel.x = vx * 0.9;
            this.vel.y = vy * 0.9;
            this.inertia = true;
            this.wake();
          }
        }
      }
      // After a pinch, release the click suppression once every finger is up.
      if (this.dragEndedAt > now) this.dragEndedAt = now;
      this.drag = null;
      this.pinchDist = 0;
    } else {
      // pinch released with one finger remaining: stop dragging until all fingers are up
      this.pinchDist = 0;
      this.drag = null;
    }
  };

  private onWheel = (e: WheelEvent) => {
    if (!this.container) return;
    e.preventDefault();
    const r = this.rect();
    const mult = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1;
    const dx = e.deltaX * mult;
    const dy = e.deltaY * mult;

    if (e.ctrlKey || e.metaKey) {
      // trackpad pinch / ctrl + wheel
      this.zoomBy(Math.exp(-dy * 0.01), e.clientX - r.left, e.clientY - r.top);
    } else if (Math.abs(dx) > Math.abs(dy) || e.shiftKey) {
      // horizontal scroll pans left / right only
      this.panBy(-(e.shiftKey && !dx ? dy : dx));
    } else {
      this.zoomBy(Math.exp(-dy * 0.0016), e.clientX - r.left, e.clientY - r.top);
    }
  };
}
