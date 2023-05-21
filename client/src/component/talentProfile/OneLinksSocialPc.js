import classes from "./OneLinkSocialPc.module.css";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "react-query";
import { updateFileData, URL } from "../utils/queryFunctions";
import { useSelector } from "react-redux";

const OneLinksSocialPc = (props) => {
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const postData = (data) => {
    return updateFileData(`${URL}/api/v1/users/updateMe`, data, token);
  };
  const social = [
    "instagram",
    "youtube",
    "facebook",
    "twitter",
    "path",
    "github",
  ];
  const index = social.findIndex((el) => props.title.includes(el));

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      queryClient.setQueryData("myProfil", (oldData) => {
        return {
          ...data,
        };
      });
    },
  });

  const deleteHandler = (e) => {
    e.stopPropagation();
    console.log(props.id);
    const linksNames = [...user.links];
    linksNames.splice(props.id, 1);
    mutate({ links: linksNames });
  };
  const link = social[index];
  console.log(link, social[1], props.title);
  return (
    <li className={classes.link}>
      <a href={props.title} className={classes.oneLink}>
        {link}
      </a>
      {props.showEdit && (
        <div className={classes.closeIcon} onClick={deleteHandler}>
          <CloseIcon sx={{ fontSize: 15 }} />
        </div>
      )}
    </li>
  );
};

export default OneLinksSocialPc;
