import classes from "./ReviewBoth.module.css";
import Review from "./Review";
import ReviewReply from "./ReviewReply";
const ReviewBoth = (props) => {
  return (
    <div className={classes.main}>
      {props.reviews.map((item, i) => {
        return (
          <div key={i} className={classes.subMain}>
            <Review client={props.client} review={item} />
            <ReviewReply client={props.client} review={item} />
          </div>
        );
      })}
    </div>
  );
};

export default ReviewBoth;
