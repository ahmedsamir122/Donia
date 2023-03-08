import classes from "./Account.module.css";
import user from "../../../img/user.jpg";
import { CiSearch } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { SiSimpleanalytics } from "react-icons/si";
import { MdOutlineLogout } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";

const Account = () => {
  return (
    <div className={classes.main}>
      <div className={classes.messCon}>
        <img src={user} alt="" className={classes.img} />
        <div className={classes.messContent}>
          <div>Ahmed@gmail.com</div>
          <div>View Profile</div>
        </div>
      </div>
      <div className={classes.item}>
        <CiSettings className={classes.icon} />
        <div>Setting</div>
      </div>
      <div className={classes.item}>
        <SiSimpleanalytics className={classes.icon} />
        <div>My Jobs</div>
      </div>
      <div className={classes.item}>
        <GrMoney className={classes.icon} />
        <div>Balance</div>
      </div>
      <div className={classes.item}>
        <AiOutlineHeart className={classes.icon} />
        <div>My Wishlist</div>
      </div>
      <div className={classes.item}>
        <MdOutlineLogout className={classes.icon} />
        <div>Logout</div>
      </div>
    </div>
  );
};

export default Account;
