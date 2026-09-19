import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Braces, RotateCw } from "lucide-react";

export default function AboutPortrait() {
  const container = useRef(null);
  const inView = useInView(container, { once: true, amount: 0.45 });
  const reduced = useReducedMotion();
  const [showPortrait, setShowPortrait] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const interacted = useRef(false);
  const revealed = useRef(false);

  useEffect(() => {
    if (!inView || !loaded || revealed.current || interacted.current) return;
    const timer = setTimeout(
      () => {
        if (interacted.current) return;
        revealed.current = true;
        setShowPortrait(true);
      },
      reduced ? 0 : 1400,
    );
    return () => clearTimeout(timer);
  }, [inView, loaded, reduced]);

  return (
    <div ref={container} className="about-portrait" data-reveal>
      <button
        type="button"
        className={`portrait-toggle ${showPortrait ? "is-flipped" : ""} ${reduced ? "reduced-flip" : ""}`}
        aria-label={
          showPortrait
            ? "Show Syed Moiz Kazmi’s name"
            : "Show Syed Moiz Kazmi’s portrait"
        }
        aria-pressed={showPortrait}
        disabled={!loaded || failed}
        onClick={() => {
          interacted.current = true;
          setShowPortrait((value) => !value);
        }}
      >
        <span className="portrait-rotator">
          <span
            className="portrait-face portrait-name"
            aria-hidden={showPortrait}
          >
            <span className="portrait-kicker">
              THE MIND BEHIND THE WORK <Braces size={22} />
            </span>
            <span className="portrait-name-text">
              Syed
              <br />
              Moiz <em>Kazmi.</em>
            </span>
            <span className="portrait-description">
              Developer. Designer. Problem solver.
            </span>
            <span className="portrait-hint">
              <RotateCw size={15} />
              {failed
                ? "Portrait unavailable"
                : loaded
                  ? "Discover the person behind the work"
                  : "Loading portrait…"}
            </span>
          </span>
          <span
            className="portrait-face portrait-photo"
            aria-hidden={!showPortrait}
          >
            <img
              src="/profile/syed-moiz-kazmi.png"
              alt="Syed Moiz Kazmi wearing a brown shirt against a dark background"
              width="896"
              height="1190"
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
            <span className="portrait-photo-caption">
              <span>
                Syed Moiz Kazmi<small>Developer & Designer</small>
              </span>
              <RotateCw size={18} />
            </span>
          </span>
        </span>
      </button>
      <p className="portrait-toggle-caption">
        {showPortrait
          ? "Click or tap to view my name"
          : "A little introduction, with a different perspective."}
      </p>
    </div>
  );
}
