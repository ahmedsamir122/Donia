import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../../loading/Loading";
import { useQuery } from "react-query";
import axios from "axios";
import classes from "./Conversion.module.css";
import { URL } from "../../../utils/queryFunctions";
import { useState } from "react";
import dateFormat from "dateformat";

const Conversion = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const tokenLocal = localStorage.getItem("token") || "";
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const fetchMessages = () => {
    return axios.get(`${URL}/api/v1/messages/get-meesages-admin/${id}`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "chat",
    fetchMessages,
    { refetchOnWindowFocus: false }
  );
  const fetchUsers = () => {
    return axios.get(`${URL}/api/v1/conversations/getOne-admin/${id}`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const {} = useQuery("users", fetchUsers, {
    refetchOnWindowFocus: false,
    onSuccess: (fetchedData) => {
      setLeft(fetchedData.data.data.conversation.users[0].username);
      setRight(fetchedData.data.data.conversation.users[1].username);
    },
  });

  if (isLoading || isFetching) {
    return (
      <div className={classes.mainLoading}>
        <Loading />
      </div>
    );
  }

  if (isError || !data) {
    return <div>{error?.response.data.message}</div>;
  }

  return (
    <>
      <div className={classes.header}>
        <h2>Chat</h2>
      </div>
      <div className={classes.chatContainer}>
        {data.data.data.messages.map((mess) =>
          mess.sender.username === left ? (
            <div className={classes.chatCard} key={mess.id}>
              <div>
                <img
                  src={mess.sender.photo}
                  alt={`User ${mess.sender.username}`}
                />
              </div>
              <div className={classes.chat}>
                <div className={classes.chatHeader}>
                  <h5>{mess.sender.username}</h5>
                  <span>{dateFormat(mess.createdAt, "HH:MM")}</span>
                </div>
                <p>{mess.content}</p>
              </div>
            </div>
          ) : (
            <div
              className={`${classes.chatCard} ${classes.right}`}
              key={mess.id}
            >
              <div>
                <img
                  src={mess.sender.photo}
                  alt={`User ${mess.sender.username}`}
                />
              </div>
              <div className={classes.chat}>
                <div className={classes.chatHeader}>
                  <h5>{mess.sender.username}</h5>
                  <span>{dateFormat(mess.createdAt, "HH:MM")}</span>
                </div>
                <p>{mess.content}</p>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};
export default Conversion;
