import classes from "./ChatRoom.module.css";
import img1 from "../../img/user2.jpg";
import { Link } from "react-router-dom";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

const ChatRoom = () => {
  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <Link to="/messages">
          <KeyboardArrowLeftOutlinedIcon className={classes.backIcon} />
        </Link>
        <img className={classes.img} src={img1} alt="" />
        <p>Jonas</p>
      </div>
      <div className={classes.chatCon}>
        <div className={classes.messagesCon}>
          <div className={classes.oneMessageHim}>
            <img src={img1} alt="" className={classes.img} />
            <div className={classes.hisMessage}>
              <span className={classes.text}>
                how i r llkkjk i doi didnt go there bcuz i was tired and i saw
                spanlaying football with ur
                friendswwwwwwwwwfvvvvvvvvvvvvvvffffffwwwwwnvvvvvvvvvvvvvvvbnbnbnbvbvwwwwwrrrdd
              </span>
              <span className={classes.time}>11.30 PM</span>
            </div>
          </div>
          <div className={classes.oneMessageMe}>
            <img src={img1} alt="" className={classes.img} />
            <div className={classes.myMessage}>
              <span className={classes.text}>
                how i r llkkjk i doi didnt go there bcuz i was tired and i saw
                spanlaying football with ur
                friendswwwwwwwwwfvvvvvvvvvvvvvvffffffwwwwwnvvvvvvvvvvvvvvvbnbnbnbvbvwwwwwrrrdd
              </span>
              <span className={classes.time}>11.30 PM</span>
            </div>
          </div>
          <div className={classes.oneMessageHim}>
            <img src={img1} alt="" className={classes.img} />
            <div className={classes.hisMessage}>
              <span className={classes.text}>
                how i r llkkjk i doi didnt go there bcuz i was tired and i saw
                spanlaying football with ur
                friendswwwwwwwwwfvvvvvvvvvvvvvvffffffwwwwwnvvvvvvvvvvvvvvvbnbnbnbvbvwwwwwrrrdd
              </span>
              <span className={classes.time}>11.30 PM</span>
            </div>
          </div>
          <div className={classes.oneMessageHim}>
            <img src={img1} alt="" className={classes.img} />
            <div className={classes.hisMessage}>
              <span className={classes.text}>
                how i r llkkjk i doi didnt go there bcuz i was tired and i saw
                spanlaying football with ur
                friendswwwwwwwwwfvvvvvvvvvvvvvvffffffwwwwwnvvvvvvvvvvvvvvvbnbnbnbvbvwwwwwrrrdd
              </span>
              <span className={classes.time}>11.30 PM</span>
            </div>
          </div>
          <div className={classes.oneMessageHim}>
            <img src={img1} alt="" className={classes.img} />
            <div className={classes.hisMessage}>
              <span className={classes.text}>
                how i r llkkjk i doi didnt go there bcuz i was tired and i saw
                spanlaying football with ur
                friendswwwwwwwwwfvvvvvvvvvvvvvvffffffwwwwwnvvvvvvvvvvvvvvvbnbnbnbvbvwwwwwrrrdd
              </span>
              <span className={classes.time}>11.30 PM</span>
            </div>
          </div>
          <div className={classes.oneMessageHim}>
            <img src={img1} alt="" className={classes.img} />
            <div className={classes.hisMessage}>
              <span className={classes.text}>
                how i r llkkjk i doi didnt go there bcuz i was tired and i saw
                spanlaying football with ur
                friendswwwwwwwwwfvvvvvvvvvvvvvvffffffwwwwwnvvvvvvvvvvvvvvvbnbnbnbvbvwwwwwrrrdd
              </span>
              <span className={classes.time}>11.30 PM</span>
            </div>
          </div>
          <div className={classes.oneMessageHim}>
            <img src={img1} alt="" className={classes.img} />
            <div className={classes.hisMessage}>
              <span className={classes.text}>
                how i r llkkjk i doi didnt go there bcuz i was tired and i saw
                spanlaying football with ur
                friendswwwwwwwwwfvvvvvvvvvvvvvvffffffwwwwwnvvvvvvvvvvvvvvvbnbnbnbvbvwwwwwrrrdd
              </span>
              <span className={classes.time}>11.30 PM</span>
            </div>
          </div>
        </div>
        <form className={classes.form}>
          <textarea className={classes.inputChat}></textarea>
          <button className={classes.buttonChat}>send</button>
        </form>
      </div>
    </div>
  );
};
export default ChatRoom;
