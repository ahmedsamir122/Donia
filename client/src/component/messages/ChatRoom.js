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
import { io } from "socket.io-client";

const ChatRoom = (props) => {
  const params = useParams();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [other, setOther] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    setSocket(io(URL));
    socket?.emit("addUser", user?._id);
    socket?.on("getMessage", (data) => {
      setArrivalMessage({
        createdAt: Date.now(),
        content: data.text,
        sender: {
          photo: other[0].photo,
          username: other[0].username,
          _id: other[0]._id,
        },
        conversation: data.conversationId,
      });
    });
  }, [other]);

  useEffect(() => {
    if (arrivalMessage.conversation === params.messageId) {
      setAllMessages((prev) => {
        return [...prev, arrivalMessage];
      });
    }
  }, [arrivalMessage, params.messageId]);

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
  });
  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  console.log(dataFetchCurrentConversation?.data.data.conversation);

  const { mutate, isError, error } = useMutation(sendMessage, {
    onSuccess: (data) => {
      reset();
      setAllMessages((prev) => {
        return [...prev, data.data.data.message];
      });

      socket.emit("sendMessage", {
        senderId: user._id,
        recieverId: other._id,
        text: data.data.data.message.content,
        conversationId: data.data.data.message.conversation,
      });
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
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);
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
        {other.length > 0 && (
          <img className={classes.img} src={other[0]?.photo} alt="" />
        )}
        {other.length > 0 && <p>{other[0]?.username}</p>}
      </div>
      <div className={classes.chatCon}>
        <div className={classes.messagesCon}>
          {allMessages?.map((c) => (
            <div ref={scrollRef}>
              <OneMessage
                key={c._id}
                message={c}
                own={c.sender?._id === user._id}
              />
            </div>
          ))}
        </div>
        <form className={classes.form} onSubmit={handleSubmit(onsubmit)}>
          <textarea
            className={classes.inputChat}
            {...register("chat", { required: true })}
          ></textarea>
          {isValid && <button className={classes.buttonChat}>send</button>}
        </form>
      </div>
    </div>
  );
};
export default ChatRoom;
