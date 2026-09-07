import { useState, useRef } from "react";
import {
  ArrowUpRight,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { submitContact } from "../utils/api";
const empty = { name: "", email: "", subject: "", service: "", message: "" };
export default function ContactForm() {
  const [data, setData] = useState(empty);
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const feedback = useRef();
  const update = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };
  async function submit(e) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setMessage("");
    setErrors({});
    try {
      await submitContact(data);
      setState("success");
      setMessage(
        "Thank you. Your message has been received. I look forward to learning more about your project.",
      );
      setData(empty);
    } catch (error) {
      setState("error");
      setMessage(error.message);
      const fields = {};
      error.fields?.forEach((x) => (fields[x.field] = x.message));
      setErrors(fields);
    }
    requestAnimationFrame(() => feedback.current?.focus());
  }
  const field = (name, label, type = "text") => (
    <label htmlFor={name}>
      {label}
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={
          name === "name" ? "name" : name === "email" ? "email" : "off"
        }
        value={data[name]}
        onChange={update}
        required
        minLength={name === "email" ? undefined : 2}
        maxLength={name === "email" ? 254 : name === "subject" ? 150 : 80}
        placeholder={
          name === "name"
            ? "Your name"
            : name === "email"
              ? "you@example.com"
              : "Tell me a little about your project"
        }
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <small id={`${name}-error`} className="field-error">
          {errors[name]}
        </small>
      )}
    </label>
  );
  return (
    <form onSubmit={submit} className="contact-form">
      <div className="form-row">
        {field("name", "Your name")}
        {field("email", "Email address", "email")}
      </div>
      <div className="form-row">
        {field("subject", "Subject")}
        <label htmlFor="service">
          What can I help with?
          <select
            id="service"
            name="service"
            value={data.service}
            onChange={update}
            required
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "service-error" : undefined}
          >
            <option value="" disabled>
              Select a service
            </option>
            {[
              "Web Development",
              "App Development",
              "Logo Design",
              "Branding",
              "eBook Services",
              "Other",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          {errors.service && (
            <small id="service-error" className="field-error">
              {errors.service}
            </small>
          )}
        </label>
      </div>
      <label htmlFor="message">
        Your message
        <textarea
          id="message"
          name="message"
          value={data.message}
          onChange={update}
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          placeholder="The idea, the ambition, the possibilities…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <small id="message-error" className="field-error">
            {errors.message}
          </small>
        )}
      </label>
      <div className="form-submit">
        <span>
          Your details are used only to respond
          <br />
          to your project inquiry.
        </span>
        <button className="button" disabled={state === "loading"}>
          {state === "loading" ? (
            <>
              Sending <LoaderCircle className="spin" size={17} />
            </>
          ) : (
            <>
              Send message <ArrowUpRight size={18} />
            </>
          )}
        </button>
      </div>
      {message && (
        <div
          ref={feedback}
          tabIndex={-1}
          className={`form-feedback ${state}`}
          role={state === "error" ? "alert" : "status"}
        >
          {state === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}
