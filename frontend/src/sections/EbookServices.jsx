import { Link } from "react-router-dom";
import { ebookServices } from "../data/ebookServices";
import { ArrowRight } from "lucide-react";
import { GlowButton } from "../components/UI";
export default function EbookServices() {
  return (
    <section id="ebooks" className="section ebooks">
      <div className="ebook-visual" data-reveal>
        <div className="editorial-cover featured-book-cover">
          <img
            src="/designs/book-covers/focus-discipline-consistency.jpg"
            alt="Focus, Discipline, Consistency book cover featuring a mountain road at sunset"
            width={736}
            height={1472}
            loading="lazy"
          />
        </div>
        <div className="ebook-caption">FROM FIRST PAGE TO FINAL IMPRESSION</div>
      </div>
      <div className="ebook-copy" data-reveal>
        <div className="eyebrow">
          <span>07 /</span> WORDS, BEAUTIFULLY PRESENTED
        </div>
        <h2>
          Your story.
          <br />
          <em>Expertly shaped.</em>
        </h2>
        <p>
          Great ideas deserve a beautiful reading experience. From cover to
          final page, I help turn manuscripts into polished, publishing-ready
          books.
        </p>
        <div className="ebook-list">
          {ebookServices.map((service) => (
            <div
              key={service.target}
              id={service.target}
              className="ebook-service"
            >
              <h3>
                <ArrowRight size={15} />
                {service.href ? (
                  <Link to={service.href}>
                    {service.label} <ArrowRight size={15} />
                  </Link>
                ) : (
                  service.label
                )}
              </h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
        <GlowButton secondary>Let's talk about your book</GlowButton>
      </div>
    </section>
  );
}
