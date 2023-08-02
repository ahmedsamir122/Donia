import Talent from "./Talent";
import classes from "./Talents.module.css";
import user2 from "../../img/user2.jpg";
import Filter from "./Filter";
import axios from "axios";
import { useQuery } from "react-query";
import Loading from "../loading/Loading";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import TalentFetch from "./TalentsFetch";
import { URL } from "../utils/queryFunctions";
import FetshingAndPagination from "./FetchingAndPaginaion";

const Talents = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [url, setUrl] = useState("");

  const fetchTalents = () => {
    return axios.get(`${URL}/api/v1/users?${url}`);
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    ["search", url],
    fetchTalents,
    { refetchOnWindowFocus: false, enabled: !!searchParams }
  );

  if (isLoading) {
    return (
      <div className={classes.mainLoading}>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>{error.Msg}</div>;
  }

  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.subContainer}>
          <div className={classes.filters}>
            <Filter />
          </div>
          <FetshingAndPagination />
        </div>
      </div>
    </div>
  );
};

export default Talents;
