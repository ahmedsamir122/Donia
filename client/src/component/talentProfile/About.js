import classes from "./FilterList.module.css";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import FilterClientModal from "../modal/FilterClient";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BackDropModal from "../modal/BackDrop";
import FilterListOne from "./FilterListOne";
import { useSelector } from "react-redux";
import AboutModal from "../modal/AboutModal";
import { useMutation, useQueryClient } from "react-query";
import { updateFileData, URL } from "../utils/queryFunctions";

const About = (props) => {
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const showModalHandler = () => {
    setShowModal((prev) => {
      return !prev;
    });
  };

  return (
    <>
      {(props.onData.bio || props.showEdit) && (
        <div className={classes.main}>
          <div className={classes.top}>
            <h2 className={classes.reviewsTitle}>About</h2>
            {props.showEdit && (
              <div className={classes.editIcon}>
                <AddOutlinedIcon
                  className={classes.icon}
                  onClick={showModalHandler}
                />
              </div>
            )}
          </div>
          <div>{props.onData?.bio}</div>

          {showModal && <AboutModal onClick={showModalHandler} />}
          {showModal && <BackDropModal onClick={showModalHandler} />}
        </div>
      )}
    </>
  );
};

export default About;
