import { Link } from "react-router-dom";
import classes from "./SuccessPage.module.css";
import CheckIcon from "@mui/icons-material/Check";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { updateFileData, URL } from "../utils/queryFunctions";
const SuccessPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);

  const [contractId, setContractId] = useState("");

  const postData = (data) => {
    return updateFileData(`${URL}/api/v1/contracts/${contractId}`, data, token);
  };

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      // props.onActivity(data.data.data.contract.activity);
    },
  });

  // console.log(props.activity);

  useEffect(() => {
    setContractId(searchParams.get("contractId"));
    if (!contractId) {
      return;
    }
    mutate({ activity: "offer", tokenMidtrans: "used" });
  }, [token]);

  return (
    <div className={classes.main}>
      <div className={classes.cardCon}>
        <div className={classes.card}>
          <div className={classes.iconCon}>
            <CheckIcon sx={{ fontSize: 50 }} />
          </div>
          <p className={classes.text}>you successfully startd your contract</p>
          <p className={classes.linkText}>
            click <Link to="/">here</Link> to go back to the home page
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
