import classes from "./NavBar.module.css";
import { useEffect, useState } from "react";
import { CiChat1 } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import AccountModal from "../modal/AccountModal";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import FilterModal from "../modal/FilterModal";
import NotificationModal from "../modal/NotificationModal";
import MessageModal from "../modal/MessageModal";
import TuneIcon from "@mui/icons-material/Tune";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { queryActions } from "../../store/query";
import { useNavigate } from "react-router-dom";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useQuery } from "react-query";
import { getWishList, URL, updateFileData } from "../utils/queryFunctions";
import { useMutation } from "react-query";
import { useTranslation } from "react-i18next";
import { authActions } from "../../store/login-slice";
import { blocklistActions } from "../../store/blocklist";
import { wishlistActions } from "../../store/wishlist";
import NavBarHome from "./NavBarHome";
const NavBar = (props) => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteNum, setNoteNum] = useState(0);
  const [showAccount, setShowAccount] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();
  let [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const tokenLocal = localStorage.getItem("token") || "";
  const tokenExpiration = localStorage.getItem("expiration");

  const getMyProfile = () => {
    return getWishList(`${URL}/api/v1/users/me`, tokenLocal);
  };

  const fetchWishList = () => {
    return getWishList(`${URL}/api/v1/wishList`, tokenLocal);
  };

  const fetchBlockList = () => {
    return getWishList(`${URL}/api/v1/block`, tokenLocal);
  };

  const {
    isLoading: loadingProfile,
    error: errorProfile,
    isError: isErrorProfile,
    data: dataProfile,
    refetch: refetchProfil,
  } = useQuery("myProfil", getMyProfile, {
    enabled: false, // Only execute the query if userId is truthy

    // enabled: !!token, // Only execute the query if userId is truthy
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: loadingWishList,
    error: errorWishList,
    isError: isErrorWishList,
    data: dataWishList,
    refetch: refetchWishList,
  } = useQuery("wishList", fetchWishList, {
    enabled: false, // Only execute the query if userId is truthy
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: loadingBlockList,
    error: errorBlockList,
    isError: isErrorBlockList,
    data: dataBlockList,
    refetch: refetchBlockList,
  } = useQuery("blockList", fetchBlockList, {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    if (!tokenLocal) {
      return;
    }

    const dateExpiration = new Date(tokenExpiration);
    const now = new Date();
    const duration = dateExpiration.getTime() - now.getTime();

    setTimeout(() => {
      localStorage.removeItem("token");
      dispatch(authActions.login(""));
      navigate("/");
    }, duration);

    refetchProfil();
    refetchWishList();
    refetchBlockList();
  }, [
    token,
    tokenLocal,
    isErrorProfile,
    refetchBlockList,
    refetchWishList,
    refetchProfil,
    dispatch,
    navigate,
    tokenExpiration,
  ]);
  useEffect(() => {
    if (!tokenLocal || !dataProfile?.data.data?.user) {
      return;
    }
    const wishlistRed = dataWishList?.data.data.allWishList.map((item) => ({
      user: item.other.id,
      photo: item.other.photo,
      username: item.other.username,
    }));

    const blocklistRed = dataBlockList?.data.data.allBlockUsers.map((item) => ({
      user: item.other.id,
      photo: item.other.photo,
      username: item.other.username,
    }));

    dispatch(authActions.getToken(tokenLocal));
    dispatch(authActions.login(dataProfile?.data.data.user));
    dispatch(wishlistActions.replaceWishList(wishlistRed || []));
    dispatch(blocklistActions.replaceBlockList(blocklistRed || []));
  }, [
    dataProfile?.data.data?.user,
    token,
    dispatch,
    tokenLocal,
    dataWishList?.data.data.allWishList,
    dataBlockList?.data.data.allBlockList,
    dataBlockList?.data.data.allBlockUsers,
  ]);

  const fetchNotifications = () => {
    return getWishList(`${URL}/api/v1/notification`, token);
  };

  const updateNotificationSee = () => {
    return updateFileData(`${URL}/api/v1/notification`, null, token);
  };

  const onSuccess = (data) => {
    console.log(data.data.unseenResults);
    setNoteNum(data.data.unseenResults);
  };

  const {
    mutate,
    isError,
    error: errorUpdateNotes,
  } = useMutation(updateNotificationSee, {
    onSuccess: (data) => {
      console.log("success");
      setNoteNum(0);
    },
  });

  const { isLoading, error, data } = useQuery(
    "notifications",
    fetchNotifications,
    {
      refetchOnWindowFocus: false,
      enabled: !!user,
      onSuccess,
    }
  );

  console.log(data);

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
    mutate();
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

  const changeLanguageHandler = (e) => {
    if (e.target.value === "En") {
      i18n.changeLanguage("en");
    }
    if (e.target.value === "Bah") {
      i18n.changeLanguage("bah");
    }
  };

  return (
    <>
      {user && (
        <header>
          <div className="container">
            <div className={classes.main}>
              <Link className={classes.logo} to="/">
                {t("test")}
              </Link>
              <form className={classes.form} onSubmit={submitHandler}>
                <input
                  type="search"
                  defaultValue={""}
                  onChange={inputHandler}
                />
                <button className={classes.button}>
                  <CiSearch className={classes.iconSearch} />
                </button>
                <div
                  className={classes.filterButton}
                  onClick={toggleFilterHandler}
                >
                  <TuneIcon />
                </div>
              </form>
              {user && (
                <ul className={classes.ul}>
                  <li className={classes.lang}>
                    <select onChange={changeLanguageHandler}>
                      <option value="En">EN</option>
                      <option value="Bah">BAH</option>
                    </select>
                  </li>
                  <li
                    className={classes.notContainer}
                    onClick={toggleNotesHandler}
                  >
                    <CiBellOn className={classes.not} />
                    {noteNum > 0 && <span>{noteNum}</span>}
                  </li>
                  {showNotes && (
                    <NotificationModal
                      onNotification={toggleNotesHandler}
                      dataNotes={data.data}
                    />
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
                  {showMessage && (
                    <MessageModal onMessage={toggleMessageHandler} />
                  )}
                  <li className={classes.user} onClick={toggleAccountHandler}>
                    <img src={user.photo} alt="" className={classes.img} />
                  </li>
                  {showAccount && (
                    <AccountModal onAccount={toggleAccountHandler} />
                  )}
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
      )}
      {!user && <NavBarHome />}
      <Outlet />
    </>
  );
};

export default NavBar;
