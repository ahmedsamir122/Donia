import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import classes from "./SettingContent.module.css";
import { useState } from "react";
const SettingContent = () => {
  const [showSubmenu, setShowSubmenu] = useState(false);

  const submenuHandler = () => {
    setShowSubmenu((prev) => {
      return !prev;
    });
  };
  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.settingCon}>
          <div className={classes.left}>
            <div className={classes.nameCon}>
              <ul className={classes.nameUl}>
                <li>
                  <Link
                    to="/settings/generalInfo/"
                    className={`${classes.name}`}
                  >
                    General
                  </Link>
                </li>
                <li>
                  <Link to="/settings/phoneNumber/" className={classes.name}>
                    Phone number
                  </Link>
                </li>
                <li className={classes.main460}>
                  <Link to="/settings/password/" className={`${classes.name} `}>
                    Password
                  </Link>
                </li>
                <li className={classes.main460}>
                  <Link
                    to="/settings/blockedList/"
                    className={`${classes.name} `}
                  >
                    Blocked list
                  </Link>
                </li>
                <li className={classes.hide767}>
                  <Link
                    to="/settings/typeAccount/"
                    className={`${classes.name} `}
                  >
                    Account type
                  </Link>
                </li>
                <li className={classes.hide767}>
                  <Link
                    to="/settings/deleteAccount/"
                    className={`${classes.name} `}
                  >
                    Delete the account
                  </Link>
                </li>
                <li className={classes.moreCon}>
                  <p className={classes.more} onClick={submenuHandler}>
                    More
                  </p>

                  {showSubmenu && (
                    <div className={classes.subMenu}>
                      <ul>
                        <li className={classes.hide460}>
                          <Link
                            to="/settings/password/"
                            className={`${classes.name} `}
                          >
                            Password
                          </Link>
                        </li>
                        <li className={classes.hide460}>
                          <Link
                            to="/settings/blockedList/"
                            className={`${classes.name} `}
                          >
                            Blocked list
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/settings/typeAccount/"
                            className={classes.name}
                          >
                            Account type
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/settings/deleteAccount/"
                            className={classes.name}
                          >
                            Delete the account
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
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
export default SettingContent;
