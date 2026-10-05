import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { projects } from "../data/content";
import ProjectArt from "../components/ProjectArt";
export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  useEffect(() => {
    document.title = project
      ? `${project.name} | Syed Moiz Kazmi`
      : "Project not found | Syed Moiz Kazmi";
    window.scrollTo(0, 0);
  }, [project]);
  if (!project)
    return (
      <main className="not-found">
        <h1>Project not found.</h1>
        <Link className="button" to="/development">
          Back to projects <ArrowLeft size={18} />
        </Link>
      </main>
    );
  const related = projects.filter((p) =>
    ["AI", "Web", "Apps"].includes(project.category)
      ? ["AI", "Web", "Apps"].includes(p.category)
      : p.category === project.category,
  );
  const next = related[(related.indexOf(project) + 1) % related.length];
  return (
    <main
      className={`project-detail section ${project.kind === "book" ? "book-project-detail" : ""}`}
    >
      <Link
        to={
          project.category === "Branding"
            ? "/branding"
            : project.category === "Design"
              ? "/ebooks"
              : "/development"
        }
        className="back-link"
      >
        <ArrowLeft size={16} /> All projects
      </Link>
      <div className="eyebrow">{project.label}</div>
      <h1>
        {project.name}
        <span>↗</span>
      </h1>
      <p className="detail-intro">{project.description}</p>
      <div className="tags">
        {project.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="detail-art">
        <ProjectArt project={project} large />
      </div>
      <div className="detail-columns">
        <div>
          <small>01 / OVERVIEW</small>
          <h2>{project.type}</h2>
          <p>{project.description}</p>
          <div className="detail-actions">
            {project.live ? (
              <a
                className="button"
                href={project.live}
                target="_blank"
                rel="noreferrer"
              >
                Live site <ArrowUpRight size={18} />
              </a>
            ) : (
              <span className="unavailable-link">
                Live demo not yet supplied
              </span>
            )}
            {project.repo ? (
              <a
                className="button secondary"
                href={project.repo}
                target="_blank"
                rel="noreferrer"
              >
                Repository <ArrowUpRight size={18} />
              </a>
            ) : (
              <span className="unavailable-link">
                Repository not yet supplied
              </span>
            )}
          </div>
        </div>
        <div>
          <small>02 / THE PROBLEM</small>
          <p>{project.problem}</p>
          <small>03 / THE SOLUTION</small>
          <p>{project.solution}</p>
          <small>
            04 /{" "}
            {project.slug === "socialgen-ai"
              ? "PLANNED CAPABILITIES"
              : "CONCEPT HIGHLIGHTS"}
          </small>
          <ul className="feature-list">
            {project.features.map((f) => (
              <li key={f}>
                <Check size={17} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="detail-screens">
        <h2>Inside the experience</h2>
        <p>
          {project.screenshots.length
            ? "A closer look at the project."
            : "Illustrative concept preview. Actual project screenshots will be added when available."}
        </p>
        {project.screenshots.length ? (
          project.screenshots.map((src, i) => (
            <img
              key={src}
              src={src}
              loading="lazy"
              alt={`${project.name} screenshot ${i + 1}`}
            />
          ))
        ) : (
          <ProjectArt project={project} />
        )}
      </div>
      <Link className="next-project" to={`/projects/${next.slug}`}>
        <span>
          NEXT PROJECT<strong>{next.name}</strong>
        </span>
        <ArrowUpRight size={42} />
      </Link>
    </main>
  );
}
