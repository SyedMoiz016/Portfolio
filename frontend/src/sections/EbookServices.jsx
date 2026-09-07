import { ArrowRight } from "lucide-react";
import { GlowButton } from "../components/UI";
export default function EbookServices() {
  return (
    <section id="ebooks" className="section ebooks">
      <div className="ebook-visual" data-reveal>
        <div className="editorial-cover">
          <small>THE ART OF</small>
          <strong>
            thoughtful
            <br />
            <em>pages.</em>
          </strong>
          <span>
            DESIGNED TO BE READ.
            <br />
            CRAFTED TO BE KEPT.
          </span>
          <span className="cover-symbol">✳</span>
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
          {[
            "eBook Formatting",
            "Paperback Formatting",
            "Hardcover Formatting",
            "eBook Cover Design",
            "Layout Design",
            "Amazon KDP-ready Formatting",
          ].map((x) => (
            <span key={x}>
              <ArrowRight size={15} />
              {x}
            </span>
          ))}
        </div>
        <GlowButton secondary>Let's talk about your book</GlowButton>
      </div>
    </section>
  );
}
