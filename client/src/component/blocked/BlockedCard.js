import classes from "./BlockedCard.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import dateFormat from "dateformat";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/login-slice";

const BlockedCard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  let data;
  if (user?.status === "blocked") {
    data = `Your account has been blocked for more information you can contact us`;
  }
  if (
    user?.status === "3d" ||
    user?.status === "1w" ||
    user?.status === "2w" ||
    user?.status === "1m"
  ) {
    data = `Your account has been blocked untill ${dateFormat(
      user?.blockUntilldateFormat,
      " mmmm dS, yyyy"
    )} for more information you can contact us`;
  }

  return (
    <main className={classes.main}>
      <header className={classes.navBar}>
        <div className="container">
          <div
            className={classes.logo}
            onClick={() => {
              dispatch(authActions.login(null));
              navigate("/");
            }}
          >
            {t("test")}
          </div>
        </div>
      </header>
      <div className={classes.mainBody}>
        <div className="container">
          <div className={classes.body}>
            <div className={classes.box}>
              <div>{data}</div>
              <div
                className={classes.button}
                onClick={() => {
                  dispatch(authActions.login(null));
                  navigate("/");
                }}
              >
                Back to main page
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlockedCard;
