import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Github,
  Globe2,
  Menu,
  Moon,
  Puzzle,
  ServerCog,
  ShieldCheck,
  ShoppingBag,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { portfolio } from "@/data/portfolio";
import { projects } from "@/data/projects";
import { serviceOptions, services } from "@/data/services";

const iconByName = { Code2, ShoppingBag, Puzzle, ShieldCheck, ServerCog };

type ContactStatus = "idle" | "sending" | "success" | "error" | "missing-key";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: portfolio.seo.title },
      { name: "description", content: portfolio.seo.description },
      { property: "og:title", content: portfolio.seo.title },
      { property: "og:description", content: portfolio.seo.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: portfolio.seo.canonical },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: portfolio.seo.title },
      { name: "twitter:description", content: portfolio.seo.description },
    ],
    links: [{ rel: "canonical", href: portfolio.seo.canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Samiul H Pranto",
          jobTitle: "WordPress Engineer",
          url: "https://pran.to/",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Dhaka",
            addressCountry: "Bangladesh",
          },
          sameAs: [
            "https://www.linkedin.com/in/samiulhpranto/",
            "https://github.com/prantobuilds/",
          ],
        }),
      },
    ],
  }),
  staticData: { sitemap: true },
});

function Index() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [contactStatus, setContactStatus] = useState<ContactStatus>("idle");
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let savedTheme: string | null = null;
    try {
      savedTheme = window.localStorage.getItem("pran-to-theme");
    } catch {
      savedTheme = null;
    }
    const initialTheme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = initialTheme;
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const viewTransition = document.startViewTransition;
    const applyTheme = () => {
      document.documentElement.dataset.theme = nextTheme;
      setTheme(nextTheme);
      try {
        window.localStorage.setItem("pran-to-theme", nextTheme);
      } catch {
        // Keep the theme available for this visit if storage is unavailable.
      }
    };

    if (reducedMotion || typeof viewTransition !== "function") {
      applyTheme();
      return;
    }

    const bounds = toggleRef.current?.getBoundingClientRect();
    if (bounds) {
      document.documentElement.style.setProperty("--theme-origin-x", `${bounds.left + bounds.width / 2}px`);
      document.documentElement.style.setProperty("--theme-origin-y", `${bounds.top + bounds.height / 2}px`);
    }
    viewTransition.call(document, applyTheme);
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (contactStatus === "sending") return;

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!accessKey) {
      setContactStatus("missing-key");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setContactStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.get("name"),
          email: formData.get("email"),
          service: formData.get("service"),
          message: formData.get("message"),
        }),
      });
      const result: { success?: boolean } = await response.json();
      setContactStatus(response.ok && result.success ? "success" : "error");
      if (response.ok && result.success) event.currentTarget.reset();
    } catch {
      setContactStatus("error");
    }
  };

  const statusMessage = {
    sending: portfolio.contact.sending,
    success: portfolio.contact.success,
    error: portfolio.contact.error,
    "missing-key": portfolio.contact.missingKey,
  }[contactStatus];

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="site-header">
        <div className="site-header-inner page-wrap">
          <a className="wordmark" href="#top" onClick={closeMenu} aria-label="pran.to home">
            pran.to
          </a>
          <nav className={`primary-nav${menuOpen ? " primary-nav-open" : ""}`} aria-label="Main navigation">
            {portfolio.navigation.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}>
                {item}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <Button
              ref={toggleRef}
              variant="ghost"
              size="icon"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            </Button>
            <Button asChild className="header-hire">
              <a href="#contact">Hire me</a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>
        </div>
        <nav
          id="mobile-navigation"
          className={`mobile-nav page-wrap${menuOpen ? " mobile-nav-open" : ""}`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          {portfolio.navigation.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div id="top" className="page-wrap">
        <section className="hero-section" aria-labelledby="hero-title">
          <p className="eyebrow">{portfolio.hero.eyebrow}</p>
          <h1 id="hero-title">{portfolio.hero.title}</h1>
          <p className="hero-description">{portfolio.hero.description}</p>
          <div className="hero-actions">
            <Button asChild size="lg" className="primary-action">
              <a href="#contact">Hire me <ArrowRight aria-hidden="true" /></a>
            </Button>
            <Button asChild variant="outline" size="lg" className="secondary-action">
              <a href="#work">View work <ArrowDown aria-hidden="true" /></a>
            </Button>
          </div>
          <p className="availability"><span aria-hidden="true" />{portfolio.hero.availability}</p>
        </section>

        <section id="services" className="content-section services-section" aria-labelledby="services-title">
          <SectionHeading eyebrow={portfolio.services.eyebrow} title={portfolio.services.title} id="services-title" />
          <div className="services-grid">
            {services.map((service) => {
              const Icon = iconByName[service.icon];
              return (
                <article className="service-item" key={service.id}>
                  <div className="service-icon"><Icon aria-hidden="true" /></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a
                    className="text-link"
                    href="#contact"
                    onClick={() => setSelectedService(service.title)}
                  >
                    {portfolio.services.discuss}<ArrowRight aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section id="work" className="content-section work-section" aria-labelledby="work-title">
          <SectionHeading eyebrow={portfolio.work.eyebrow} title={portfolio.work.title} id="work-title" />
          <div className="projects-grid">
            {projects.map((project, index) => (
              <article className={`project-item project-item-${index + 1}`} key={project.name}>
                <div className="project-preview" role="img" aria-label={`${project.name} website placeholder`}>
                  <div className="preview-browser">
                    <div className="preview-toolbar" aria-hidden="true"><i /><i /><i /><span /></div>
                    <div className="preview-content"><span className="preview-site-name">{project.name}</span></div>
                  </div>
                </div>
                <div className="project-details">
                  <div className="project-title-row">
                    <div>
                      <p className="project-category">{project.category}</p>
                      <h3>{project.name}</h3>
                    </div>
                    {project.href ? (
                      <a className="project-link-icon" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} (opens in a new tab)`}>
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="project-status">{project.status}</span>
                    )}
                  </div>
                  <p className="project-description">{project.description}</p>
                  <ul className="tag-list" aria-label={`${project.name} tools`}>
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="content-section about-section" aria-labelledby="about-title">
          <SectionHeading eyebrow={portfolio.about.eyebrow} title={portfolio.about.title} id="about-title" />
          <div className="about-layout">
            <div className="about-photo" role="img" aria-label={portfolio.about.photoAlt}>
              <UserRound aria-hidden="true" />
              <span>{portfolio.about.photoAlt}</span>
            </div>
            <div className="about-copy">
              <p className="about-description">{portfolio.about.description}</p>
              <div className="about-facts">
                <div className="about-fact">
                  <h3>{portfolio.toolsLabel}</h3>
                  <ul className="tag-list tool-list">
                    {portfolio.about.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                </div>
                <div className="about-fact">
                  <h3>{portfolio.educationLabel}</h3>
                  <p>{portfolio.about.education}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
          <SectionHeading eyebrow={portfolio.contact.eyebrow} title={portfolio.contact.title} id="contact-title" />
          <div className="contact-layout">
            <form className="contact-form" onSubmit={submitContact}>
              <div className="form-row">
                <label className="form-field">
                  <span>{portfolio.contact.fields.name}</span>
                  <input name="name" type="text" autoComplete="name" required />
                </label>
                <label className="form-field">
                  <span>{portfolio.contact.fields.email}</span>
                  <input name="email" type="email" autoComplete="email" required />
                </label>
              </div>
              <label className="form-field">
                <span>{portfolio.contact.fields.service}</span>
                <select
                  name="service"
                  value={selectedService}
                  onChange={(event) => setSelectedService(event.currentTarget.value)}
                  required
                >
                  <option value="" disabled>Select a service</option>
                  {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="form-field">
                <span>{portfolio.contact.fields.message}</span>
                <textarea name="message" rows={5} required />
              </label>
              <div className="form-submit-row">
                <Button type="submit" className="primary-action" disabled={contactStatus === "sending"}>
                  {contactStatus === "sending" ? portfolio.contact.sending : portfolio.contact.submit}
                  {contactStatus !== "sending" && <ArrowRight aria-hidden="true" />}
                </Button>
                {statusMessage && (
                  <p className={`form-status form-status-${contactStatus}`} role="status" aria-live="polite">
                    {statusMessage}
                  </p>
                )}
              </div>
            </form>
            <aside className="contact-links" aria-label="Direct contact links">
              <a className="contact-link" href={`mailto:${portfolio.contact.email}`}>
                <span className="contact-link-icon"><Globe2 aria-hidden="true" /></span>
                <span><small>Email</small><strong>{portfolio.contact.email}</strong></span>
                <ArrowUpRight className="contact-arrow" aria-hidden="true" />
              </a>
              <a className="contact-link" href={portfolio.contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                <span className="contact-link-icon"><ArrowUpRight aria-hidden="true" /></span>
                <span><small>WhatsApp</small><strong>{portfolio.contact.whatsappLabel}</strong></span>
                <ArrowUpRight className="contact-arrow" aria-hidden="true" />
              </a>
              <a className="contact-link" href={portfolio.contact.linkedinHref} target="_blank" rel="noopener noreferrer">
                <span className="contact-link-icon contact-link-type">in</span>
                <span><small>LinkedIn</small><strong>samiulhpranto</strong></span>
                <ArrowUpRight className="contact-arrow" aria-hidden="true" />
              </a>
              <a className="contact-link" href={portfolio.contact.githubHref} target="_blank" rel="noopener noreferrer">
                <span className="contact-link-icon"><Github aria-hidden="true" /></span>
                <span><small>GitHub</small><strong>prantobuilds</strong></span>
                <ArrowUpRight className="contact-arrow" aria-hidden="true" />
              </a>
            </aside>
          </div>
        </section>

        <footer className="site-footer">
          <a className="wordmark" href="#top">{portfolio.logo}</a>
          <p>{portfolio.footer.tagline}</p>
          <nav className="footer-nav" aria-label="Footer navigation">
            {portfolio.navigation.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
          </nav>
          <small>© {new Date().getFullYear()} {portfolio.footer.copyrightName}</small>
        </footer>
      </div>
    </main>
  );
}

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
    </div>
  );
}
