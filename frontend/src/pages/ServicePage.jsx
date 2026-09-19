import { brandingServices } from "../data/brandingServices";
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
  const brandingService = brandingServices.find((item) => item.target === page);
  const service = (brandingService
    ? { ...brandingService, title: brandingService.label }
    : expertise.find((item) => item.path === page)) || {
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
        <Link
          to={brandingService ? "/branding" : "/#expertise"}
          className="back-link"
        >
          <ArrowLeft size={16} />
          {brandingService ? "All branding services" : "All skills"}
        </Link>
        <div className="eyebrow">
          SYED MOIZ KAZMI /{" "}
          {page === "contact" ? "GET IN TOUCH" : "SELECTED EXPERTISE"}
        </div>
        <h1>{service.title}</h1>
        <p>{service.description}</p>
      </div>
      {page === "branding" && (
        <section
          className="section branding-services"
          aria-label="Branding services"
        >
          {brandingServices.map((item) => (
            <article
              id={item.target}
              key={item.target}
              className="branding-service"
              data-reveal
            >
              <h2>{item.label}</h2>
              <p>{item.description}</p>
              <Link to={"/branding/" + item.target}>
                Explore {item.label.toLowerCase()} <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </section>
      )}
      {brandingService && (
        <section
          className="section"
          aria-label={brandingService.label + " services"}
        >
          <div className="eyebrow">A CLOSER LOOK</div>
          <div className="branding-services">
            {brandingService.details.map((detail, index) => (
              <article key={detail} className="branding-service" data-reveal>
                <span className="eyebrow">0{index + 1}</span>
                <h2>{detail}</h2>
              </article>
            ))}
          </div>
        </section>
      )}
      {service.category && page !== "branding" && (
        <DesignGallery
          category={service.category}
          title={service.title}
          accent="portfolio."
        />
      )}
      {page === "brand-identity" && <Projects categories={["Branding"]} />}
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
