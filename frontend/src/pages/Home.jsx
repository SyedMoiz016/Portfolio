import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Contact from "../sections/Contact";
import { useScrollReveal } from "../animations";
import ExpertiseLinks from "../sections/ExpertiseLinks";
import About from "../sections/About";
import Skills from "../sections/Skills";
export default function Home() {
  const root = useRef();
  const location = useLocation();
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
  }, [location.hash]);
  return (
    <main ref={root}>
      <About />
      <ExpertiseLinks />
      <Skills />
      <Contact />
    </main>
  );
}
