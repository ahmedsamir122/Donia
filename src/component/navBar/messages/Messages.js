import classes from "./Messages.module.css";
import user from "../../../img/user.jpg";
import { CiSearch } from "react-icons/ci";

const Messages = () => {
  return (
    <div className={classes.main}>
      <form className={classes.form}>
        <input
          type="search"
          className={classes.input}
          placeholder="search messenger..."
        />
        <button className={classes.button}>
          <CiSearch />
        </button>
      </form>

      <div className={classes.messCon}>
        <img src={user} alt="" className={classes.img} />
        <div className={classes.messContent}>
          <div className={classes.messTop}>
            <div>email</div>
            <div>date</div>
          </div>
          <div>You: how r u?</div>
        </div>
      </div>
      <div className={classes.messCon}>
        <img src={user} alt="" className={classes.img} />
        <div className={classes.messContent}>
          <div className={classes.messTop}>
            <div>email</div>
            <div>date</div>
          </div>
          <div>You: how r u?</div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
