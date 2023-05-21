import ReactDOM from "react-dom";
import React from "react";
import AddLinks from "../talentProfile/AddLinks";
const AddLinksCard = (props) => {
  return (
    <React.Fragment>
      <AddLinks onClick={props.onClick} />
    </React.Fragment>
  );
};
const AddLinksModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <AddLinksCard onClick={props.onClick} />,
        document.getElementById("Links")
      )}
    </React.Fragment>
  );
};

export default AddLinksModal;
