import classes from "./ChatRoom.module.css";
import img1 from "../../img/user2.jpg";
import { Link, useParams } from "react-router-dom";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getWishList, URL } from "../utils/queryFunctions";
import { useQuery } from "react-query";
import OneMessage from "./OneMessage";
import { useMutation } from "react-query";
import { postDataProtect } from "../utils/queryFunctions";
import { useEffect, useRef, useState } from "react";
import Loading from "../loading/Loading";
// import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { lastMessageActions } from "../../store/lastMessage";
// import Pusher from "pusher-js";

// const tokenLocal = localStorage.getItem("token") || "";

// const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
//   cluster: process.env.REACT_APP_PUSHER_CLUSTER,
//   authEndpoint: `${URL}/api/v1/pusher/auth`,
//   auth: {
//     headers: {
//       Authorization: `Bearer ${tokenLocal}`,
//     },
//   },
// });

const ChatRoom = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const pusher = useSelector((state) => state.pusher.pusher);
  const [other, setOther] = useState([]);
  const [fix, setFix] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [liveMembers, setLiveMembers] = useState([]);
  const [showActive, setShowActive] = useState(false);
  // const [socket, setSocket] = useState(null);
  // const socket = useSelector((state) => state.socket.socket);

  const scrollRef = useRef();

  // useEffect(() => {
  //   socket?.on("getMessage", (data) => {
  //     setArrivalMessage({
  //       createdAt: Date.now(),
  //       content: data.text,
  //       sender: {
  //         photo: other[0].photo,
  //         username: other[0].username,
  //         _id: other[0]._id,
  //       },
  //       conversation: data.conversationId,
  //     });
  //   });
  // }, []);

  const fetchCurrentConversation = () => {
    return getWishList(
      `${URL}/api/v1/conversations/getOne/${params.messageId}`,
      token
    );
  };
  const fetchMessages = () => {
    return getWishList(`${URL}/api/v1/messages/${params.messageId}`, token);
  };

  const sendMessage = (data) => {
    return postDataProtect(
      `${URL}/api/v1/messages/${params.messageId}`,
      data,
      token
    );
  };

  const {
    isLoading: isLoadingFetch,
    error: errorFetch,
    data: dataFetch,
    refetch: refetchMessage,
  } = useQuery("oneConversation", fetchMessages, {
    refetchOnWindowFocus: false,
    enabled: !!user, // Only execute the query if userId is truthy
  });

  useEffect(() => {
    setAllMessages(dataFetch?.data.data.messages);
  }, [dataFetch?.data.data.messages]);

  const {
    isLoading: isLoadingCurrentConversation,
    error: errorFetchCurrentConversation,
    data: dataFetchCurrentConversation,
    refetch: refetchCurrentConversation,
  } = useQuery("currentConversation", fetchCurrentConversation, {
    refetchOnWindowFocus: false,
    enabled: !!user, // Only execute the query if userId is truthy
  }); // to get te sender and reciever data as the message has the sender data only
  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { mutate, isError, error } = useMutation(sendMessage, {
    onSuccess: (data) => {
      reset();
      setAllMessages((prev) => {
        return [...prev, data.data.data.message];
      });

      // socket.emit("sendMessage", {
      //   senderId: user._id,
      //   recieverId: other[0]._id,
      //   text: data.data.data.message.content,
      //   conversationId: data.data.data.message.conversation,
      //   createdAt: Date.now(),
      // });

      let send;

      if (
        !dataFetchCurrentConversation?.data.data.conversation.latestMessage &&
        !fix
      ) {
        send = {
          ...dataFetchCurrentConversation?.data.data.conversation,
          latestMessage: {
            createdAt: Date.now(),
            content: data.data.data.message.content,
            sender: {
              photo: data.data.data.message.sender.photo,
              username: data.data.data.message.sender.username,
              _id: data.data.data.message.sender._id,
            },
            conversationId: data.data.data.message.conversation,
          },
        };
        setFix(true);
      } else {
        send = {
          ...dataFetchCurrentConversation?.data.data.conversation,
          latestMessage: {
            sender: {
              _id: user._id,
              username: user.username,
              photo: user.photo,
            },
            recieverId: other[0]._id,
            recieverPhoto: other[0].photo,
            content: data.data.data.message.content,
            conversationId: data?.data?.data?.message.conversation,
            createdAt: Date.now(),
          },
        };
      }

      dispatch(lastMessageActions.getLastMessage(send));
    },
  });

  const onsubmit = async (data) => {
    const [chat] = getValues(["chat"]);
    console.log(isValid);
    mutate({ content: chat });
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    refetchMessage();
    refetchCurrentConversation();

    if (dataFetchCurrentConversation?.data?.data?.conversation?.users) {
      setOther(
        dataFetchCurrentConversation?.data.data.conversation.users?.filter(
          (u) => u._id !== user._id
        )
      );
    }
  }, [
    params.messageId,
    dataFetchCurrentConversation?.data?.data?.conversation?.users,
    user,
  ]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  }, [allMessages]);

  useEffect(() => {
    console.log(pusher);
    const userId = user?.id;
    if (!userId || !token || !pusher) {
      return; // Wait until user ID is available
    }
    var channel = pusher?.subscribe(`channel-${user?.id}`);
    channel?.bind(`event-${user?.id}`, function (data) {
      setArrivalMessage(data);
      // if (data?.conversation === paramsId) {
      // setAllMessages((prev) => {
      //   return [
      //     ...prev,
      //     {
      //       createdAt: Date.now(),
      //       content: data?.message,
      //       sender: {
      //         photo: data?.sender.photo,
      //         username: data?.sender.username,
      //         _id: data?.sender.id,
      //       },
      //       conversation: data?.conversation,
      //     },
      //   ];
      // });
      // }
      let send;

      if (
        !dataFetchCurrentConversation?.data.data.conversation.latestMessage &&
        !fix
      ) {
        send = {
          ...dataFetchCurrentConversation?.data.data.conversation,
          latestMessage: {
            createdAt: Date.now(),
            content: data.message,
            sender: {
              photo: data?.sender.photo,
              username: data?.sender.username,
              _id: data?.sender.id,
            },
            conversationId: data?.conversation,
          },
        };
        setFix(true);
      } else {
        send = {
          sender: {
            photo: data?.sender.photo,
            username: data?.sender.username,
            _id: data?.sender.id,
          },
          recieverId: user?.id,
          content: data?.message,
          conversationId: data?.conversation,
          createdAt: Date.now(),
        };
      }

      dispatch(lastMessageActions.getLastMessage(send));
    });
    // return () => {
    //   channel.unsubscribe(`channel-${user?.id}`);
    //   // pusher.disconnect();
    // };
  }, [user, token, pusher]);

  useEffect(() => {
    if (!token || !pusher) {
      return; // Wait until user ID is available
    }
    const channel = pusher?.subscribe(`presence-channel-${params.messageId}`);

    channel?.bind("pusher:subscription_succeeded", (members) => {
      console.log("Successfully subscribed to presence channel:", members);
      const keysArray = Object.keys(members.members);
      setLiveMembers(keysArray);
    });

    channel?.bind("pusher:member_added", (member) => {
      console.log("User joined:", member);
      setLiveMembers([member.id, user?._id]);
    });

    channel?.bind("pusher:member_removed", (member) => {
      console.log("User left:", member);
      setLiveMembers([user?._id]);
    });
    return () => {
      console.log("Unsubscribing from the current channel");
      channel?.unsubscribe();
    };
  }, [user, params, token, pusher]);

  console.log(dataFetchCurrentConversation?.data.data.conversation);

  useEffect(() => {
    if (arrivalMessage?.conversation === params.messageId) {
      setAllMessages((prev) => {
        return [
          ...prev,
          {
            createdAt: Date.now(),
            content: arrivalMessage?.message,
            sender: {
              photo: arrivalMessage?.sender.photo,
              username: arrivalMessage?.sender.username,
              _id: arrivalMessage?.sender.id,
            },
            conversation: arrivalMessage?.conversation,
          },
        ];
      });
    }
  }, [arrivalMessage]);

  useEffect(() => {
    const member = liveMembers.find((m) => m === other[0]?.id);
    if (member) {
      setShowActive(true);
    } else {
      setShowActive(false);
    }
  }, [liveMembers, other]);

  if (isLoadingFetch || isLoadingCurrentConversation) {
    return (
      <div className={classes.loading}>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <Link to="/messages">
          <KeyboardArrowLeftOutlinedIcon className={classes.backIcon} />
        </Link>
        <div>
          <div className={classes.userCon}>
            {other.length > 0 && (
              <img className={classes.img} src={other[0]?.photo} alt="" />
            )}
            <div>
              {other.length > 0 && <p>{other[0]?.username}</p>}
              {showActive && <p className={classes.active}>connected</p>}
              {!showActive && (
                <p className={classes.notActive}>not connected</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.chatCon}>
        <div className={classes.messagesCon}>
          {allMessages?.map((c) => (
            <div ref={scrollRef} key={c._id}>
              <OneMessage message={c} own={c.sender?._id === user._id} />
            </div>
          ))}
        </div>
        {!dataFetchCurrentConversation?.data.data.conversation.closed && (
          <form className={classes.form} onSubmit={handleSubmit(onsubmit)}>
            <textarea
              className={classes.inputChat}
              {...register("chat", { required: true })}
            ></textarea>
            {isValid && <button className={classes.buttonChat}>send</button>}
          </form>
        )}
      </div>
    </div>
  );
};
export default ChatRoom;
