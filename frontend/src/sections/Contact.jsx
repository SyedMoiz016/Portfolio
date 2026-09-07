import { Github, Linkedin, Instagram, Globe } from "lucide-react";
import { profile } from "../data/content";
import ContactForm from "./ContactForm";
export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="contact-copy" data-reveal>
        <div className="eyebrow">
          <span>09 /</span> LET'S MAKE IT HAPPEN
        </div>
        <h2>
          Have an idea?
          <br />
          Let's build
          <br />
          <em>
            something
            <br />
            exceptional.
          </em>
          <span className="contact-star">✳</span>
        </h2>
        <p>
          Whether you're starting from a spark or a detailed brief, I'd love to
          hear what you have in mind.
        </p>
        <div className="contact-availability">
          <i /> Open to projects & collaborations
        </div>
        <div className="social-links">
          {[
            ["github", Github, "GitHub"],
            ["linkedin", Linkedin, "LinkedIn"],
            ["instagram", Instagram, "Instagram"],
            ["behance", Globe, "Behance"],
          ].map(([key, Icon, label]) =>
            profile.socials[key] ? (
              <a
                key={key}
                href={profile.socials[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ) : (
              <span
                key={key}
                title={`${label} profile coming soon`}
                aria-label={`${label} profile not yet supplied`}
              >
                <Icon size={18} />
              </span>
            ),
          )}
        </div>
        {profile.email && (
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        )}
      </div>
      <div data-reveal>
        <ContactForm />
      </div>
    </section>
  );
}
