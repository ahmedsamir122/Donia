import ReactDOM from "react-dom";
import React from "react";
import AddBio from "../talentProfile/ِAddBio";
const AboutCard = (props) => {
  return (
    <React.Fragment>
      <AddBio onClick={props.onClick} />
    </React.Fragment>
  );
};
const AboutModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <AboutCard onClick={props.onClick} />,
        document.getElementById("About")
      )}
    </React.Fragment>
  );
};

export default AboutModal;
