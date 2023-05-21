import React from "react";
import TalentProfile from "../component/talentProfile/TalentProfile";
import MeProfile from "../component/talentProfile/MeProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import axios from "axios";
import Loading from "../component/loading/Loading";
import classes from "./Talent.module.css";
import { URL } from "../component/utils/queryFunctions";
const Talent = () => {
  const params = useParams();
  const userRed = useSelector((state) => state.auth.user);

  console.log(userRed?.username === params.username);

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "talentProfile",
    () => {
      return axios.get(`${URL}/api/v1/users/${params.username}`);
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading || isFetching) {
    return (
      <div className={classes.loading}>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }
  console.log(data.data.data.user);
  return (
    <React.Fragment>
      {userRed?.username === params.username && (
        <MeProfile showEdit={true} username={params.username} />
      )}
      {userRed?.username !== params.username && (
        <TalentProfile
          showEdit={false}
          username={params.username}
          onData={data.data.data.user}
        />
      )}
    </React.Fragment>
  );
};

export default Talent;
