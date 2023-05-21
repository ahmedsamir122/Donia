import classes from "./OneLinksMobil.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "react-query";
import { updateFileData, URL } from "../utils/queryFunctions";
import { useSelector } from "react-redux";

import {
  AiOutlineYoutube,
  AiOutlineInstagram,
  AiOutlineFacebook,
  AiOutlineGithub,
} from "react-icons/ai";
import { BsTiktok } from "react-icons/bs";

const OneLinksMobil = (props) => {
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const links = {
    youtube: <AiOutlineYoutube className={classes.socialIcon} />,
    instagram: <AiOutlineInstagram className={classes.socialIcon} />,
    facebook: <AiOutlineFacebook className={classes.socialIcon} />,
    github: <AiOutlineGithub className={classes.socialIcon} />,
    tiktok: <BsTiktok className={classes.socialIcon} />,
  };

  const postData = (data) => {
    return updateFileData(`${URL}/api/v1/users/updateMe`, data, token);
  };

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
    e.preventDefault();
    console.log(props.id);
    const linksNames = [...user.links];
    linksNames.splice(props.id, 1);
    mutate({ links: linksNames });
  };

  const linksKeys = Object.keys(links);
  const key = linksKeys.find((el) => props.title.includes(el));
  return (
    <a href={props.title} className={classes.oneLink}>
      {links[key]}
      {props.showEdit && (
        <div className={classes.closeIcon} onClick={deleteHandler}>
          <CloseIcon sx={{ fontSize: 10, color: "black" }} />
        </div>
      )}
    </a>
  );
};

export default OneLinksMobil;
