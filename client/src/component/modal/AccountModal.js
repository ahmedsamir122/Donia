import ReactDOM from "react-dom";
import React from "react";
import Account from "../navBar/account/Account";
const AccountCard = (props) => {
  return (
    <React.Fragment>
      <Account onAccount={props.onAccount} />
    </React.Fragment>
  );
};
const AccountModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <AccountCard onAccount={props.onAccount} />,
        document.getElementById("Notification")
      )}
    </React.Fragment>
  );
};

export default AccountModal;
