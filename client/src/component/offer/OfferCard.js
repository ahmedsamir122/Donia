import classes from "./OfferCard.module.css";
import OfferDetails from "./OfferDetails";
import OfferSummary from "./OfferSummary";
const OfferCard = () => {
  return (
    <div className={classes.main}>
      <div className="container">
        <div>
          <h3 className={classes.mainTitle}> Create An offer</h3>
        </div>
        <div className={classes.body}>
          <OfferDetails />
          <OfferSummary />
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
