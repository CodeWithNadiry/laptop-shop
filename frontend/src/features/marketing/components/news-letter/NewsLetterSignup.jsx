import { MdSend } from "react-icons/md";
import styles from "./NewsLetterSignup.module.css";

const NewsLetterSignup = () => {
  return (
    <div className={styles.newsLetter}>
      <h1>Exclusive Dell deals await</h1>
      <p>
        Join the Dell Tech Insider list and be the first in South Africa to
        unlock special offers, tech insights, and more.
      </p>
      <div className={styles.submitBtn}>
        <input type="text" placeholder="Enter your email" />
        <button>
          <MdSend />
          <span>Subscribe</span>
        </button>
      </div>
    </div>
  );
};

export default NewsLetterSignup;
