import classes from "./OneReview.module.css";
import HalfRating from "../rating/Rate";
import TimeAgo from "react-timeago";
const OneReview = (props) => {
  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topLeft}>
          <div className={classes.client}>
            <img className={classes.img} src={props.otherData.photo} alt="" />
            <span>{props.otherData.username}</span>
          </div>
          <div>
            <HalfRating value={props.review.rating} />
          </div>
        </div>
        <div className={classes.topRight}>
          <TimeAgo date={props.review.createdAt} />
        </div>
      </div>
      <div className={classes.content}>{props.review.review}</div>
    </div>
  );
};
export default OneReview;
