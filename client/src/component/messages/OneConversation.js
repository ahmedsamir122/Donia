import { useSelector } from "react-redux";
import classes from "./OneConversation.module.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useMutation } from "react-query";
import { updateFileData, URL } from "../utils/queryFunctions";

const OneConversation = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const other = props.conversation?.users?.filter((u) => u._id !== user._id);

  const updateConversation = (data) => {
    return updateFileData(
      `${URL}/api/v1/conversations/close/${props.conversation._id}`,
      data,
      token
    );
  };

  const { mutate, isError, error, isLoading } = useMutation(
    updateConversation,
    {
      onSuccess: (data) => {},
    }
  );

  const showSwal = (type) => {
    withReactContent(Swal)
      .fire({
        title: "Are you sure?",
        text: `You will close this conversation and you can't send or recieve messages anyomre and you can't open it again`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Sure",
      })
      .then((result) => {
        if (result.isConfirmed) {
          mutate();
        }
      });
  };

  const closeConversation = (e) => {
    e.stopPropagation();
    console.log("close");
    showSwal();
  };
  console.log(props.conversation.closed);
  return (
    <React.Fragment>
      {!isLoading && (
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
          {!props.conversation.closed && (
            <div className={classes.close} onClick={closeConversation}>
              X
            </div>
          )}
        </div>
      )}
      {isLoading && <p>loading...</p>}
    </React.Fragment>
  );
};

export default OneConversation;
