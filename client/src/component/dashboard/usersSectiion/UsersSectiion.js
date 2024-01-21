import * as React from "react";
import classes from "./UsersSectiion.module.css";
import { Outlet } from "react-router-dom";

const UsersSectiion = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
export default UsersSectiion;
