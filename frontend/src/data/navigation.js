import { ebookServices } from "./ebookServices";

export const galleryFiltersByHash = {
  design: "All",
  "logo-design": "Logo Design",
  branding: "Branding",
  "social-media-design": "Social Media Design",
  "ebook-covers": "eBook Covers",
};
export const navigation = [
  { label: "Home", target: "about", href: "/" },
  { label: "Logo Design", target: "logo-design", href: "/logo-design" },
  {
    label: "Social Media",
    target: "social-media-design",
    href: "/social-media-design",
  },
  { label: "Branding", target: "branding", href: "/branding" },
  {
    label: "eBook",
    target: "ebooks",
    href: "/ebooks",
    children: ebookServices.map((service) => ({
      ...service,
      href: "/ebooks#" + service.target,
    })),
  },
  {
    label: "Web & App Development",
    target: "development",
    href: "/development",
  },
  { label: "Contact", target: "contact", href: "/#contact" },
];
export const projectFiltersByHash = {
  projects: "All",
  "web-development": "Web",
  "app-development": "Apps",
  "ai-projects": "AI",
  "design-projects": "Design",
  "branding-projects": "Branding",
};
export const categoryFiltersByHash = {
  ...galleryFiltersByHash,
  ...projectFiltersByHash,
};
