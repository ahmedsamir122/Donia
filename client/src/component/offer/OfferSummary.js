import classes from "./OfferSummary.module.css";
const OfferSummary = () => {
  return (
    <div className={classes.main}>
      <div className={classes.subMain}>
        <div className={classes.summaryTitle}>Payment details</div>
        <div>
          <div className={classes.itemBox}>
            <div className={classes.itemDetails}>contract budget</div>
            <div className={classes.itemDetails}>1000</div>
          </div>
          <div className={classes.itemBox}>
            <div className={classes.itemDetails}>admin fee</div>
            <div className={classes.itemDetails}>1000</div>
          </div>
        </div>
        <div className={classes.totalBox}>
          <div className={classes.totalTitle}>Total</div>
          <div className={classes.totalNumber}>1000</div>
        </div>
        {/* <button className={classes.submit}>submit your offer</button> */}
      </div>
    </div>
  );
};

export default OfferSummary;
