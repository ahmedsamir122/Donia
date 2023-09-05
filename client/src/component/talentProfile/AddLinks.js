import { useState } from "react";
import classes from "./AddLinks.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { updateFileData, URL } from "../utils/queryFunctions";

const AddLinks = (props) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();
  console.log(token);
  const postData = (data) => {
    return updateFileData(`${URL}/api/v1/users/updateMe`, data, token);
  };

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      queryClient.setQueryData("myProfil", (oldData) => {
        return {
          ...data,
        };
      });
      props.onClick();
    },
  });

  const onsubmit = (data) => {
    console.log(data);
    const [link] = getValues(["link"]);
    console.log(link);
    mutate({ links: [...user.links, link] });
  };

  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}>Add Link</h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      <div className={classes.formCon}>
        <form className={classes.formFilter} onSubmit={handleSubmit(onsubmit)}>
          <input
            className={classes.selectFilter}
            {...register("link", { required: true })}
          />
          <button className={classes.buttonFilter}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddLinks;
