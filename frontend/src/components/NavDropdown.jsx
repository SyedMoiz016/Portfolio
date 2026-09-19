import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function NavDropdown({ item, active, index, onNavigate }) {
  const root = useRef(null);
  const location = useLocation();
  useEffect(() => {
    root.current.open = false;
  }, [location]);
  useEffect(() => {
    const closeOutside = (event) => {
      if (!root.current.contains(event.target)) root.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  return (
    <details
      ref={root}
      className={`nav-dropdown${active ? " active" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          root.current.open = false;
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && root.current.open) {
          event.stopPropagation();
          root.current.open = false;
          root.current.querySelector("summary").focus();
        }
      }}
    >
      <summary>
        {index !== undefined && (
          <span className="nav-dropdown-number">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {item.label}
        <ChevronDown size={14} />
      </summary>
      <div className="nav-dropdown-panel">
        {item.children.map((child) => (
          <a
            key={child.target}
            href={child.href || `/#${child.target}`}
            onClick={() => {
              root.current.open = false;
              onNavigate?.();
            }}
          >
            {child.label}
          </a>
        ))}
      </div>
    </details>
  );
}
