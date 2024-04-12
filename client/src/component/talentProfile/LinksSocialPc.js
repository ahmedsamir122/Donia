import classes from "./LinksSocialPc.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import React from "react";
import OneLinksSocialPc from "./OneLinksSocialPc";
const LinksSocialPc = (props) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <React.Fragment>
      {(props.onData.links.length === 0 || !props.onData.links) && (
        <div className={classes.link}>
          {props.showEdit
            ? "Please add your social media links"
            : "No links added "}
        </div>
      )}
      {props.onData.links.length > 0 && (
        <ul>
          {props.onData?.links?.map((l, i) => (
            <OneLinksSocialPc
              key={i}
              id={i}
              title={l}
              showEdit={props.showEdit}
            />
          ))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default LinksSocialPc;
