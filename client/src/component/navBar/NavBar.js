import classes from "./NavBar.module.css";
import { useEffect, useState } from "react";
import { CiChat1 } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import img1 from "../../img/user2.jpg";
import AccountModal from "../modal/AccountModal";
import { Link, useSearchParams } from "react-router-dom";
import FilterModal from "../modal/FilterModal";
import NotificationModal from "../modal/NotificationModal";
import MessageModal from "../modal/MessageModal";
import TuneIcon from "@mui/icons-material/Tune";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { queryActions } from "../../store/query";
import { useNavigate } from "react-router-dom";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const NavBar = (props) => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();
  let [searchParams, setSearchParams] = useSearchParams();

  const user = useSelector((state) => state.auth.user);

  const toggleMessageHandler = () => {
    setShowMessage((prev) => {
      return !prev;
    });
    setShowAccount(false);
    setShowNotes(false);
  };
  const toggleNotesHandler = () => {
    setShowNotes((prev) => {
      return !prev;
    });
    setShowAccount(false);
    setShowMessage(false);
  };
  const toggleAccountHandler = () => {
    setShowAccount((prev) => {
      return !prev;
    });
    setShowNotes(false);
    setShowMessage(false);
  };
  const toggleFilterHandler = () => {
    setShowFilter((prev) => {
      return !prev;
    });
  };

  const inputHandler = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    dispatch(queryActions.addQuery(""));
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchInput });
    dispatch(queryActions.addQuery(searchInput));
  };

  return (
    <header>
      <div className="container">
        <div className={classes.main}>
          <Link className={classes.logo} to="/">
            Donia
          </Link>
          <form className={classes.form} onSubmit={submitHandler}>
            <input type="search" defaultValue={""} onChange={inputHandler} />
            <button className={classes.button}>
              <CiSearch className={classes.iconSearch} />
            </button>
            <div className={classes.filterButton} onClick={toggleFilterHandler}>
              <TuneIcon />
            </div>
          </form>
          {user && (
            <ul className={classes.ul}>
              <li className={classes.notContainer} onClick={toggleNotesHandler}>
                <CiBellOn className={classes.not} />
                {/* <span>1</span> */}
              </li>
              {showNotes && (
                <NotificationModal onNotification={toggleNotesHandler} />
              )}
              <li
                className={classes.notContainer}
                onClick={toggleMessageHandler}
              >
                <CiChat1 className={classes.mes} />
                {/* <span>1</span> */}
              </li>
              <li
                className={classes.notContainer}
                onClick={() => navigate("/contracts")}
              >
                <LibraryBooksIcon className={classes.mes} />
              </li>
              {showMessage && <MessageModal onMessage={toggleMessageHandler} />}
              <li className={classes.user} onClick={toggleAccountHandler}>
                <img src={user.photo} alt="" className={classes.img} />
              </li>
              {showAccount && <AccountModal onAccount={toggleAccountHandler} />}
            </ul>
          )}
          {!user && (
            <Link to="/signin" className={classes.login}>
              login
            </Link>
          )}
        </div>
      </div>
      {showFilter && <FilterModal onFilter={toggleFilterHandler} />}
    </header>
  );
};

export default NavBar;
