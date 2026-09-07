import { useRef, useState, useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../components/UI";
const designs = [
  {
    title: "Monogram",
    category: "Logo Design",
    style: "logo-work",
    word: "m.",
  },
  {
    title: "Studio No. 04",
    category: "Branding",
    style: "identity-work",
    word: "STUDIO\nNO. 04",
  },
  {
    title: "Create something.",
    category: "Social Media Design",
    style: "social-work",
    word: "MAKE\nYOUR\nMARK.",
  },
  {
    title: "The quiet art",
    category: "eBook Covers",
    style: "cover-work",
    word: "the\nquiet\nart.",
  },
];
export default function DesignGallery() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
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
      <SectionHeading
        number="06"
        label="THE CREATIVE SIDE"
        title="Beyond code."
        accent="Into character."
      >
        Identity, typography and visual storytelling. A collection of
        self-initiated design concepts.
      </SectionHeading>
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
            onClick={() => setFilter(x)}
            className={filter === x ? "selected" : ""}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="design-grid">
        {designs
          .filter((d) => filter === "All" || d.category === filter)
          .map((d) => (
            <button
              key={d.title}
              className="design-item"
              onClick={() => setSelected(d)}
              aria-label={`View ${d.title}, ${d.category}`}
            >
              <div className={`design-art ${d.style}`}>
                <span>{d.word}</span>
                <small>SMK — CONCEPT EXPLORATION</small>
              </div>
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
            <div className={`design-art ${selected.style}`}>
              <span>{selected.word}</span>
              <small>SMK — CONCEPT EXPLORATION</small>
            </div>
            <h3>{selected.title}</h3>
            <p>{selected.category} · Self-initiated concept</p>
          </div>
        )}
      </dialog>
    </section>
  );
}
