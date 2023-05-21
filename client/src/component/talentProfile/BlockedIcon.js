import MoreVertIcon from "@mui/icons-material/MoreVert";
import classes from "./BlockedIcon.module.css";
import BlockIcon from "@mui/icons-material/Block";
import FlagIcon from "@mui/icons-material/Flag";
import { useEffect, useState } from "react";
import React from "react";
import ReportModal from "../modal/ReportModal";
import BackDropModal from "../modal/BackDrop";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { postDataProtect, URL } from "../utils/queryFunctions";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { blocklistActions } from "../../store/blocklist";
import UnBlockButton from "../setting/UnBlockButton";

const BlockedIcon = (props) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const params = useParams();
  const [showList, setShowList] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const blocklist = useSelector((state) => state.blocklist.blocklist);
  const [block, setBlock] = useState(
    blocklist.some((item) => props.id === item.user)
  );
  const token = useSelector((state) => state.auth.token);

  const addBlock = (data) => {
    return postDataProtect(
      `${URL}/api/v1/block/${params.usernameClient}`,
      data,
      token
    );
  };

  const { mutate, isError, error } = useMutation(addBlock, {
    onSuccess: (data) => {
      queryClient.setQueryData("blockList", (oldData) => {
        return {
          ...data,
        };
      });
      dispatch(blocklistActions.toggle({ user: props.id, photo: props.photo }));
      setBlock(true);
      setShowList(false);
    },
  });

  const iconHandler = () => {
    setShowList((prev) => !prev);
  };

  const blockHandler = () => {
    console.log("block");
    mutate();
  };

  const reportHandler = () => {
    setShowList(false);
    setShowReport(true);
  };
  const closeReportHandler = () => {
    setShowReport(false);
  };

  useEffect(() => {
    if (blocklist.some((item) => props.id === item.user)) {
      setBlock(true);
    } else {
      setBlock(false);
    }
  }, [blocklist]);
  return (
    <React.Fragment>
      <div className={classes.main}>
        {!block && (
          <MoreVertIcon className={classes.icon} onClick={iconHandler} />
        )}
        {block && (
          <UnBlockButton
            id={props.id}
            username={props.username}
            photo={props.photo}
          />
        )}
        {showList && (
          <div className={classes.list}>
            <div className={classes.listOne} onClick={blockHandler}>
              <BlockIcon fontSize="small" />
              <p className={classes.listName}>Block th client</p>
            </div>
            <div className={classes.listOne} onClick={reportHandler}>
              <FlagIcon fontSize="small" />
              <p className={classes.listName}>Report the client</p>
            </div>
          </div>
        )}
      </div>
      {showReport && <ReportModal onClick={closeReportHandler} />}
      {showReport && <BackDropModal onClick={closeReportHandler} />}
    </React.Fragment>
  );
};

export default BlockedIcon;
