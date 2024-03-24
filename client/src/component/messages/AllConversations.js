import classes from "./MessagesContent.module.css";
import { useQuery, useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import OneConversation from "./OneConversation";
import { getWishList, URL } from "../utils/queryFunctions";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { useInView } from "react-intersection-observer";
import Loading from "../loading/Loading";

const AllConversations = (props) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const lastMessageRed = useSelector((state) => state.lastMessage.lastMessage);
  const [q, setQ] = useState("");
  const [sortedConversations, setSortedConversation] = useState(null);
  const [newConversations, setNewConversation] = useState([]);
  const { ref, inView } = useInView();
  const wasInView = useRef(false);

  const fetchConversations = ({ pageParam = 1 }) => {
    console.log(pageParam);
    return getWishList(
      `${URL}/api/v1/conversations/myConversations?page=${pageParam}&limit=5${q}`,
      token
    );
  };

  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(["conversations"], fetchConversations, {
    getNextPageParam: (lastPage, allPages) => {
      console.log(lastPage, allPages);
      const nextpage = lastPage.data.data.conversations.length
        ? allPages.length + 1
        : undefined;
      return nextpage;
    },
    refetchOnWindowFocus: false,
    enabled: !!user,
    onSuccess: (data) => {
      console.log(data);
      const newData = data.pages.reduce((acc, page) => {
        acc.push(...page.data.data.conversations);
        return acc;
      }, []);
      console.log(newData);
      setNewConversation(newData);
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    setQ(props.searchName ? `&username=${props.searchName}` : "");
  }, [props.searchName]);
  useEffect(() => {
    if (!user) {
      return;
    }
    refetch();
  }, [q, token]);
  useEffect(() => {
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
        return [...prev, lastMessageRed];
      });
    }
  }, [data, lastMessageRed, user]);

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

  return (
    <React.Fragment>
      {sortedConversations?.length > 0 && (
        <div className={classes.conversationCon}>
          {sortedConversations?.map((item, index) => {
            if (sortedConversations.length === index + 1) {
              return (
                <OneConversation
                  key={item._id}
                  conversation={item}
                  finalConversations={sortedConversations}
                  innerRef={ref}
                />
              );
            }
            return (
              <OneConversation
                key={item._id}
                conversation={item}
                finalConversations={sortedConversations}
              />
            );
          })}
        </div>
      )}
      {(isFetching || isLoading) && (
        <div>
          <Loading />
        </div>
      )}
      {!sortedConversations && !isFetching && <p>no conversation found</p>}
    </React.Fragment>
  );
};

export default AllConversations;
