import axios from "axios";
import { useQuery } from "react-query";
import Loading from "../loading/Loading";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Talent from "./Talent";
import classes from "./TalentsFetch.module.css";
import { useSelector } from "react-redux";
import { URL } from "../utils/queryFunctions";

const TalentFetch = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [url, setUrl] = useState("");
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const fetchTalents = () => {
    return axios.get(`${URL}/api/v1/users?${url}page=${props.page}`);
  };

  useEffect(() => {
    let reviews = [];
    reviews = searchParams.get("reviews")
      ? searchParams
          .get("reviews")
          .split(",")
          .map((el) => {
            return `ratingsQuantityF=${el}&`;
          })
          .join("")
      : "";
    let rate = searchParams.get("rate")
      ? searchParams
          .get("rate")
          .split(",")
          .map((el) => {
            return `ratingsQuantityF=${el}&`;
          })
          .join("")
      : "";

    let q = searchParams.get("q") ? `username=${searchParams.get("q")}&` : "";

    setUrl(`${q}${reviews}${rate}`);
  }, [searchParams]);

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "search",
    fetchTalents,
    { refetchOnWindowFocus: false, enabled: !!searchParams }
  );

  useEffect(() => {
    refetch();
    props.onCountHandler(data?.data.total);
  }, [url, props.page, refetch, data?.data.total]);

  if (isLoading) {
    return (
      <div className={classes.mainLoading}>
        <Loading />
      </div>
    );
  }

  if (isError || !data) {
    return <div>{error?.Msg}</div>;
  }

  return (
    <div className={classes.conArtists}>
      {data?.data.data.users.map((artist, i) => (
        <Talent
          key={artist.id}
          username={artist.username}
          photo={artist.photo}
          id={artist.id}
          ratingsAverageF={artist.ratingsAverageF}
          ratingsQuantityF={artist.ratingsQuantityF}
          country={artist.country}
          city={artist.city}
        />
      ))}
    </div>
  );
};

export default TalentFetch;
