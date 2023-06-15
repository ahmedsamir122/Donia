import classes from "./MessagesContent.module.css";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import OneConversation from "./OneConversation";
import { getWishList, URL } from "../utils/queryFunctions";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import React from "react";

const AllConversations = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const lastMessageRed = useSelector((state) => state.lastMessage.lastMessage);
  const [socket, setSocket] = useState(null);
  const [sortedConversations, setSortedConversation] = useState(null);
  const [newConversations, setNewConversation] = useState([]);
  console.log(lastMessageRed);
  useEffect(() => {
    setSocket(io(URL));
    socket?.emit("addUser", user?._id);
  }, [user?._id]);

  const fetchConversations = () => {
    return getWishList(`${URL}/api/v1/conversations/myConversations`, token);
  };
  const onSuccess = (data) => {
    setNewConversation(() => {
      return [...data?.data?.data?.conversations];
    });
  };

  const { isLoading, error, data, refetch, isFetching } = useQuery(
    "conversations",
    fetchConversations,
    {
      refetchOnWindowFocus: false,
      enabled: !!user,
      onSuccess, // Only execute the query if userId is truthy
    }
  );

  useEffect(() => {
    console.log("new", newConversations);
    if (!user || !newConversations) {
      return;
    }

    const index = newConversations.findIndex(
      (c) => c._id === lastMessageRed.conversationId
    );
    if (index >= 0) {
      const updatedConversations = [...newConversations];
      updatedConversations[index] = {
        ...updatedConversations[index],
        latestMessage: lastMessageRed,
      };
      setNewConversation(updatedConversations);
    }
    if (index < 0 && Object.keys(lastMessageRed).length > 0) {
      console.log("last", lastMessageRed);
      setNewConversation((prev) => {
        if (lastMessageRed.conversationId) {
          return [...prev];
        }
        return [...prev, lastMessageRed];
      });
    }
  }, [data?.data.data.conversations, lastMessageRed, user]);

  useEffect(() => {
    if (newConversations.length > 1) {
      setSortedConversation(
        newConversations.sort(
          (a, b) =>
            new Date(b.latestMessage?.createdAt) -
            new Date(a.latestMessage?.createdAt)
        )
      );
    } else {
      setSortedConversation(() => {
        return [...newConversations];
      });
    }
  }, [newConversations]);

  console.log(sortedConversations, newConversations);

  return (
    <React.Fragment>
      {sortedConversations?.length > 0 && (
        <div className={classes.conversationCon}>
          {sortedConversations?.map((item) => (
            <OneConversation
              key={item._id}
              conversation={item}
              finalConverstaions={sortedConversations}
            />
          ))}
        </div>
      )}
      {!sortedConversations && <p>no conversation found</p>}
    </React.Fragment>
  );
};

export default AllConversations;
