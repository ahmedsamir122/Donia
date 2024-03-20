import classes from "./EmptyRoom.module.css";
import { useDispatch } from "react-redux";
import { lastMessageActions } from "../../store/lastMessage";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const EmptyRoom = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const pusher = useSelector((state) => state.pusher.pusher);
  useEffect(() => {
    console.log(pusher);
    const userId = user?.id;
    if (!userId || !token || !pusher) {
      return; // Wait until user ID is available
    }
    var channel = pusher?.subscribe(`channel-${user?.id}`);
    channel?.bind(`event-${user?.id}`, function (data) {
      let send;

      send = {
        users: [
          {
            photo: user.photo,
            _id: user._id,
            username: user.username,
            id: user._id,
          },
          {
            photo: data?.sender.photo,
            _id: data?.sender.id,
            username: data?.sender.username,
            id: data?.sender.id,
          },
        ],
        closed: false,
        _id: data?.conversation,
        latestMessage: {
          sender: {
            photo: data?.sender.photo,
            username: data?.sender.username,
            _id: data?.sender.id,
          },
          recieverId: user?.id,
          content: data?.message,
          conversationId: data?.conversation,
          createdAt: Date.now(),
          isSeen: data?.conversation === params.messageId,
          closed: false,
        },
      };
      // }
      console.log(send);
      dispatch(lastMessageActions.getLastMessage(send));
    });
    // return () => {
    //   channel.unsubscribe(`channel-${user?.id}`);
    //   // pusher.disconnect();
    // };
  }, [user, token, pusher]);
  return (
    <div className={classes.title}>Open a conversation to start a chat</div>
  );
};

export default EmptyRoom;
