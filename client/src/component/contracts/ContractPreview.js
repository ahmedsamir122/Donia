import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { postDataProtect, URL } from "../utils/queryFunctions";
import { useParams } from "react-router-dom";
import Loading from "../loading/Loading";
import classes from "./ContractPreview.module.css";

const ContractPreview = (props) => {
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();
  const params = useParams();

  const postData = (data) => {
    return postDataProtect(
      `${URL}/api/v1/contracts/checkout-session/${params.username}`,
      data,
      token
    );
  };
  console.log(props.onContract);
  const { mutate, isError, error, isLoading } = useMutation(postData, {
    onSuccess: (data) => {
      console.log(data.data.session.url);
      window.location.href = data.data.session.url;
    },
  });

  const checkoutHandler = () => {
    mutate({
      name: props.onContract.name,
      task: props.onContract.description,
      budget: props.onContract.budget,
      deadline: props.onContract.deadline,
    });
  };

  return (
    <div className={classes.detailCon}>
      <div className={classes.left}>
        <div className={classes.nameCon}>
          <h2 className={classes.nameTitle}>Contract name:</h2>
          <p className={classes.name}>{props.onContract.name}</p>
        </div>
        <div className={classes.nameCon}>
          <h2 className={classes.nameTitle}>Task:</h2>
          <p className={classes.task}>{props.onContract.description}</p>
        </div>
        <div className={classes.nameCon}>
          <h2 className={classes.nameTitle}>Budget:</h2>
          <p className={classes.name}>{`${props.onContract.budget} Rp`}</p>
          {isError && error.response.data.message.includes("budget") && (
            <p>your is lower than what the talent request</p>
          )}
        </div>
        <div className={classes.nameCon}>
          <h2 className={classes.nameTitle}>Deadline:</h2>
          <p className={classes.name}>{`${props.onContract.deadline}`}</p>
          {isError && error.response.data.message.includes("deadline") && (
            <p>the deadline has to be minimum after 24hours </p>
          )}
        </div>
        <div className={classes.back} onClick={props.onClick}>
          Back
        </div>
      </div>
      <div className={classes.right}>
        <div>
          <h3>Summary</h3>
          <div className={classes.rightCon}>
            <p>budget</p>
            <p>{`${props.onContract.budget} Rp`}</p>
          </div>
          <div className={classes.rightCon}>
            <div>admin fee</div>
            <div>{`${props.onContract.budget * 0.02} Rp`}</div>
          </div>
          <div className={classes.rightTotal}>
            <p>Total</p>
            <p>{`${props.onContract.budget * 1.02} Rp`}</p>
          </div>
        </div>
        <p className={classes.check} onClick={checkoutHandler}>
          Check out
        </p>
      </div>
    </div>
  );
};

export default ContractPreview;
