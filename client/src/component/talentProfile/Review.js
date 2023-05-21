import classes from "./Review.module.css";
import user from "../../img/user2.jpg";
import HalfRating from "../rating/Rate";
const Review = () => {
  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topLeft}>
          <div className={classes.client}>
            <img className={classes.img} src={user} alt="" />
            <span>zaki</span>
          </div>
          <div>
            <HalfRating value={2} />
          </div>
        </div>
        <div className={classes.topRight}>3 days ago</div>
      </div>
      <div className={classes.content}>" nice to work with you "</div>
    </div>
  );
};

export default Review;
