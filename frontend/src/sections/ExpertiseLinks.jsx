import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../components/UI";
import { expertise } from "../data/expertise";

export default function ExpertiseLinks() {
  return (
    <section id="expertise" className="section expertise-section">
      <SectionHeading
        number="01"
        label="MY EXPERTISE"
        title="Find the skill"
        accent="your idea needs."
      >
        Explore a dedicated page for each area of my work.
      </SectionHeading>
      <div className="expertise-grid">
        {expertise.map((item, index) => (
          <Link
            key={item.path}
            to={`/${item.path}`}
            className="expertise-link"
            data-reveal
          >
            <span className="eyebrow">0{index + 1}</span>
            <h3>
              {item.title}
              <ArrowUpRight size={22} />
            </h3>
            <p>{item.description}</p>
            <span className="expertise-explore">
              Explore {item.title.toLowerCase()}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
