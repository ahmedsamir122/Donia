import ReactDOM from "react-dom";
import React from "react";
import CreateContract from "../contracts/CreateContract";
import ErrorContract from "../contracts/ErrorContract";
const CreateContractCard = (props) => {
  return (
    <React.Fragment>
      {!props.error && <CreateContract onClick={props.onClick} />}
      {props.error && (
        <ErrorContract
          error={props.error}
          onError={props.onError}
          onClick={props.onClick}
        />
      )}
    </React.Fragment>
  );
};
const CreateContractModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <CreateContractCard
          onClick={props.onClick}
          error={props.error}
          onError={props.onError}
        />,
        document.getElementById("createContract")
      )}
    </React.Fragment>
  );
};

export default CreateContractModal;
