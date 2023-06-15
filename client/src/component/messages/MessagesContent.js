import classes from "./MessagesContent.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Outlet } from "react-router-dom";
import AllConversations from "./AllConversations";

const MessageContent = () => {
  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.messagesCon}>
          <div className={classes.left}>
            <div className={classes.topLeft}>
              <input className={classes.input} placeholder="Search messages " />
              <SearchOutlinedIcon className={classes.searchIcon} />
            </div>

            <AllConversations />
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
