import classes from "./NavBar.module.css";
import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiMessage } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import user from "../../img/user.jpg";
import Messages from "./messages/Messages";
import Notifications from "./notification/Notifications";
import Account from "./account/Account";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const toggleMessageHandler = () => {
    setShowMessage((prev) => {
      return !prev;
    });
  };
  const toggleNotesHandler = () => {
    setShowNotes((prev) => {
      return !prev;
    });
  };
  const toggleAccountHandler = () => {
    setShowAccount((prev) => {
      return !prev;
    });
  };

  return (
    <header>
      <div className="container">
        <div className={classes.main}>
          <Link to="/">Donia</Link>
          <form className={classes.form}>
            <input type="search" />
            <button className={classes.button}>
              <CiSearch className={classes.iconSearch} />
            </button>
          </form>
          <ul>
            <li className={classes.notContainer} onClick={toggleNotesHandler}>
              <IoMdNotificationsOutline className={classes.not} />
              <span>1</span>
            </li>
            {showNotes && <Notifications />}
            <li className={classes.notContainer} onClick={toggleMessageHandler}>
              <BiMessage className={classes.mes} />
              <span>1</span>
            </li>
            {showMessage && <Messages />}
            <li className={classes.user} onClick={toggleAccountHandler}>
              <img src={user} alt="" className={classes.img} />
              <div>eng.ahmed@gmail.com</div>
            </li>
            {showAccount && <Account />}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
