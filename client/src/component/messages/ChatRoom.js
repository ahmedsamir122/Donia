import classes from "./ChatRoom.module.css";
import img1 from "../../img/user2.jpg";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getWishList, URL } from "../utils/queryFunctions";
import { useQuery, useInfiniteQuery } from "react-query";
import OneMessage from "./OneMessage";
import { useMutation } from "react-query";
import { postDataProtect, formatDate } from "../utils/queryFunctions";
import { useEffect, useRef, useState } from "react";
import Loading from "../loading/Loading";
import { useDispatch } from "react-redux";
import { lastMessageActions } from "../../store/lastMessage";

const ChatRoom = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const pusher = useSelector((state) => state.pusher.pusher);
  const [other, setOther] = useState([]);
  const [pageMessages, setPageMessages] = useState(1);
  const [allMessages, setAllMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [liveMembers, setLiveMembers] = useState([]);
  const [showActive, setShowActive] = useState(false);

  const scrollRef = useRef();

  const fetchCurrentConversation = () => {
    return getWishList(
      `${URL}/api/v1/conversations/getOne/${params.messageId}`,
      token
    );
  };

  // console.log(pageMessages);

  const fetchMessages = ({ pageParam = 1 }) => {
    console.log(pageParam); // Log the current value of pageMessages
    return getWishList(
      `${URL}/api/v1/messages/${params.messageId}?page=${pageParam}&limit=2`,
      token
    );
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
    error: errorMessages,
    data: dataFetch,
    fetchNextPage,
    isFetching,
    hasNextPage,
    refetch: refetchMessage,
  } = useInfiniteQuery(["oneConversation"], fetchMessages, {
    getNextPageParam: (lastPage, allPages) => {
      const totalPageMessages = Math.ceil(lastPage?.data?.totalMessages / 2);
      console.log(pageMessages, totalPageMessages);
      // const nextpage = lastPage.data.data.messages.length;
      if (pageMessages < totalPageMessages) {
        return pageMessages;
      } else {
        return undefined;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!user,
    onSuccess: (data) => {
      console.log(data);
      const newData = data.pages.reduce((acc, page) => {
        acc.unshift(...page.data.data.messages); // Prepend messages instead of appending
        return acc;
      }, []);
      setAllMessages((prev) => [
        ...data.pages[data.pages.length - 1].data.data.messages,
        ...prev,
      ]); // Combine with existing messages
    },
  });
  console.log(dataFetch);
  useEffect(() => {
    if (!user) {
      return;
    }
  }, [params.messageId, user]);
  useEffect(() => {
    if (!user) {
      return;
    }
    setAllMessages([]);

    setPageMessages(1);
    refetchMessage();
  }, [params.messageId, fetchNextPage, refetchMessage, user]);

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

      let send;

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
          isSeen: true,
        },
      };

      dispatch(lastMessageActions.getLastMessage(send));
    },
  });

  const onsubmit = async (data) => {
    const [chat] = getValues(["chat"]);
    console.log(isValid);
    mutate({ content: chat });
  };

  useEffect(() => {
    if (!user || !token) {
      return;
    }

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
    refetchCurrentConversation,
    token,
  ]);

  const pageMessagesHandler = () => {
    setPageMessages((prev) => prev + 1);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchNextPage();
  }, [pageMessages, user]);

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
      console.log(data);
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
      console.log(send, params.messageId);
      dispatch(lastMessageActions.getLastMessage(send));
    });
    // return () => {
    //   channel.unsubscribe(`channel-${user?.id}`);
    //   // pusher.disconnect();
    // };
  }, [user, token, pusher, params.messageId]);

  useEffect(() => {
    if (!token || !pusher) {
      return; // Wait until user ID is available
    }
    const channel = pusher?.subscribe(`presence-channel-${params.messageId}`);

    channel?.bind("pusher:subscription_succeeded", (members) => {
      // console.log("Successfully subscribed to presence channel:", members);
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

  const groupedMessages = {};
  allMessages.forEach((message) => {
    const date = new Date(message.createdAt);
    const dayKey = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    if (!groupedMessages[dayKey]) {
      groupedMessages[dayKey] = [];
    }
    groupedMessages[dayKey].push(message);
  });

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
          {hasNextPage && !isFetching && (
            <button
              className={classes.buttonMore}
              onClick={pageMessagesHandler}
            >
              load old messages
            </button>
          )}
          {isFetching && <div className={classes.loading}>loading...</div>}

          {Object.entries(groupedMessages).map(([dayKey, messagesInDay]) => (
            <div key={dayKey}>
              <div className={classes.date}>{formatDate(dayKey)}</div>
              {messagesInDay.map((message) => (
                <div ref={scrollRef} key={message._id}>
                  <OneMessage
                    message={message}
                    own={message.sender?._id === user._id}
                  />
                </div>
              ))}
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
        {dataFetchCurrentConversation?.data.data.conversation.closed && (
          <p>
            this conversation is closed you can't send messages unless there is
            new contract or you can contact us for more information
          </p>
        )}
      </div>
    </div>
  );
};
export default ChatRoom;
