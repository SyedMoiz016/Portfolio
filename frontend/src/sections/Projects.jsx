import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { projects } from "../data/content";
import ProjectArt from "../components/ProjectArt";
import { SectionHeading } from "../components/UI";
export function ProjectCard({ project, index }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`project-card ${index === 0 ? "featured" : ""}`}
    >
      <div className="project-preview">
        <ProjectArt project={project} />
        <span className="project-view">
          View project <ArrowUpRight size={19} />
        </span>
        <span className="project-number">0{projects.indexOf(project) + 1}</span>
      </div>
      <div className="project-info">
        <div>
          <small>{project.type}</small>
          <h3>
            {project.name}
            <ArrowUpRight size={25} />
          </h3>
          <p>{project.description}</p>
          <div className="tags">
            {project.tags.slice(0, 4).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <span className="project-label">{project.label}</span>
      </div>
    </Link>
  );
}
export default function Projects() {
  const [filter, setFilter] = useState("All");
  const reduced = useReducedMotion();
  const visible = projects.filter(
    (p) => filter === "All" || p.category === filter,
  );
  return (
    <section id="projects" className="section projects">
      <SectionHeading
        number="04"
        label="SELECTED WORK"
        title="Ideas brought"
        accent="to life."
      >
        A selection of development and design explorations. Built with purpose.
        Crafted with care.
      </SectionHeading>
      <div className="project-filters" aria-label="Filter projects">
        {["All", "Web", "Apps", "AI", "Design", "Branding"].map((x) => (
          <button
            key={x}
            aria-pressed={filter === x}
            className={filter === x ? "selected" : ""}
            onClick={() => setFilter(x)}
          >
            {x}
            {x === "All" && <sup>05</sup>}
          </button>
        ))}
        <span>
          DEVELOPMENT × DESIGN <ArrowRight size={14} />
        </span>
      </div>
      <motion.div layout={!reduced} className="project-grid">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.div
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              key={p.slug}
              className={filter === "All" && i === 0 ? "feature-wrap" : ""}
            >
              <ProjectCard project={p} index={filter === "All" ? i : 1} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
