import ReactDOM from "react-dom";
import React from "react";
import Language from "../navBar/language/Language";
const LanguageCard = (props) => {
  return (
    <React.Fragment>
      <Language
        onNotification={props.onNotification}
        dataNotes={props.dataNotes}
      />
    </React.Fragment>
  );
};
const LanguageModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <LanguageCard
          onNotification={props.onNotification}
          dataNotes={props.dataNotes}
        />,
        document.getElementById("language")
      )}
    </React.Fragment>
  );
};

export default LanguageModal;
