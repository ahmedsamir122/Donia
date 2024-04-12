import classes from "./ButtonContract.module.css";
import React from "react";
import { useMutation } from "react-query";
import { updateFileData, URL } from "../utils/queryFunctions";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ButtonContract = (props) => {
  const token = useSelector((state) => state.auth.token);
  const params = useParams();

  const postData = (data) => {
    return updateFileData(
      `${URL}/api/v1/contracts/${params.contractId}`,
      data,
      token
    );
  };

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      props.onActivity(data.data.data.contract.activity);
    },
  });

  console.log(props.activity);

  return (
    <React.Fragment>
      {props.activity === "offer" && !props.client && (
        <button
          // disabled={!expired}
          type="button"
          className={classes.buttonContract}
          onClick={() => mutate({ activity: "progress" })}
        >
          accept the offer
        </button>
      )}
      {props.activity === "offer" && !props.client && (
        <button
          // disabled={!expired}
          type="button"
          className={classes.buttonContractCancel}
          onClick={() => mutate({ activity: "cancel" })}
        >
          cancel the offer
        </button>
      )}
      {props.activity === "progress" && !props.client && (
        <button
          // disabled={!expired}
          type="button"
          className={classes.buttonContract}
          onClick={() => mutate({ activity: "submit" })}
        >
          submit your work
        </button>
      )}
      {props.activity === "submit" && props.client && (
        <button
          // disabled={!expired}
          type="button"
          className={classes.buttonContract}
          onClick={() => mutate({ activity: "approved" })}
        >
          approve the work
        </button>
      )}
      {props.activity === "submit" && props.client && (
        <button
          // disabled={!expired}
          type="button"
          className={classes.buttonContractCancel}
          onClick={() => mutate({ activity: "refused" })}
        >
          refuse the work
        </button>
      )}
      {props.activity === "refused" && !props.client && (
        <div>
          <button
            // disabled={!expired}
            type="button"
            className={classes.buttonContract}
            onClick={() => mutate({ activity: "complain" })}
          >
            send a complain
          </button>
          <p className={classes.complainText}>
            {"( If you have done the work properly you send a complain )"}
          </p>
        </div>
      )}
      {isError && (
        <p className={classes.complainText}>
          {"( You need to refresh the page ,the status might changed )"}
        </p>
      )}
    </React.Fragment>
  );
};

export default ButtonContract;
