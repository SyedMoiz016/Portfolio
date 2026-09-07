import { Sparkles } from "lucide-react";
import { SectionHeading } from "../components/UI";
import { journey } from "../data/content";
export default function ExperienceTimeline() {
  return (
    <section id="experience" className="section experience">
      <SectionHeading
        number="05"
        label="THE JOURNEY"
        title="Curiosity is"
        accent="the constant."
      >
        A growing practice shaped by learning, building and exploring new
        possibilities.
      </SectionHeading>
      <div className="journey-layout">
        <div className="journey-statement" data-reveal>
          <Sparkles size={32} />
          <h3>
            Every skill.
            <br />
            Every project.
            <br />
            <em>A step forward.</em>
          </h3>
          <p>
            A journey through disciplines, rather than a dated employment
            history.
          </p>
        </div>
        <div className="timeline">
          <span className="timeline-line" data-line />
          {journey.map(([n, title, copy]) => (
            <article key={n} data-reveal>
              <span className="timeline-node" />
              <small>CHAPTER {n}</small>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
