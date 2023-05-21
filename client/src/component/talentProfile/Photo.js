import classes from "./Photo.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { updatePhotoData, URL } from "../utils/queryFunctions";
import axios from "axios";

const Photo = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [image, setImage] = useState(user.photo);
  const [imageSend, setImageSend] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  const postData = (data) => {
    return updatePhotoData(`${URL}/api/v1/users/updateMe`, data, token);
  };

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

  const previewPhotoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setImageSend(e.target.files[0]);
    console.log(e.target.files);
  };

  const sendPhoto = () => {
    mutate({ photo: imageSend });
  };
  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}></h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      <div className={classes.avatarCon}>
        {/* <ReactCrop crop={crop} onChange={(c) => setCrop(c)}> */}
        <img src={image} accept="image/*" alt="" className={classes.img} />
        {/* </ReactCrop> */}
      </div>
      <div className={classes.buttonCon}>
        <label className={classes.buttonChange}>
          Change image
          <input
            type="file"
            className={classes.input}
            onChange={previewPhotoHandler}
          />
        </label>

        <button className={classes.buttonSave} onClick={sendPhoto}>
          Save photo
        </button>
      </div>
    </div>
  );
};

export default Photo;
