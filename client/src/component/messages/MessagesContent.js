import classes from "./MessagesContent.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Outlet } from "react-router-dom";
import AllConversations from "./AllConversations";
import { useState } from "react";
import { useRef } from "react";

const MessageContent = () => {
  const [username, setUsername] = useState("");
  const usenameRef = useRef();
  const searchHandler = (e) => {
    setUsername(usenameRef.current.value);
  };
  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.messagesCon}>
          <div className={classes.left}>
            <div className={classes.topLeft}>
              <input
                className={classes.input}
                placeholder="Search messages "
                ref={usenameRef}
              />
              <SearchOutlinedIcon
                className={classes.searchIcon}
                onClick={searchHandler}
              />
            </div>

            <AllConversations searchName={username} />
          </div>
          <div className={classes.right}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageContent;
