import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export default function ProjectScreenshot({ project }) {
  const container = useRef(null);
  const visible = useInView(container, { amount: 0.15 });
  const reduced = useReducedMotion();
  const floating = visible && !reduced;

  return (
    <div ref={container} className="project-screenshot-stage">
      <motion.div
        className="project-screenshot-frame"
        animate={floating ? { y: [0, -7, 0] } : { y: 0 }}
        transition={
          floating
            ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      >
        <img
          className="project-screenshot-image"
          src={project.image}
          alt={project.imageAlt || `${project.name} preview`}
          loading="lazy"
          decoding="async"
          width={1585}
          height={771}
        />
      </motion.div>
    </div>
  );
}
