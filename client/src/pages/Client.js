import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import ClientProfile from "../component/talentProfile/ClientProfile";
import { URL } from "../component/utils/queryFunctions";
const Client = () => {
  const params = useParams();

  const { isLoading, data, isError, error } = useQuery(
    "clientProfile",
    () => {
      return axios.get(`${URL}/api/v1/users/${params.usernameClient}`);
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }
  console.log(data.data.data.user);
  return (
    <React.Fragment>
      <ClientProfile showEdit={false} onData={data.data.data.user} />
    </React.Fragment>
  );
};

export default Client;
