import ReactDOM from "react-dom";
import React from "react";
import Photo from "../talentProfile/Photo";
const PhotoCard = (props) => {
  return (
    <React.Fragment>
      <Photo onClick={props.onClick} />
    </React.Fragment>
  );
};
const PhotoModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <PhotoCard onClick={props.onClick} />,
        document.getElementById("review")
      )}
    </React.Fragment>
  );
};

export default PhotoModal;
