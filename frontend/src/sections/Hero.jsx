import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlowButton, ScrollCue } from "../components/UI";
import { roles } from "../data/content";
import { SplitText } from "../animations";
const HeroOrb = lazy(() =>
  import("../components/SpaceBackground").then((m) => ({ default: m.HeroOrb })),
);
export default function Hero({ children, portrait }) {
  const [role, setRole] = useState(0);
  const reduced = useReducedMotion();
  const actions = (
    <div className="hero-actions">
      <GlowButton href="#expertise">Explore my work</GlowButton>
      <GlowButton secondary>Let's work together</GlowButton>
    </div>
  );
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(
      () => setRole((n) => (n + 1) % roles.length),
      3200,
    );
    return () => clearInterval(timer);
  }, [reduced]);
  return (
    <div id="introduction" className={`hero${portrait ? " hero-profile" : ""}`}>
      <div className="hero-ghost" aria-hidden="true">
        CREATOR
      </div>
      {portrait && (
        <div className="hero-portrait">
          {portrait}
          {actions}
        </div>
      )}
      <div className="hero-content">
        <div className="availability">
          <i /> OPEN TO NEW OPPORTUNITIES
        </div>
        <p className="hero-intro">
          Hi, I'm <span>Syed Moiz Kazmi</span>
          <span className="small-star">✳</span>
        </p>
        <div className="hero-heading">
          <h1>
            <SplitText text="I build digital" />
            <br />
            experiences
            <br />
            <em>beyond the screen.</em>
          </h1>
          <div className="hero-visual">
            <span className="orbit-label label-top">
              <i /> ENGINEERING × CREATIVITY
            </span>
            <div className="hero-orbit-scene" aria-hidden="true">
              <Suspense fallback={<div className="orb-placeholder" />}>
                <HeroOrb />
              </Suspense>
            </div>
            <div className="orb-coordinate">
              SMK / DIGITAL UNIVERSE <span>01 — ∞</span>
            </div>
            <span className="orbit-label label-bottom">
              <span className="crosshair">+</span> ALWAYS EXPLORING. ALWAYS
              CREATING.
            </span>
          </div>
        </div>
        <div className="role-line">
          <span />{" "}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={reduced ? false : { y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {roles[role]}
            </motion.div>
          </AnimatePresence>
        </div>
        {children || (
          <p className="hero-description">
            Engineering meets imagination. I create powerful web applications,
            thoughtful interfaces and distinctive visual identities.
          </p>
        )}
        {!portrait && actions}
      </div>
      <div className="hero-bottom">
        <ScrollCue />
        <span className="hero-note">
          DEVELOPER BY LOGIC.
          <br />
          DESIGNER BY INSTINCT.
        </span>
        <a href="/#contact">
          LET'S CREATE SOMETHING GREAT <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}
