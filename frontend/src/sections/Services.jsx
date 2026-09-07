import {
  Code2,
  PanelsTopLeft,
  Database,
  Smartphone,
  PenTool,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { SectionHeading } from "../components/UI";
import { TiltCard } from "../animations";
import { services } from "../data/content";
const icons = { Code2, PanelsTopLeft, Database, Smartphone, PenTool, BookOpen };
export default function Services() {
  return (
    <section id="services" className="section services">
      <SectionHeading
        number="03"
        label="WHAT I DO"
        title="From first idea"
        accent="to final detail."
      >
        One creative partner. A complete range of digital capabilities.
      </SectionHeading>
      <div className="services-grid">
        {services.map(([icon, title, description], i) => {
          const Icon = icons[icon];
          return (
            <TiltCard key={title} className="service-card">
              <div data-reveal>
                <div className="service-top">
                  <Icon size={27} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <a href="#contact" aria-label={`Discuss ${title}`}>
                  Let's build <ArrowUpRight size={18} />
                </a>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
