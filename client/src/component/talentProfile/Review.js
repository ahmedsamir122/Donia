import classes from "./Review.module.css";
import HalfRating from "../rating/Rate";
import React from "react";
import TimeAgo from "react-timeago";

const Review = (props) => {
  let exist;

  if (props.client) {
    exist = props.review?.reviewFs.length > 0;
  } else {
    exist = props.review?.reviewCs.length > 0;
  }

  return (
    <React.Fragment>
      {exist && (
        <div className={classes.main}>
          <div className={classes.top}>
            <div className={classes.topLeft}>
              <div className={classes.client}>
                <img
                  className={classes.img}
                  src={
                    props.client
                      ? props.review.freelancer.photo
                      : props.review.client.photo
                  }
                  alt=""
                />
                <span>
                  {props.client
                    ? props.review.freelancer.username
                    : props.review.client.username}
                </span>
              </div>
              <div>
                <HalfRating
                  value={
                    props.client
                      ? props.review?.reviewFs[0].rating
                      : props.review?.reviewCs[0].rating
                  }
                />
              </div>
            </div>
            <div className={classes.topRight}>
              <TimeAgo
                date={
                  props.client
                    ? props.review?.reviewFs[0].createdAt
                    : props.review?.reviewCs[0].createdAt
                }
              />
            </div>
          </div>
          <div className={classes.content}>
            {props.client
              ? props.review?.reviewFs[0].review
              : props.review?.reviewCs[0].review}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Review;
