import HomePage from "../component/homePage/HomePage";
import SearchCard from "../component/search/SearchCard";
import { useSelector } from "react-redux";
import React from "react";
const Home = () => {
  const token = localStorage.getItem("token") || "";
  const user = useSelector((state) => state.auth.user);
  return (
    <React.Fragment>
      {!token && <HomePage />}
      {token && user && <SearchCard />}
    </React.Fragment>
  );
};

export default Home;
