import classes from "./OfferCard.module.css";
import OfferDetails from "./OfferDetails";
import OfferSummary from "./OfferSummary";
import { useState } from "react";
const OfferCard = () => {
  const [price, setPrice] = useState(0);

  const priceHandler = (p) => {
    setPrice(p);
  };
  return (
    <div className={classes.main}>
      <div className="container">
        <div>
          <h3 className={classes.mainTitle}> Create An offer</h3>
        </div>
        <div className={classes.body}>
          <OfferDetails onPrice={priceHandler} />
          <OfferSummary price={price} />
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
