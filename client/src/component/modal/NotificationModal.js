import ReactDOM from "react-dom";
import React from "react";
import Notifications from "../navBar/notification/Notifications";

const NotificationCard = (props) => {
  return (
    <React.Fragment>
      <Notifications
        onNotification={props.onNotification}
        dataNotes={props.dataNotes}
      />
    </React.Fragment>
  );
};
const NotificationModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <NotificationCard
          onNotification={props.onNotification}
          dataNotes={props.dataNotes}
        />,
        document.getElementById("Notification")
      )}
    </React.Fragment>
  );
};

export default NotificationModal;
