import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../components/UI";
export default function WorkProcess() {
  const [step, setStep] = useState(0);
  const steps = [
    [
      "Discover",
      "Understand your goals, audience and what success looks like.",
    ],
    ["Plan", "Define the scope, architecture and a clear path forward."],
    [
      "Design",
      "Shape the visual language and map a purposeful user experience.",
    ],
    [
      "Develop",
      "Build responsive interfaces and reliable backend foundations.",
    ],
    [
      "Test",
      "Check usability, responsiveness, accessibility and critical flows.",
    ],
    ["Launch", "Prepare deployment and deliver a maintainable foundation."],
  ];
  return (
    <section className="section process" id="process">
      <SectionHeading
        number="08"
        label="HOW WE GET THERE"
        title="A clear process."
        accent="A better outcome."
      />
      <div className="process-steps">
        {steps.map(([name], i) => (
          <button
            key={name}
            onClick={() => setStep(i)}
            className={step === i ? "active" : ""}
            aria-pressed={step === i}
          >
            <span>0{i + 1}</span>
            <strong>{name}</strong>
            <ArrowUpRight size={18} />
          </button>
        ))}
      </div>
      <div className="process-detail" aria-live="polite">
        <span>
          0{step + 1} / {steps[step][0].toUpperCase()}
        </span>
        <p>{steps[step][1]}</p>
      </div>
    </section>
  );
}
