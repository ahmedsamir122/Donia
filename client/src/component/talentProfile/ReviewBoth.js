import classes from "./ReviewBoth.module.css";
import Review from "./Review";
import ReviewReply from "./ReviewReply";
const ReviewBoth = () => {
  return (
    <div className={classes.main}>
      <Review />
      <ReviewReply />
    </div>
  );
};

export default ReviewBoth;
