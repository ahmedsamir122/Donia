import classes from "./MessagesContent.module.css";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import OneConversation from "./OneConversation";
import { getWishList, URL } from "../utils/queryFunctions";
import { useEffect, useState } from "react";
import React from "react";

const AllConversations = (props) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const lastMessageRed = useSelector((state) => state.lastMessage.lastMessage);
  const [q, setQ] = useState("");
  const [sortedConversations, setSortedConversation] = useState(null);
  const [newConversations, setNewConversation] = useState([]);

  const fetchConversations = () => {
    return getWishList(
      `${URL}/api/v1/conversations/myConversations${q}`,
      token
    );
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
    setQ(props.searchName ? `?username=${props.searchName}` : "");
  }, [props.searchName]);
  useEffect(() => {
    if (!token) {
      return;
    }
    refetch();
    setNewConversation(data?.data?.data?.conversations);
  }, [q, token]);
  useEffect(() => {
    console.log("new", newConversations);
    if (!user || !newConversations) {
      return;
    }

    const index = newConversations.findIndex((c) => {
      return c._id === lastMessageRed?.latestMessage?.conversationId;
    });
    console.log(index, newConversations, lastMessageRed);
    if (index >= 0) {
      const updatedConversations = [...newConversations];
      updatedConversations[index] = {
        ...updatedConversations[index],
        latestMessage: lastMessageRed.latestMessage,
      };
      setNewConversation(updatedConversations);
    }
    if (index < 0 && Object.keys(lastMessageRed).length > 0) {
      console.log("last", lastMessageRed);
      setNewConversation((prev) => {
        if (lastMessageRed.conversationId) {
          return [...prev];
        }
        return [
          ...prev,
          {
            users: [
              {
                photo: lastMessageRed?.sender?.photo,
                _id: lastMessageRed?.sender?._id,
                username: lastMessageRed?.sender?.username,
              },
              {
                photo:
                  "https://res.cloudinary.com/dxgixa7am/image/upload/v1684210075/Donia/cgikrnwmqzxo1cgdizmw.jpg",
                _id: lastMessageRed.recieverId,
                username: "Ahmedfullsamir_20",
              },
            ],
            closed: false,
            createdAt: lastMessageRed.createdAt,
            _id: lastMessageRed.conversationId,
            latestMessage: lastMessageRed,
          },
        ];
      });
    }
  }, [data?.data.data.conversations, lastMessageRed, user]);

  useEffect(() => {
    if (newConversations?.length > 1) {
      setSortedConversation(
        newConversations.sort(
          (a, b) =>
            new Date(b.latestMessage?.createdAt) -
            new Date(a.latestMessage?.createdAt)
        )
      );
    } else {
      setSortedConversation(() => {
        if (newConversations?.length === 0 || !newConversations) {
          return;
        }
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
