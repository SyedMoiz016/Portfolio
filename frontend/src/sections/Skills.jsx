import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Braces } from "lucide-react";
import { SectionHeading } from "../components/UI";
import { TiltCard } from "../animations";
import { skills } from "../data/content";
export default function Skills() {
  const [category, setCategory] = useState("Frontend");
  return (
    <section id="skills" className="section skills">
      <SectionHeading
        number="02"
        label="MY TOOLKIT"
        title="The right tools."
        accent="Limitless possibilities."
      >
        A versatile stack for turning ambitious ideas into reliable, carefully
        crafted experiences.
      </SectionHeading>
      <div className="skills-layout">
        <div
          className="skill-tabs"
          role="tablist"
          aria-label="Skill categories"
          aria-orientation="vertical"
        >
          {Object.keys(skills).map((x, i) => (
            <button
              id={`skill-tab-${i}`}
              role="tab"
              aria-controls="skill-panel"
              tabIndex={category === x ? 0 : -1}
              aria-selected={category === x}
              key={x}
              onClick={() => setCategory(x)}
              onKeyDown={(e) => {
                const keys = Object.keys(skills);
                let n = i;
                if (e.key === "ArrowDown") n = (i + 1) % keys.length;
                else if (e.key === "ArrowUp")
                  n = (i + keys.length - 1) % keys.length;
                else if (e.key === "Home") n = 0;
                else if (e.key === "End") n = keys.length - 1;
                else return;
                e.preventDefault();
                setCategory(keys[n]);
                document.getElementById(`skill-tab-${n}`).focus();
              }}
            >
              <span>0{i + 1}</span>
              {x}
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
        <div
          className="skill-panel"
          id="skill-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`skill-tab-${Object.keys(skills).indexOf(category)}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              className="skill-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {skills[category].map((s, i) => (
                <TiltCard className="skill-card" key={s}>
                  <span className="tech-symbol">
                    {s === "React.js"
                      ? "⚛"
                      : s === "JavaScript"
                        ? "JS"
                        : s === "HTML"
                          ? "〈/〉"
                          : s === "CSS"
                            ? "#"
                            : s === "Tailwind CSS"
                              ? "≈"
                              : s.slice(0, 2)}
                  </span>
                  <h3>{s}</h3>
                  <small>{category.toUpperCase()}</small>
                </TiltCard>
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="skill-footnote">
            <span className="status-dot" /> ALWAYS LEARNING. ALWAYS EVOLVING.
            <Braces size={17} />
          </div>
        </div>
      </div>
    </section>
  );
}
