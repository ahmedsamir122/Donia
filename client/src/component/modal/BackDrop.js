import ReactDOM from "react-dom";
import React from "react";
import classes from "./BackDrop.module.css";
const BackDropCard = (props) => {
  return (
    <React.Fragment>
      <div className={classes.main} onClick={props.onClick}></div>
    </React.Fragment>
  );
};
const BackDropModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <BackDropCard onClick={props.onClick} />,
        document.getElementById("layer")
      )}
    </React.Fragment>
  );
};

export default BackDropModal;
