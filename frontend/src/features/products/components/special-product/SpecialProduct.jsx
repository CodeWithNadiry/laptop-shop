import Button from "../../../../components/ui/button/Button";
import styles from "./SpecialProduct.module.css";
const SpecialProduct = ({ name, description, image, quality, btnText, btnText2, fullWidthImg }) => {
  return (
    <div
      className={`${!fullWidthImg && "sec-container"} ${styles.productWrapper}`}
      style={{ paddingRight: "3.7rem" }}
    >
      <div className={styles.productImg}>
        <img
          src={image}
          alt="productivity-product"
          style={{ width: fullWidthImg ? "100%" : "70%" }}
        />
      </div>
      <div className={styles.productContent}>
        <p>{name}</p>
        <h2>{quality}</h2>
        <p>{description}</p>
        <div className={styles.productBtns}>
          <Button variant="purple" size="lg">
            {btnText}
          </Button>
          {btnText2 && (
            <Button variant="purple" size="lg">
              {btnText2}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialProduct;
