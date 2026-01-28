import styles from "./Hero.module.css";
import hero1 from "../../assets/hero/hero1.webp";
import hero2 from "../../assets/hero/hero2.webp";
import hero3 from "../../assets/hero/hero3.webp";
import mobHero1 from "../../assets/hero/mob-hero1.webp";
import mobHero2 from "../../assets/hero/mob-hero2.webp";
import mobHero3 from "../../assets/hero/mob-hero3.webp";

import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const desktopImages = [hero1, hero2, hero3];
const mobileImages = [mobHero1, mobHero2, mobHero3];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % desktopImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const images = windowWidth < 768 ? mobileImages : desktopImages;

  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className={styles.hero}>
      <div
        className={styles.heroImg}
        style={{ backgroundImage: `url(${images[current]})` }}
      />
      <div className={styles.heroBtns}>
        <button className={styles.prevBtn} onClick={prevImage}>
          <FiChevronLeft size={30} />
        </button>
        <button className={styles.nextBtn} onClick={nextImage}>
          <FiChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default Hero;
