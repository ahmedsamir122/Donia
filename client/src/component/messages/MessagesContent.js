import classes from "./MessagesContent.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import img1 from "../../img/user2.jpg";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import OneConversation from "./OneConversation";
import { getWishList, URL } from "../utils/queryFunctions";

const MessageContent = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const fetchConversations = () => {
    return getWishList(`${URL}/api/v1/conversations/myConversations`, token);
  };

  const { isLoading, error, data, refetch, isFetching } = useQuery(
    "conversations",
    fetchConversations,
    {
      refetchOnWindowFocus: false,
      enabled: !!user, // Only execute the query if userId is truthy
    }
  );

  console.log(data?.data.data.conversations);

  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.messagesCon}>
          <div className={classes.left}>
            <div className={classes.topLeft}>
              <input className={classes.input} placeholder="Search messages " />
              <SearchOutlinedIcon className={classes.searchIcon} />
            </div>
            <div className={classes.conversationCon}>
              {data?.data.data.conversations.map((item) => (
                <OneConversation key={item._id} conversation={item} />
              ))}
            </div>
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
