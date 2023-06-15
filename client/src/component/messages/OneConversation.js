import { useSelector } from "react-redux";
import classes from "./OneConversation.module.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const OneConversation = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const user = useSelector((state) => state.auth.user);
  const lastMessage = useSelector((state) => state.lastMessage.lastMessage);

  const other = props.conversation?.users?.filter((u) => u._id !== user._id);

  return (
    <div
      className={`${classes.conversation} ${
        params.messageId === props.conversation._id && classes.active
      }`}
      onClick={() => navigate(`/messages/${props.conversation._id}`)}
    >
      <img className={classes.img} src={other[0]?.photo} alt="" />
      <div className={classes.dataUser}>
        <div className={classes.dataTop}>
          <p className={classes.userName}>{other[0]?.username}</p>
          <p className={classes.date}>
            {moment(props.conversation?.latestMessage?.createdAt).fromNow()}
          </p>
        </div>
        <div className={classes.textCon}>
          {props.conversation?.latestMessage?.sender?._id === user?._id && (
            <p className={classes.sender}>You:</p>
          )}
          <p className={classes.text}>
            {props.conversation.latestMessage?.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OneConversation;
