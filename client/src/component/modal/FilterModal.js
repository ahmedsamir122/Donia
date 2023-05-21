import ReactDOM from "react-dom";
import Filter from "../search/Filter";
import React from "react";

const FilterCard = (props) => {
  return (
    <React.Fragment>
      <Filter onFilter={props.onFilter} />
    </React.Fragment>
  );
};
const FilterModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <FilterCard onFilter={props.onFilter} />,
        document.getElementById("filter")
      )}
    </React.Fragment>
  );
};

export default FilterModal;
