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
  const [isSeen, setIsSeen] = useState(
    props.conversation.latestMessage?.isSeen
  );

  const other = props.conversation?.users?.filter((u) => u._id !== user._id);

  const updateConversation = (data) => {
    return updateFileData(
      `${URL}/api/v1/conversations/close/${props.conversation._id}`,
      data,
      token
    );
  };
  const updateٍSeenConversation = (data) => {
    return updateFileData(
      `${URL}/api/v1/messages/${props.conversation._id}`,
      data,
      token
    );
  };

  const {
    mutate: mutateSeen,
    isError: isErrorSeen,
    error: errorSeen,
    isLoading: isLoadingSeen,
  } = useMutation(updateٍSeenConversation, {
    onSuccess: (data) => {
      setIsSeen(true);
    },
  });
  const { mutate, isError, error, isLoading } = useMutation(
    updateConversation,
    {
      onSuccess: (data) => {},
    }
  );
  useEffect(() => {
    setIsSeen(props.conversation.latestMessage?.isSeen);
  }, [props.conversation.latestMessage?.isSeen]);

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

  if (!other) {
    return;
  }
  return (
    <React.Fragment>
      {!isLoading && (
        <div
          className={`${classes.conversation} ${
            params.messageId === props.conversation._id && classes.active
          }`}
          onClick={() => {
            mutateSeen();
            navigate(`/messages/${props.conversation._id}`);
          }}
        >
          <img
            className={classes.img}
            src={other ? other[0]?.photo : null}
            alt=""
          />
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
              <p
                className={`${classes.text} ${
                  !isSeen &&
                  props.conversation?.latestMessage?.sender?._id !==
                    user?._id &&
                  classes.notSeen
                }`}
              >
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
