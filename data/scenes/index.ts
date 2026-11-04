import type { SceneConfig } from "@/types";

/**
 * Auto-registers every scene file in this folder (default export).
 * Adding an industry = adding one file next to supermarket.ts.
 */
const modules = import.meta.glob<{ default: SceneConfig }>("./*.ts", { eager: true });

export const scenes: Record<string, SceneConfig> = Object.fromEntries(
  Object.entries(modules)
    .filter(([path, mod]) => !path.endsWith("/index.ts") && mod.default)
    .map(([, mod]) => [mod.default.id, mod.default]),
);

export const getScene = (id: string | undefined): SceneConfig | undefined =>
  id ? scenes[id] : undefined;
