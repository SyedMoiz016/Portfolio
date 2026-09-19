import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "../animations";
import { expertise } from "../data/expertise";
import DesignGallery from "../sections/DesignGallery";
import EbookServices from "../sections/EbookServices";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact";

export default function ServicePage({ page }) {
  const root = useRef(null);
  const location = useLocation();
  const service = expertise.find((item) => item.path === page) || {
    title: "Let's work together",
    description: "Tell me about your project and the service you need.",
  };
  useScrollReveal(root);
  useEffect(() => {
    document.title = `${service.title} | Syed Moiz Kazmi`;
    const meta = document.querySelector('meta[name="description"]');
    const previous = meta?.content;
    if (meta) meta.content = service.description;
    window.dispatchEvent(new Event("portfolio:ready"));
    return () => {
      if (meta) meta.content = previous;
    };
  }, [service.title, service.description]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (location.hash)
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      else window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <main ref={root} className="service-page">
      <div className="section service-page-intro">
        <Link to="/#expertise" className="back-link">
          <ArrowLeft size={16} />
          All skills
        </Link>
        <div className="eyebrow">
          SYED MOIZ KAZMI /{" "}
          {page === "contact" ? "GET IN TOUCH" : "SELECTED EXPERTISE"}
        </div>
        <h1>{service.title}</h1>
        <p>{service.description}</p>
      </div>
      {service.category && (
        <DesignGallery
          category={service.category}
          title={service.title}
          accent="portfolio."
        />
      )}
      {page === "branding" && <Projects categories={["Branding"]} />}
      {page === "ebooks" && (
        <>
          <EbookServices />
          <DesignGallery
            category="eBook Covers"
            title="Book covers."
            accent="Visual stories."
          />
          <Projects categories={["Design"]} />
        </>
      )}
      {page === "development" && (
        <Projects categories={["Web", "Apps", "AI"]} />
      )}
      {page === "contact" ? (
        <Contact />
      ) : (
        <div className="section service-page-contact">
          <h2>Have a project in mind?</h2>
          <Link to="/#contact" className="button">
            Let's work together
            <ArrowUpRight size={18} />
          </Link>
        </div>
      )}
    </main>
  );
}
