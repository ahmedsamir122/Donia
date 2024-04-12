import { useState } from "react";
import classes from "./AddBio.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { updateFileData, URL } from "../utils/queryFunctions";

const AddBio = (props) => {
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
    const [bio] = getValues(["bio"]);
    console.log(bio);
    mutate({ bio });
  };

  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}>Edit about</h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      <form className={classes.formBio} onSubmit={handleSubmit(onsubmit)}>
        <textarea
          id="bio"
          className={classes.inputText}
          defaultValue={user.bio ? user.bio : ""}
          placeholder={user.bio ? user.bio : "Describe what you need here.."}
          {...register("bio")}
        ></textarea>
        <div className={classes.buttonCon}>
          <button className={classes.buttonBio}>Save</button>
        </div>
      </form>
    </div>
  );
};

export default AddBio;
