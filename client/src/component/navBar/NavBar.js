import classes from "./NavBar.module.css";
import { useEffect, useState } from "react";
import { CiChat1 } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { MdOutlineLibraryBooks } from "react-icons/md";
import SearchIcon from "@mui/icons-material/Search";
import AccountModal from "../modal/AccountModal";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import FilterModal from "../modal/FilterModal";
import NotificationModal from "../modal/NotificationModal";
import MessageModal from "../modal/MessageModal";
import TuneIcon from "@mui/icons-material/Tune";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { queryActions } from "../../store/query";
import { useNavigate, useLocation } from "react-router-dom";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useQuery } from "react-query";
import { getWishList, URL, updateFileData } from "../utils/queryFunctions";
import { useMutation } from "react-query";
import { useTranslation } from "react-i18next";
import { authActions } from "../../store/login-slice";
import { pusherActions } from "../../store/pusher";
import { blocklistActions } from "../../store/blocklist";
import { wishlistActions } from "../../store/wishlist";
import Pusher from "pusher-js";
import Backdrop from "./Backdrop";
import Footer from "../footer/Footer";

const NavBar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMessage, setShowMessage] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteNum, setNoteNum] = useState(0);
  const [showAccount, setShowAccount] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showNavbar, setShowNavbar] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [hasNextPageNotifications, sethasNextPageNotifications] =
    useState(true);
  const [pageNotification, setPageNotification] = useState(1);
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
  const fetchUnseenMessagesNumber = () => {
    return getWishList(`${URL}/api/v1/messages/unseenMessages`, tokenLocal);
  };

  const { isLoading: loadingunseenMessagesNumber, data: unSeenData } = useQuery(
    "unSeenMessagesNumber",
    fetchUnseenMessagesNumber,
    {
      enabled: !!user, // Only execute the query if userId is truthy
      refetchOnWindowFocus: false,
    }
  );

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
    const currentURL = location.pathname;
    console.log("Current URL:", currentURL);

    if (currentURL.includes("search")) {
      setShowNavbar(true);
    } else setShowNavbar(false);
    // Perform any other actions based on the URL change
  }, [location]);

  useEffect(() => {
    if (!tokenLocal || !user) {
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

    user,
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
    return getWishList(
      `${URL}/api/v1/notification?page=${pageNotification}&limit=2`,
      tokenLocal
    );
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

  const {
    isLoading,
    error,
    data,
    refetch: refetchNotifications,
    isFetching,
  } = useQuery("notifications", fetchNotifications, {
    refetchOnWindowFocus: false,
    enabled: !!user,
    onSuccess: (data) => {
      console.log(data);
      setNotificationData((prev) => [
        ...prev,
        ...data?.data?.data?.notifications,
      ]);
    },
  });

  const pageNotifictionHandler = () => {
    setPageNotification((prev) => {
      const totalPageNotification = Math.ceil(data?.data?.totalResults / 2);
      if (pageNotification === totalPageNotification) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  };

  useEffect(() => {
    const totalPageNotification = Math.ceil(data?.data?.totalResults / 2);

    if (pageNotification === totalPageNotification) {
      sethasNextPageNotifications(false);
      return;
    }
    refetchNotifications();
  }, [pageNotification, refetchNotifications, data?.data?.totalResults]);

  const toggleMessageHandler = (e) => {
    e.stopPropagation();
    setShowMessage((prev) => {
      return !prev;
    });
    setShowAccount(false);
    setShowNotes(false);
  };
  const toggleNotesHandler = (e) => {
    e.stopPropagation();
    setShowNotes((prev) => {
      return !prev;
    });
    setShowAccount(false);
    setShowMessage(false);
    mutate();
  };
  const toggleAccountHandler = (e) => {
    e.stopPropagation();
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

  useEffect(() => {
    if (!token) {
      return;
    }
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      authEndpoint: `${URL}/api/v1/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    dispatch(pusherActions.getPusher(pusher));
  }, [tokenLocal, dispatch, token]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (location.pathname.includes("search")) {
      navigate(`/search`);
    }
    if (!location.pathname.includes("search")) {
      navigate(`/`);
    }

    setTimeout(() => {
      setSearchParams({ q: searchInput });
      dispatch(queryActions.addQuery(searchInput));
      if (location.pathname.includes("search")) {
        navigate(`?q=${searchInput}`);
        return;
      }
      navigate(`/?q=${searchInput}`);
    }, 500);
  };

  const changeLanguageHandler = (e) => {
    if (e.target.value === "En") {
      i18n.changeLanguage("en");
    }
    if (e.target.value === "Bah") {
      i18n.changeLanguage("bah");
    }
  };

  const hideLinks = () => {
    console.log("header");
    setShowMessage(false);
    setShowAccount(false);
    setShowNotes(false);
  };

  return (
    <>
      <header className={classes.header} onClick={hideLinks}>
        <div className="container">
          <div className={classes.main}>
            <div className={classes.logoInput}>
              <Link
                className={classes.logo}
                onClick={() => {
                  dispatch(queryActions.addQuery(""));
                }}
                to="/"
              >
                {t("test")}
              </Link>
              {(user || showNavbar) && (
                <form className={classes.form} onSubmit={submitHandler}>
                  <input
                    className={classes.input}
                    type="search"
                    defaultValue={""}
                    onChange={inputHandler}
                    placeholder="search..."
                  />
                  <button className={classes.button}>
                    <SearchIcon className={classes.iconSearch} />
                  </button>
                  <div
                    className={classes.filterButton}
                    onClick={toggleFilterHandler}
                  >
                    <TuneIcon />
                  </div>
                </form>
              )}
            </div>

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
                  <div className={classes.navText}>Notifications</div>

                  {noteNum > 0 && noteNum < 100 && <span>{noteNum}</span>}
                  {noteNum > 99 && <span>+99</span>}
                </li>
                {showNotes && (
                  <NotificationModal
                    onNotification={toggleNotesHandler}
                    dataNotes={notificationData}
                    loading={isFetching}
                    onPageHandler={pageNotifictionHandler}
                    hasNextPage={hasNextPageNotifications}
                  />
                )}
                <li
                  className={classes.notContainer}
                  onClick={toggleMessageHandler}
                >
                  <CiChat1 className={classes.mes} />
                  <div className={classes.navText}>Messages</div>
                  {unSeenData?.data.count > 0 &&
                    unSeenData?.data.count < 100 && (
                      <span>{unSeenData?.data.count}</span>
                    )}
                  {unSeenData?.data.count > 99 && <span>+99</span>}
                  {/* <span>1</span> */}
                </li>
                <li
                  className={classes.notContainer}
                  onClick={() => navigate("/contracts")}
                >
                  <MdOutlineLibraryBooks className={classes.mes} />
                  <div className={classes.navText}>Contracts</div>
                </li>
                {showMessage && (
                  <MessageModal onMessage={toggleMessageHandler} />
                )}
                <li
                  className={classes.notContainer}
                  onClick={toggleAccountHandler}
                >
                  <img src={user.photo} alt="" className={classes.img} />
                  <div className={classes.navText}>Me</div>
                </li>
                {showAccount && (
                  <AccountModal onAccount={toggleAccountHandler} />
                )}
              </ul>
            )}
            {!user && (
              <div className={classes.unsigned}>
                <Link to="/signin" className={classes.login}>
                  Log In
                </Link>

                <Link to="/signup" className={classes.login}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
        {showFilter && <FilterModal onFilter={toggleFilterHandler} />}
      </header>
      {(showNotes || showMessage || showAccount) && (
        <Backdrop onHideHandler={hideLinks} />
      )}
      <Outlet />
      {(location.pathname === "/" && !user) ||
      location.pathname.includes("messages") ? null : (
        <Footer />
      )}
    </>
  );
};

export default NavBar;
