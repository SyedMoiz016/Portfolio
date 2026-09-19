import { useRef, useState, useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../components/UI";
import { designs } from "../data/designs";
import { galleryFiltersByHash } from "../data/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
function DesignArtwork({ design, expanded = false }) {
  if (design.image)
    return (
      <div
        className={`design-art gallery-image ${expanded ? "gallery-image-expanded" : ""}`}
        style={{ background: design.background }}
      >
        <img
          src={design.image}
          alt={design.alt}
          width={design.width}
          height={design.height}
          loading={expanded ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    );
  return (
    <div className={`design-art ${design.style}`}>
      <span>{design.word}</span>
      <small>SMK — CONCEPT EXPLORATION</small>
    </div>
  );
}
export default function DesignGallery({
  category,
  title = "Beyond code.",
  accent = "Into character.",
}) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState(
    () => galleryFiltersByHash[window.location.hash.slice(1)] || "All",
  );
  useEffect(() => {
    const syncFilter = () => {
      const category = galleryFiltersByHash[window.location.hash.slice(1)];
      if (category) setFilter(category);
    };
    window.addEventListener("hashchange", syncFilter);
    return () => window.removeEventListener("hashchange", syncFilter);
  }, []);
  const selectFilter = (category) => {
    setFilter(category);
    const target = Object.keys(galleryFiltersByHash).find(
      (key) => galleryFiltersByHash[key] === category,
    );
    window.history.replaceState(window.history.state, "", `#${target}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [filter]);
  const dialog = useRef();
  useEffect(() => {
    if (selected) {
      if (!dialog.current.open) dialog.current.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = old;
      };
    }
    if (dialog.current?.open) dialog.current.close();
  }, [selected]);
  return (
    <section className="section design-section" id="design">
      {Object.keys(galleryFiltersByHash)
        .filter((key) => key !== "design")
        .map((key) => (
          <span
            key={key}
            id={key}
            className="gallery-anchor"
            aria-hidden="true"
          />
        ))}
      <SectionHeading
        number="06"
        label="THE CREATIVE SIDE"
        title={title}
        accent={accent}
      >
        {category
          ? `A focused collection of ${category.toLowerCase()} work and explorations.`
          : "A selection of logo designs, branding and visual storytelling."}
      </SectionHeading>
      {!category && (
        <div className="gallery-filters">
          {[
            "All",
            "Logo Design",
            "Branding",
            "Social Media Design",
            "eBook Covers",
          ].map((x) => (
            <button
              key={x}
              aria-pressed={filter === x}
              onClick={() => selectFilter(x)}
              className={filter === x ? "selected" : ""}
            >
              {x}
            </button>
          ))}
        </div>
      )}
      <div className="design-grid logo-portfolio-grid">
        {designs
          .filter((d) =>
            category
              ? d.category === category
              : filter === "All" || d.category === filter,
          )
          .map((d) => (
            <button
              key={d.title}
              className="design-item"
              onClick={() => setSelected(d)}
              aria-label={`View ${d.title}, ${d.category}`}
            >
              <DesignArtwork design={d} />
              <div className="design-caption">
                <span>
                  {d.title}
                  <small>{d.category}</small>
                </span>
                <ArrowUpRight size={18} />
              </div>
            </button>
          ))}
      </div>
      <dialog
        aria-label={
          selected ? `${selected.title} design preview` : "Design preview"
        }
        ref={dialog}
        className="lightbox"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="lightbox-inner">
            <button
              autoFocus
              aria-label="Close design preview"
              className="close-modal"
              onClick={() => {
                dialog.current.close();
                setSelected(null);
              }}
            >
              <X />
            </button>
            <DesignArtwork design={selected} expanded />
            <h3>{selected.title}</h3>
            <p>
              {selected.category}
              {!selected.image && " · Self-initiated concept"}
            </p>
          </div>
        )}
      </dialog>
    </section>
  );
}
