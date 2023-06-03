import classes from "./ReviewReply.module.css";
import React from "react";
import HalfRating from "../rating/Rate";
const ReviewReply = (props) => {
  let exist;

  if (props.client) {
    exist = props.review?.reviewCs.length > 0;
  } else {
    exist = props.review?.reviewFs.length > 0;
  }

  console.log(props.review);
  return (
    <React.Fragment>
      {exist && (
        <div className={classes.main}>
          <div className={classes.top}>
            <h2>{props.client ? "to talent" : "to Client"}</h2>
            <HalfRating
              value={
                props.client
                  ? props.review?.reviewCs[0].rating
                  : props.review?.reviewFs[0].rating
              }
            />
          </div>
          <div className={classes.content}>
            {props.client
              ? props.review.reviewCs[0].review || "no feedback"
              : props.review.reviewFs[0].review || "no feedback"}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ReviewReply;
