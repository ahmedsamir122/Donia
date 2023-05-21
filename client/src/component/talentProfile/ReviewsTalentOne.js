import ReviewBoth from "./ReviewBoth";
import classes from "./ReviewsTalentOne.module.css";
const ReviewsTalentOne = () => {
  return (
    <div className={classes.reviews}>
      <h2 className={classes.reviewsTitle}>Reviews</h2>
      <ReviewBoth />
      <ReviewBoth />
      <ReviewBoth />
      <ReviewBoth />
      <ReviewBoth />
    </div>
  );
};

export default ReviewsTalentOne;
