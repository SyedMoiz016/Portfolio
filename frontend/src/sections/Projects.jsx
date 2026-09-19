import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { projects } from "../data/content";
import ProjectArt from "../components/ProjectArt";
import { SectionHeading } from "../components/UI";
import { projectFiltersByHash } from "../data/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export function ProjectCard({ project, index }) {
  const opensLive = project.openLive && project.live;
  const CardLink = opensLive ? "a" : Link;
  const linkProps = opensLive
    ? { href: project.live, target: "_blank", rel: "noopener noreferrer" }
    : { to: `/projects/${project.slug}` };
  return (
    <CardLink
      {...linkProps}
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
    </CardLink>
  );
}
export default function Projects({
  categories = ["Web", "Apps", "AI", "Design", "Branding"],
}) {
  const available = projects.filter((p) => categories.includes(p.category));
  const [filter, setFilter] = useState(() => {
    const initial = projectFiltersByHash[window.location.hash.slice(1)];
    return categories.includes(initial) ? initial : "All";
  });
  useEffect(() => {
    const syncFilter = () => {
      const category = projectFiltersByHash[window.location.hash.slice(1)];
      if (category === "All" || categories.includes(category))
        setFilter(category);
    };
    window.addEventListener("hashchange", syncFilter);
    return () => window.removeEventListener("hashchange", syncFilter);
  }, []);
  const selectFilter = (category) => {
    setFilter(category);
    const target = Object.keys(projectFiltersByHash).find(
      (key) => projectFiltersByHash[key] === category,
    );
    window.history.replaceState(window.history.state, "", `#${target}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  useEffect(() => {
    // Recalculate section positions after the filtering transition finishes.
    const timer = setTimeout(() => ScrollTrigger.refresh(), 450);
    return () => clearTimeout(timer);
  }, [filter]);
  const reduced = useReducedMotion();
  const visible = available.filter(
    (p) => filter === "All" || p.category === filter,
  );
  return (
    <section id="projects" className="section projects">
      {Object.keys(projectFiltersByHash)
        .filter((key) => key !== "projects")
        .map((key) => (
          <span
            key={key}
            id={key}
            className="gallery-anchor"
            aria-hidden="true"
          />
        ))}
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
        {["All", ...categories].map((x) => (
          <button
            key={x}
            aria-pressed={filter === x}
            className={filter === x ? "selected" : ""}
            onClick={() => selectFilter(x)}
          >
            {x}
            {x === "All" && <sup>{available.length}</sup>}
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
