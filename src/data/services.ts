export const services = [
  {
    id: "wordpress-development",
    title: "WordPress development",
    description: "Custom sites, Elementor design, theme customization.",
    icon: "Code2",
  },
  {
    id: "woocommerce",
    title: "WooCommerce",
    description: "Store setup, checkout and product customization, troubleshooting.",
    icon: "ShoppingBag",
  },
  {
    id: "custom-plugin-development",
    title: "Custom plugin development",
    description: "Custom functionality, integrations, automation.",
    icon: "Puzzle",
  },
  {
    id: "security",
    title: "Security",
    description: "Malware cleanup, hacked site recovery, hardening.",
    icon: "ShieldCheck",
  },
  {
    id: "server-management",
    title: "Server management",
    description: "Hosting and cPanel, migrations, PHP upgrades, backups.",
    icon: "ServerCog",
  },
] as const;

export const serviceOptions = [...services.map(({ title }) => title), "Other"];