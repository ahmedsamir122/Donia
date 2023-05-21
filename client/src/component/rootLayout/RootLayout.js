import { Outlet } from "react-router-dom";
import React from "react";
import classes from "./RootLayout.module.css";
import SideBar from "./sideBar/SideBar";
import NavBar from "./navbar/NavBar";
const RootLayout = () => {
  return (
    <React.Fragment>
      <div className={classes.main}>
        <div className={classes.sidebar}>
          <SideBar />
        </div>
        <div className={classes.rightside}>
          <div>
            <NavBar />
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RootLayout;
