import ReactDOM from "react-dom";
import React from "react";
import Messages from "../navBar/messages/Messages";
const MessageCard = (props) => {
  return (
    <React.Fragment>
      <Messages onMessage={props.onMessage} />
    </React.Fragment>
  );
};
const MessageModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <MessageCard onMessage={props.onMessage} />,
        document.getElementById("Messages")
      )}
    </React.Fragment>
  );
};

export default MessageModal;
