import styles from "./Footer.module.css";

const Footer = () => {
  const popularSearches = [
    "Dell Laptops",
    "Dell Support",
    "Dell Inspiron",
    "Dell Latitude",
    "Dell 24 inch monitor",
    "Dell 27 inch monitor",
    "Join our Partner Network",
  ];

  const customerService = [
    "Help",
    "Track my Order",
    "Support | Dell South Africa",
    "Shipping & Delivery",
    "Returns",
    "Talk to an Expert",
    "Dell Business",
  ];

  const getInTouch = [
    "+27 11 082 5900",
    "Email us",
    "Live chat",
  ];

  const footerLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
  ];

  return (
    <footer className={`sec-container ${styles.footer}`}>
      <div className={styles.footerTop}>
        <div className={styles.column1}>
          <h2>Popular Dell Searches</h2>
          <ul>
            {popularSearches.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.column2}>
          <h2>Customer Service</h2>
          <ul>
            {customerService.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.column3}>
          <h2>Get in touch</h2>
          <ul>
            {getInTouch.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2025 Dell Official Online Store | South Africa</p>
        <ul className={styles.footerLinks}>
          {footerLinks.map((link, index) => (
            <li key={index}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
