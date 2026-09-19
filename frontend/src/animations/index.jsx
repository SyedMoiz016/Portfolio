import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function useScrollReveal(ref) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 38,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 93%", once: true },
          }),
        );
        gsap.utils.toArray("[data-line]").forEach((el) =>
          gsap.from(el, {
            scaleY: 0,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 75%",
              scrub: 1,
            },
          }),
        );
        if (ref.current?.querySelector(".hero"))
          gsap.to(".hero-ghost", {
            xPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        if (ref.current?.querySelector(".ebooks"))
          gsap.to(".editorial-cover", {
            y: -25,
            rotation: 2,
            ease: "none",
            scrollTrigger: {
              trigger: ".ebooks",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        if (ref.current?.querySelector(".process-steps"))
          gsap.from(".process-steps", {
            clipPath: "inset(0 100% 0 0)",
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".process-steps",
              start: "top 92%",
              once: true,
            },
          });
      }, ref);
      return () => ctx.revert();
    });
    mm.add(
      "(min-width: 1100px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          ScrollTrigger.create({
            trigger: ".journey-statement",
            start: "top 160px",
            endTrigger: ".timeline",
            end: "bottom 70%",
            pin: true,
            pinSpacing: false,
          });
        }, ref);
        return () => ctx.revert();
      },
    );
    return () => mm.revert();
  }, [ref]);
}
export function FadeUp({ children, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65 }}
    >
      {children}
    </motion.div>
  );
}
export function SplitText({ text }) {
  const reduced = useReducedMotion();
  return (
    <span aria-label={text}>
      {text.split("").map((c, i) => (
        <motion.span
          aria-hidden="true"
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre" }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.018 }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  );
}
export function TiltCard({ children, className = "" }) {
  const ref = useRef();
  const reduced = useReducedMotion();
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ref.current.style.transform = `perspective(1000px) rotateX(${-(e.clientY - r.top - r.height / 2) / 100}deg) rotateY(${(e.clientX - r.left - r.width / 2) / 100}deg)`;
      }}
      onPointerLeave={() => (ref.current.style.transform = "")}
    >
      {children}
    </div>
  );
}
export function MagneticButton({ children, className = "", ...props }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 22 }),
    springY = useSpring(y, { stiffness: 250, damping: 22 });
  return (
    <motion.a
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
export function RevealText({ text }) {
  const reduced = useReducedMotion();
  return (
    <span aria-label={text}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{ display: "inline-block", marginRight: ".25em" }}
          initial={reduced ? false : { opacity: 0.15, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: i * 0.04 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
export function AnimatedCounter({ value }) {
  const ref = useRef();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: value,
      duration: 1.6,
      roundProps: "n",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = obj.n;
      },
      scrollTrigger: { trigger: ref.current, once: true, start: "top 95%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);
  return <span ref={ref}>{value}</span>;
}
