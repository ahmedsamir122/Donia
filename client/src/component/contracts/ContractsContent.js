import classes from "./ContractsContent.module.css";
import DataTable from "./ContractsTable";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { URL, getWishList } from "../utils/queryFunctions";
import { useEffect } from "react";
import ContractContentOneMobil from "./ContractContentOneMobil";
import Loading from "../loading/Loading";

const ContractsContent = () => {
  const [talent, setTalent] = useState(true);
  const [client, setClient] = useState(false);
  const [dataContract, setDataContract] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [allFilter, setAllFilter] = useState(true);
  const [activeFilter, setActiveFilter] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchContractsF = () => {
    return getWishList(`${URL}/api/v1/contracts/my-contractsF`, token);
  };

  const {
    isLoading: loadingF,
    error: errorF,
    data: dataF,
    refetch: refetchF,
    isFetching: isFetchingF,
  } = useQuery("contractsF", fetchContractsF, {
    refetchOnWindowFocus: false,
    enabled: !!user, // Only execute the query if userId is truthy
  });

  const fetchContractsC = () => {
    return getWishList(`${URL}/api/v1/contracts/my-contractsC`, token);
  };

  const {
    isLoading: loadingC,
    error: errorC,
    data: dataC,
    refetch: refetchC,
    isFetching: isFetchingC,
  } = useQuery("contractsC", fetchContractsC, {
    refetchOnWindowFocus: false,
    enabled: !!user, // Only execute the query if userId is truthy
  });

  const showTalentHandler = () => {
    setTalent(true);
    setClient(false);
  };
  const showClientHandler = () => {
    setTalent(false);
    setClient(true);
  };

  const allFilterHandler = () => {
    setAllFilter(true);
    setActiveFilter(false);
  };
  const activeFilterHandler = () => {
    setAllFilter(false);
    setActiveFilter(true);
  };

  const showReviewHandler = () => {
    setShowReviewModal((prev) => !prev);
  };
  console.log(dataContract);

  useEffect(() => {
    if (!user) {
      return;
    }
    refetchC();
    if (user.perform === "talent") {
      refetchF();
    }

    if (talent && dataF?.data?.data?.contracts) {
      setDataContract([...dataF?.data.data.contracts]);
    }
    if (client && dataC?.data?.data?.contracts) {
      setDataContract([...dataC?.data.data.contracts]);
    }
  }, [
    user,
    client,
    talent,
    dataF?.data.data.contracts,
    dataC?.data.data.contracts,
    refetchF,
    refetchC,
  ]);

  if (loadingF || loadingC || !user) {
    return (
      <div className={classes.mainLoading}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.top}>
          <h3 className={classes.pageTitle}>Contracts</h3>
          {user?.perform === "talent" && (
            <div className={classes.userTypeCon}>
              <p
                onClick={showTalentHandler}
                className={`${classes.userType} ${talent && classes.active}`}
              >
                As a talent
              </p>
              <p
                onClick={showClientHandler}
                className={`${classes.userType} ${client && classes.active}`}
              >
                As a client
              </p>
            </div>
          )}
        </div>
        {/* <div className={classes.filterCon}>
          <p
            className={`${classes.filter} ${allFilter && classes.activeFilter}`}
            onClick={allFilterHandler}
          >
            All
          </p>
          <p
            className={`${classes.filter} ${
              activeFilter && classes.activeFilter
            }`}
            onClick={activeFilterHandler}
          >
            Active
          </p>
        </div> */}
        {dataContract.length > 0 && (
          <DataTable
            client={client}
            onData={dataContract}
            onClick={showReviewHandler}
          />
        )}
        {dataContract.length === 0 && <p>your contract list is empty</p>}
        <div className={classes.dataCon}>
          {dataContract.length > 0 &&
            dataContract.map((item) => (
              <ContractContentOneMobil
                key={item._id}
                onData={item}
                client={client}
              />
            ))}
          {dataContract.length === 0 && <p>your contract list is empty</p>}
        </div>
      </div>
    </div>
  );
};

export default ContractsContent;
