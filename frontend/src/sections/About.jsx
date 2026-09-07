import {
  Code2,
  PenTool,
  Lightbulb,
  Puzzle,
  Braces,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "../components/UI";
import { AnimatedCounter, RevealText } from "../animations";
import { profile } from "../data/content";
export default function About() {
  return (
    <section id="about" className="section about">
      <SectionHeading
        number="01"
        label="A LITTLE ABOUT ME"
        title="At the intersection of"
        accent="logic & imagination."
      />
      <div className="about-grid">
        <div className="about-visual" data-reveal>
          <div className="about-monogram">
            M<span>.</span>
          </div>
          <div className="about-visual-top">
            <span>THE MIND BEHIND THE WORK</span>
            <Braces size={22} />
          </div>
          <div className="about-visual-bottom">
            <strong>Syed Moiz Kazmi</strong>
            <span>Developer. Designer. Problem solver.</span>
          </div>
          <span className="about-cross">+</span>
        </div>
        <div className="about-copy" data-reveal>
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
      </div>
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
    </section>
  );
}
