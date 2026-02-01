import Button from "../../../../components/ui/button/Button";
import styles from "./FeaturedProductCard.module.css";
const FeaturedProductCard = ({
  data: { quality, name, description, image },
}) => {
  return (
    <div className={styles.featuredCard}>
      <img
        src={image ? `https://laptop-shop-production.up.railway.app//${image}` : "/placeholder.png"}
        alt="featured-product"
      />
      <div className={styles.cardContent}>
        <p>{quality}</p>
        <h1 style={{ textAlign: "left", marginBlock: 0 }}>{name}</h1>
        <p>{description}</p>
        <div className={styles.cardActions}>
          <Button size="lg">Shop Dell</Button>
          <Button size="lg" variant="outline">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductCard;
