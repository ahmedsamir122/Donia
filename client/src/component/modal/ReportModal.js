import ReactDOM from "react-dom";
import React from "react";
import Report1 from "../report/Report1";
const ReportCard = (props) => {
  return (
    <React.Fragment>
      <Report1 onClick={props.onClick} />
    </React.Fragment>
  );
};
const ReportModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <ReportCard onClick={props.onClick} />,
        document.getElementById("report")
      )}
    </React.Fragment>
  );
};

export default ReportModal;
