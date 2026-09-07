import { useEffect, useRef } from "react";
import { useScrollReveal } from "../animations";
import Projects from "../sections/Projects";
import DesignGallery from "../sections/DesignGallery";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Services from "../sections/Services";
import ExperienceTimeline from "../sections/ExperienceTimeline";
import EbookServices from "../sections/EbookServices";
import WorkProcess from "../sections/WorkProcess";
import Contact from "../sections/Contact";
export default function Home() {
  const root = useRef();
  useScrollReveal(root);
  useEffect(() => {
    window.dispatchEvent(new Event("portfolio:ready"));
    document.title =
      "Syed Moiz Kazmi | Full Stack Developer, App Developer & Designer";
    if (location.hash) {
      const timer = setTimeout(
        () => document.getElementById(location.hash.slice(1))?.scrollIntoView(),
        100,
      );
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <main ref={root}>
      <Hero />
      <div
        className="tech-marquee"
        aria-label="React, Node.js, MongoDB, Express.js, Tailwind CSS, creative development"
      >
        <div>
          {[
            "REACT",
            "NODE.JS",
            "MONGODB",
            "EXPRESS.JS",
            "TAILWIND CSS",
            "CREATIVE DEVELOPMENT",
          ].map((x) => (
            <span key={x}>
              {x}
              <i>✳</i>
            </span>
          ))}
        </div>
      </div>
      <About />
      <Skills />
      <Services />
      <Projects />
      <ExperienceTimeline />
      <DesignGallery />
      <EbookServices />
      <WorkProcess />
      <Contact />
    </main>
  );
}
