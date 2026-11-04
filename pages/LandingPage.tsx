import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { ContactModal } from "@/components/ContactModal";
import { Logo } from "@/components/Logo";
import { PageTransition } from "@/components/PageTransition";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SocialLinks } from "@/components/SocialLinks";
import { images } from "@/config/images";
import { preloadImage } from "@/hooks/useImageAsset";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.35 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  // Warm up the next screen while the visitor reads the landing page.
  useEffect(() => preloadImage(images.city), []);

  return (
    <PageTransition>
      <div className="absolute inset-0 animate-ken-burns will-change-transform motion-reduce:animate-none">
        <ProgressiveImage asset={images.landing} />
      </div>
      <div aria-hidden className="absolute inset-0 bg-navy-900/40" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-900/10 to-navy-900/75"
      />

      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 sm:px-6">
        <Logo />
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="focus-ring glass flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium text-white transition hover:scale-105 hover:bg-white/20"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Contact
        </button>
      </header>

      <main className="relative z-10 flex h-full items-center justify-center px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex -translate-y-3 flex-col items-center text-center"
        >
          <motion.p
            variants={rise}
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.45em] text-gold-300 sm:text-xs"
          >
            Doha, Qatar
          </motion.p>
          <motion.h1
            variants={rise}
            className="font-heading text-[clamp(3.75rem,11vw,9.5rem)] font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-[0_6px_30px_rgba(3,8,20,0.5)]"
          >
            ARLE <span className="text-gold-gradient">City</span>
          </motion.h1>
          <motion.p variants={rise} className="mt-4 text-base text-white/90 sm:text-lg">
            One city. Every industry. Explore it all.
          </motion.p>
          <motion.div variants={rise} className="mt-8">
            <button
              type="button"
              onClick={() => navigate("/city")}
              className="focus-ring group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-semibold text-navy-900 shadow-gold transition duration-300 hover:-translate-y-1 hover:shadow-gold-lg active:translate-y-0 sm:text-base"
            >
              Visit ARLE City
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </button>
          </motion.div>
        </motion.div>
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 px-5 pb-4 sm:px-6">
        <p className="text-[11px] text-white/70 sm:text-xs">© 2026 ARLE City. All rights reserved.</p>
        <SocialLinks />
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </PageTransition>
  );
}
