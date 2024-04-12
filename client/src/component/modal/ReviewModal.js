import ReactDOM from "react-dom";
import React from "react";
import ReviewSubmit from "../contracts/ReviewSubmit";
const ReviewCard = (props) => {
  return (
    <React.Fragment>
      <ReviewSubmit onClick={props.onClick} client={props.client} />
    </React.Fragment>
  );
};
const ReviewModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <ReviewCard onClick={props.onClick} client={props.client} />,
        document.getElementById("review")
      )}
    </React.Fragment>
  );
};

export default ReviewModal;
