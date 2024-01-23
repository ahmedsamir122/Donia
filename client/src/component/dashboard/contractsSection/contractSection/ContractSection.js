import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../../utils/queryFunctions";
import Loading from "../../../loading/Loading";
import { useQuery } from "react-query";
import classes from "./ContractSection.module.css";
import { useSelector } from "react-redux";
import dateFormat from "dateformat";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import NewReportComponent from "../../newReportComponent/NewReportComponent";

const ContractSection = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [contractVisible, setContractVisible] = useState(true);
  const tokenLocal = localStorage.getItem("token") || "";

  const fetchUser = () => {
    return axios.get(`${URL}/api/v1/contracts/${id}`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "contract",
    fetchUser,
    { refetchOnWindowFocus: false }
  );
  const handleNewReport = () => {
    setContractVisible(!contractVisible);
  };

  if (isLoading) {
    return (
      <div className={classes.mainLoading}>
        <Loading />
      </div>
    );
  }

  if (isError || !data) {
    return <div>{error?.response.data.message}</div>;
  }

  return (
    <>
      <div className={classes.headerContainer}>
        <h2>{data.data.data.contract.name}</h2>
        <div>
          {contractVisible ? (
            <button className={classes.reportBtn} onClick={handleNewReport}>
              Create New Report
            </button>
          ) : (
            <button className={classes.reportBtn} onClick={handleNewReport}>
              Close
            </button>
          )}
        </div>
      </div>
      {contractVisible ? (
        <div className={classes.container}>
          <div className={classes.columnContainer}>
            <div className={classes.cards}>
              <div className={classes.card}>
                <h3>Status</h3>
                <p>{data.data.data.contract.activity}</p>
              </div>
              <div className={classes.card}>
                <h3>BUDGET</h3>
                <p>{data.data.data.contract.budget}$</p>
              </div>
              <div className={classes.card}>
                <h3>DEADLINE</h3>
                <p>
                  {dateFormat(
                    data.data.data.contract.deadline,
                    " mmmm dS, yyyy"
                  )}
                </p>
              </div>
            </div>
            <div className={classes.contractDetails}>
              <h2>Contract Details</h2>
              <h4>Job Description</h4>
              <p>{data.data.data.contract.task}</p>
              <h4>Created at</h4>
              <p>
                {dateFormat(
                  data.data.data.contract.createdAt,
                  " mmmm dS, yyyy"
                )}
              </p>

              <h4>Expired at</h4>
              <p>
                {dateFormat(
                  data.data.data.contract.expiredAt,
                  " mmmm dS, yyyy"
                )}
              </p>
            </div>
            <h2 className={classes.reviewsHeader}>Reviews</h2>
            <div className={classes.reviews}>
              <div className={classes.review}>
                <h4>Client Review</h4>
                <Rating
                  name="read-only"
                  value={data.data.data.contract.reviewCs[0]?.rating}
                  readOnly
                />
                <p>{data.data.data.contract.reviewCs[0]?.review}</p>
              </div>
              <div className={classes.review}>
                <h4>Talent Review</h4>
                <Rating
                  name="read-only"
                  value={data.data.data.contract.reviewFs[0]?.rating}
                  readOnly
                />
                <p>{data.data.data.contract.reviewFs[0]?.review}</p>
              </div>
            </div>
          </div>
          <div className={classes.usersCards}>
            <div className={classes.userCard}>
              <h4>Client</h4>
              <div className={classes.info}>
                <Avatar
                  alt="Remy Sharp"
                  src={`${data.data.data.contract.client.photo}`}
                  sx={{ width: 56, height: 56 }}
                />
                <div>
                  <h3>{data.data.data.contract.client.username}</h3>
                  <p>{data.data.data.contract.client.id}</p>
                </div>
              </div>
            </div>
            <div className={classes.userCard}>
              <h4>Talent</h4>
              <div className={classes.info}>
                <Avatar
                  alt="Remy Sharp"
                  src={`${data.data.data.contract.freelancer.photo}`}
                  sx={{ width: 56, height: 56 }}
                />
                <div>
                  <h3>{data.data.data.contract.freelancer.username}</h3>
                  <p>{data.data.data.contract.freelancer.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NewReportComponent contractId={id} />
      )}
    </>
  );
};
export default ContractSection;
