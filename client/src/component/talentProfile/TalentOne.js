import classes from "./TalentOne.module.css";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import TopTalentOne from "./TopTalentOne";
import ReviewsTalentOne from "./ReviewsTalentOne";
import LinksMobil from "./LinksMobil";
import LinkAccount from "./LinkAccount";
import FilterList from "./FilterList";
import CreateContractModal from "../modal/ContractModal";
import BackDropModal from "../modal/BackDrop";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LinksSocialPc from "./LinksSocialPc";
import AddLinksModal from "../modal/LinksAccounts";
import { useMutation } from "react-query";
import { postDataProtect, URL } from "../utils/queryFunctions";
import Loading from "../loading/Loading";

const TalentOne = (props) => {
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [showAccount, setShowAccount] = useState(true);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const navigate = useNavigate();

  const postData = (data) => {
    return postDataProtect(
      `${URL}/api/v1/contracts/open/${props.onData.username}`,
      data,
      token
    );
  };

  const { mutate, isError, error, isLoading } = useMutation(postData);

  const showLinksModalHandler = () => {
    setShowLinksModal((prev) => {
      return !prev;
    });
  };

  const showFreelancerAccountHandler = () => {
    setShowAccount(true);
  };
  const showClientAccountHandler = () => {
    setShowAccount(false);
  };
  const showModalHandler = () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    mutate();

    setShowModal((prev) => {
      return !prev;
    });
  };

  if (isLoading) {
    return (
      <div className={classes.mainLoading}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.subContainer}>
          <div className={classes.leftProfile}>
            <TopTalentOne
              showEdit={props.showEdit}
              onData={props.onData}
              ratingsAverage={props.ratingsAverage}
              ratingsQuantity={props.ratingsQuantity}
              onFreelancer={props.onRateFreelancer}
              onClient={props.onRateClient}
              onFreelancerAccount={showFreelancerAccountHandler}
              onClientAccount={showClientAccountHandler}
              onClientProfile={props.client}
            />
            {!props.client && (
              <LinksMobil
                showEdit={props.showEdit}
                onClick={showLinksModalHandler}
                onData={props.onData}
              />
            )}
            {!props.showEdit && !props.client && (
              <div className={classes.bookButton} onClick={showModalHandler}>
                Hire
              </div>
            )}
            {props.showEdit && !props.client && showAccount && (
              <LinkAccount onData={props.onData} />
            )}
            {props.showEdit && !props.client && showAccount && <FilterList />}
            <ReviewsTalentOne
              username={props.username}
              client={props.reviewClient}
            />
          </div>
          {!props.client && (
            <div className={classes.rightProfile}>
              <div className={classes.topTitle}>
                {props.showEdit && (
                  <AddOutlinedIcon
                    className={classes.linkIcon}
                    onClick={showLinksModalHandler}
                  />
                )}
                <h2 className={classes.linksTitle}>Links</h2>
              </div>
              <LinksSocialPc onData={props.onData} showEdit={props.showEdit} />
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <CreateContractModal
          error={isError}
          onError={error?.response.data.message}
          onClick={showModalHandler}
        />
      )}
      {showLinksModal && <AddLinksModal onClick={showLinksModalHandler} />}
      {showModal && <BackDropModal onClick={showModalHandler} />}
      {showLinksModal && <BackDropModal onClick={showLinksModalHandler} />}
    </div>
  );
};

export default TalentOne;
