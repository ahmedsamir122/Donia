import ReactDOM from "react-dom";
import React from "react";
import FilterClient from "../talentProfile/FilterClient";
const FilterClientCard = (props) => {
  return (
    <React.Fragment>
      <FilterClient onClick={props.onClick} />
    </React.Fragment>
  );
};
const FilterClientModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <FilterClientCard onClick={props.onClick} />,
        document.getElementById("FilterClient")
      )}
    </React.Fragment>
  );
};

export default FilterClientModal;
