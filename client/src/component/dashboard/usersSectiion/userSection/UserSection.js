import classes from "./UserSection.module.css";
import axios from "axios";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { URL } from "../../../utils/queryFunctions";
import Loading from "../../../loading/Loading";
import ClientContracts from "./clientContracts/ClientContracts";
import TalentContacts from "./talentContracts/TalentContacts";
import Avatar from "@mui/material/Avatar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from "react-redux";
import UserReports from "./userReports/UserReports";

const UserSection = () => {
  const { username } = useParams();
  const [client, SetClient] = useState(false);
  const [talent, setTalent] = useState(false);
  const [reports, setReports] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const tokenLocal = localStorage.getItem("token") || "";
  let duration = "";

  const fetchUser = () => {
    return axios.get(`${URL}/api/v1/users/${username}`);
  };
  useEffect(() => {
    duration = document.querySelector("#duration");
    console.log(duration);
  });

  const updateStatus = () => {
    return axios.patch(
      `${URL}/api/v1/users/blockUser/${username}`,
      { status: duration.value },
      {
        headers: { Authorization: `Bearer ${tokenLocal}` },
      }
    );
  };
  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "user",
    fetchUser,
    { refetchOnWindowFocus: false }
  );

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
  const renderContractsBtn = () => {
    if (data) {
      if (data.data.data.user.perform == "talent")
        return (
          <>
            <button className={classes.btn} onClick={handleContractClientBtn}>
              Show User Contracts (Client)
            </button>
            <button className={classes.btn} onClick={handleContractTalentBtn}>
              Show User Contracts (Talent)
            </button>
          </>
        );
      else
        return (
          <>
            <button className={classes.btn} onClick={handleContractClientBtn}>
              Show User Contracts (Client)
            </button>
          </>
        );
    }
  };

  const handleContractClientBtn = () => {
    SetClient(true);
    setTalent(false);
    setReports(false);
  };
  const handleContractTalentBtn = () => {
    SetClient(false);
    setReports(false);
    setTalent(true);
  };
  const handleUserDataBtn = () => {
    SetClient(false);
    setTalent(false);
    setReports(false);
  };
  const handleUserReportsBtn = () => {
    SetClient(false);
    setTalent(false);
    setReports(true);
  };
  const renderUserStatus = () => {
    if (data.data.data.user.status === "3d") return "Blocked For Three Days";
    if (data.data.data.user.status === "1w") return "Blocked For One Week";
    if (data.data.data.user.status === "2w") return "Blocked For Two Weeks";
    if (data.data.data.user.status === "1m") return "Blocked For One Month";
    if (data.data.data.user.status === "diactive") return "Diactive";
    if (data.data.data.user.status === "active") return "Active";
  };

  const showSwal = () => {
    document.querySelector("#duration").value === data.data.data.user.status
      ? withReactContent(Swal).fire("This is The Currrent Status")
      : withReactContent(Swal)
          .fire({
            title: "Are you sure?",
            text: `You will ${
              duration.options[duration.selectedIndex].text
            } this User`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure",
          })
          .then((result) => {
            if (result.isConfirmed) {
              updateStatus()
                .then(() => {
                  Swal.fire({
                    title: "Success",
                    text: `${
                      duration.options[duration.selectedIndex].text
                    } this User`,
                    icon: "success",
                  });
                  refetch();
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Error",
                    text: `Failed to block user. ${error.message}`,
                    icon: "error",
                  });
                });
            }
          });
  };

  return (
    <>
      <h2>
        {data.data.data.user.username} ({data.data.data.user.status})
      </h2>
      <div className={classes.btns}>
        <button className={classes.btn} onClick={handleUserReportsBtn}>
          Show User Reports
        </button>
        <button className={classes.btn} onClick={handleUserDataBtn}>
          Show User Data
        </button>

        {renderContractsBtn()}
      </div>
      {client && <ClientContracts />}
      {talent && <TalentContacts />}
      {reports && <UserReports />}
      <div
        className={`${classes.profile}  ${
          (talent || client || reports) && classes.hidden
        }`}
      >
        <div className={classes.userSide}>
          <Avatar
            alt="Remy Sharp"
            src={`${data.data.data.user.photo}`}
            sx={{
              width: 120,
              height: 140,
            }}
          />
          <h2>{data.data.data.user.username}</h2>
          <p>{data.data.data.user.perform}</p>
          <p>
            {data.data.data.user.city}, {data.data.data.user.country}
          </p>
          <div className={classes.block}>
            <label>Status: </label>
            <select id="duration">
              <option value="3d">Block 3 Days</option>
              <option value="1w">Block 1 Week</option>
              <option value="2w">Block 2 Week</option>
              <option value="1m">Block 1 Month</option>
              <option value="diactive">Diactive</option>
              <option value="active">Active</option>
            </select>
          </div>
          <button
            for="duration"
            className={classes.blockBtn}
            onClick={showSwal}
          >
            Submit
          </button>
        </div>
        <div className={classes.userInfo}>
          <div className={classes.row}>
            <div>
              <h6>Full Name</h6>
            </div>
            <div>{data.data.data.user.username}</div>
          </div>
          <div className={classes.row}>
            <div>
              <h6>Email</h6>
            </div>
            <div>{data.data.data.user.email}</div>
          </div>
          <div className={classes.row}>
            <div>
              <h6>Phone</h6>
            </div>
            <div>{data.data.data.user.phone}</div>
          </div>
          <div className={classes.row}>
            <div>
              <h6>Address</h6>
            </div>
            <div>
              {data.data.data.user.city}, {data.data.data.user.country}
            </div>
          </div>
          <div className={classes.row}>
            <div>
              <h6>Status</h6>
            </div>
            <div>{renderUserStatus()}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserSection;
