import user from "../../img/user.jpg";
import classes from "./Review.module.css";
import { IoIosArrowDown } from "react-icons/io";
import Reply from "./Reply";
import { useState } from "react";

const Review = () => {
  const [showReply, setShowReply] = useState(false);
  const showReplyHandler = () => {
    setShowReply(!showReply);
  };
  return (
    <div className={classes.card}>
      <div className={classes.top}>
        <img className={classes.img} src={user} alt="" />
        <div className={classes.name}>name</div>
      </div>
      <div>I am very i have chosed you for my product</div>
      <div className={classes.bottom}>
        <div>05/06/2023</div>
        <div className={classes.resp} onClick={showReplyHandler}>
          <div>the response</div>
          <IoIosArrowDown />
        </div>
      </div>
      {showReply && <Reply />}
    </div>
  );
};

export default Review;
