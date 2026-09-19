import { useEffect, useState, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, ArrowUp, Menu, X, ArrowDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { profile } from "../data/content";
import { MagneticButton } from "../animations";
import { navigation } from "../data/navigation";
import NavDropdown from "./NavDropdown";
export function SectionHeading({ number, label, title, accent, children }) {
  return (
    <div className="section-heading" data-reveal>
      <div className="eyebrow">
        <span>{number} /</span> {label}
      </div>
      <div className="heading-row">
        <h2>
          {title} {accent && <em>{accent}</em>}
        </h2>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}
export function GlowButton({
  children,
  href = "/#contact",
  secondary = false,
  ...props
}) {
  return (
    <MagneticButton
      href={href}
      className={`button ${secondary ? "secondary" : ""}`}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
      <ArrowUpRight size={18} />
    </MagneticButton>
  );
}
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isActive = (item) =>
    item.target === "contact"
      ? location.pathname === "/" && location.hash === "#contact"
      : item.href === "/"
        ? location.pathname === "/" && location.hash !== "#contact"
        : location.pathname === item.href ||
          (item.href === "/development" &&
            location.pathname.startsWith("/projects/"));
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const key = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);
  return (
    <header className={`nav-wrap ${scrolled ? "scrolled" : ""}`}>
      <nav className="navbar" aria-label="Main navigation">
        <Link
          to="/"
          className="logo navbar-name"
          aria-label="Syed Moiz Kazmi home"
        >
          Syed Moiz Kazmi
        </Link>
        <div className="nav-links">
          {navigation.map((item) =>
            item.children ? (
              <NavDropdown
                key={item.target}
                item={item}
                active={isActive(item)}
              />
            ) : (
              <a
                key={item.target}
                className={isActive(item) ? "active" : ""}
                aria-current={isActive(item) ? "location" : undefined}
                href={item.href}
              >
                {item.label}
              </a>
            ),
          )}
        </div>
        <a href="/#contact" className="nav-cta">
          Let's talk <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {navigation.map((item, i) =>
              item.children ? (
                <NavDropdown
                  key={item.target}
                  item={item}
                  active={isActive(item)}
                  index={i}
                  onNavigate={() => setOpen(false)}
                />
              ) : (
                <a
                  key={item.target}
                  href={item.href}
                  className={isActive(item) ? "active" : ""}
                  aria-current={isActive(item) ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                  <ArrowUpRight size={18} />
                </a>
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(() => !sessionStorage.getItem("smk-loaded"));
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!show) return;
    const start = performance.now();
    const timer = setInterval(() => {
      const n = Math.min(
        100,
        Math.round((performance.now() - start) / (reduced ? 2 : 11)),
      );
      setProgress(n);
      if (n === 100) {
        clearInterval(timer);
        sessionStorage.setItem("smk-loaded", "1");
        setShow(false);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [show, reduced]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : -30 }}
          transition={{ duration: 0.45 }}
          aria-hidden="true"
        >
          <strong>
            SMK<span>.</span>
          </strong>
          <h2>Syed Moiz Kazmi</h2>
          <p>Crafting Digital Experiences</p>
          <div className="loader-track">
            <i style={{ width: progress + "%" }} />
          </div>
          <small>{progress}%</small>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: smooth }}
      aria-hidden="true"
    />
  );
}
export function CustomCursor() {
  const dot = useRef();
  const ring = useRef();
  useEffect(() => {
    if (
      !matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)")
        .matches
    )
      return;
    let x = -100,
      y = -100,
      rx = x,
      ry = y,
      id;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.current.style.transform = `translate(${x}px,${y}px)`;
      ring.current.classList.toggle(
        "interactive",
        !!e.target.closest("a,button,.project-card"),
      );
    };
    const frame = () => {
      rx += (x - rx) * 0.15;
      ry += (y - ry) * 0.15;
      ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      id = requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", move);
    id = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(id);
    };
  }, []);
  return (
    <div aria-hidden="true" className="custom-cursor">
      <i ref={dot} />
      <span ref={ring} />
    </div>
  );
}
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(scrollY > 700);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    show && (
      <a className="back-top" href="#top" aria-label="Back to top">
        <ArrowUp size={18} />
      </a>
    )
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link to="/" className="logo">
          SMK<span>.</span>
        </Link>
        <p>Designed & Developed by Syed Moiz Kazmi</p>
      </div>
      <div className="footer-socials" aria-label="Social profiles">
        {Object.entries({
          github: "GitHub",
          linkedin: "LinkedIn",
          instagram: "Instagram",
          behance: "Behance",
        }).map(([key, label]) =>
          profile.socials[key] ? (
            <a
              key={key}
              href={profile.socials[key]}
              target="_blank"
              rel="noreferrer"
            >
              {label} ↗
            </a>
          ) : (
            <span key={key} title="Profile link not supplied">
              {label}
            </span>
          ),
        )}
        {profile.email ? (
          <a href={`mailto:${profile.email}`}>Email ↗</a>
        ) : (
          <a href="/#contact">Get in touch ↗</a>
        )}
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Syed Moiz Kazmi. All rights reserved.
        </span>
        <span>
          BUILT WITH INTENTION. <span className="violet">✳</span>
        </span>
      </div>
    </footer>
  );
}
export function ScrollCue() {
  return (
    <a href="#skills" className="scroll-cue">
      <span className="mouse">
        <i />
      </span>
      SCROLL TO EXPLORE
      <ArrowDown size={14} />
    </a>
  );
}
