import { Code2, PenTool, Lightbulb, Puzzle, Sparkles } from "lucide-react";
import { AnimatedCounter, RevealText } from "../animations";
import { profile } from "../data/content";
import AboutPortrait from "../components/AboutPortrait";
import Hero from "./Hero";
export default function About() {
  return (
    <section id="about" className="about-opening">
      <span id="home" className="gallery-anchor" aria-hidden="true" />
      <Hero portrait={<AboutPortrait />}>
        <div className="about-copy">
          <p className="lead" data-word-reveal>
            <RevealText text="Good design makes you look." />
            <br />
            <span>Great experiences make you stay.</span>
          </p>
          <p>
            I am Syed Moiz Kazmi, a multidisciplinary developer and designer
            focused on building high-quality digital experiences. My work
            combines full-stack web development, application development,
            branding, logo design and eBook services.
          </p>
          <p>
            I enjoy transforming ideas into modern, functional and visually
            engaging digital products — bringing the same care to the code you
            don't see as the interface you do.
          </p>
          <div className="qualities">
            {[
              [Code2, "Development"],
              [PenTool, "Design"],
              [Lightbulb, "Creative solutions"],
              [Puzzle, "Problem solving"],
            ].map(([Icon, label]) => (
              <div key={label}>
                <Icon size={18} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </Hero>
      <div className="section about-summary">
        <div className="stats">
          {profile.stats.map((s) => (
            <div key={s.label}>
              <strong>
                <AnimatedCounter value={s.value} />
                <span>+</span>
              </strong>
              <p>{s.label}</p>
            </div>
          ))}
          <div className="stat-philosophy">
            <Sparkles />
            <span>
              One purpose.
              <br />
              <strong>Make it exceptional.</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
