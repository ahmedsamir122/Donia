import classes from "./OneContractContent.module.css";
import { useState } from "react";
import BackDropModal from "../modal/BackDrop";
import ReviewModal from "../modal/ReviewModal";
import Loading from "../loading/Loading";
import { useParams } from "react-router-dom";
import { URL, getWishList, postDataProtect } from "../utils/queryFunctions";
import { useQuery, useMutation } from "react-query";
import { useSelector } from "react-redux";
import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useEditContractActivity } from "../utils/queryFunctions";

const OneContractContent = () => {
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const showModalHandler = () => {
    setShowModal((prev) => {
      return !prev;
    });
  };

  const postData = (data) => {
    return getWishList(`${URL}/api/v1/contracts/${params.contractId}`, token);
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "oneContract",
    postData,
    {
      refetchOnWindowFocus: false,
      enabled: !!user, // Only execute the query if userId is truthy
    }
  );

  const startChat = (data, id) => {
    return postDataProtect(
      `${URL}/api/v1/conversations/${params.contractId}`,
      data,
      token
    );
  };

  const {
    mutate,
    isError: isErrorChat,
    error: errorChat,
  } = useMutation(startChat, {
    onSuccess: (data) => {
      console.log(data);
      navigate(`/messages/${data.data.data.conversation._id}`);
    },
  });
  const chatHandler = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className={classes.loading}>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const contract = data?.data.data.contract;

  const client = user?.id === contract?.client?.id ? true : false;

  console.log(client);
  return (
    <div className={classes.main}>
      {contract && (
        <div className="container">
          <div className={classes.contractCon}>
            <div className={classes.contractLeft}>
              <div className={classes.contractDetailsCon}>
                <h3 className={classes.contractDetailsName}>Status</h3>
                <p className={classes.contractDetailsOne}>
                  {contract?.activity}
                </p>
              </div>
              <div className={classes.contractDetailsCon}>
                <h3 className={classes.contractDetailsName}>Contract Title</h3>
                <p className={classes.contractDetailsOne}>{contract?.name} </p>
              </div>
              <div className={classes.contractDetailsCon}>
                <h3 className={classes.contractDetailsName}>Job Description</h3>
                <p className={classes.contractDetailsOne}>{contract?.task}</p>
              </div>
              <div className={classes.contractDetailsCon}>
                <h3 className={classes.contractDetailsName}>Offer Expires</h3>
                <p className={classes.contractDetailsOne}>
                  {dateFormat(contract?.deadline, " mmmm dS, yyyy")}
                </p>
              </div>
              <div className={classes.contractDetailsCon}>
                <h3 className={classes.contractDetailsName}>Offer Date</h3>
                <p className={classes.contractDetailsOne}>
                  {dateFormat(contract?.createdAt, " mmmm dS, yyyy")}
                </p>
              </div>
            </div>
            <div className={classes.contractRight}>
              <div className={classes.contractOptionCon}>
                {contract.activity === "offer" && !client && (
                  <p
                    onClick={() =>
                      mutate(
                        `${URL}/api/v1/contracts/${params.contractId}/accept`
                      )
                    }
                    className={classes.contractOption}
                  >
                    Accept Offer
                  </p>
                )}
                {contract.activity === "offer" && !client && (
                  <p
                    className={classes.contractOption}
                    onClick={() =>
                      mutate(
                        `${URL}/api/v1/contracts/${params.contractId}/refuse`
                      )
                    }
                  >
                    Decline Offer
                  </p>
                )}
                {contract.activity === "progress" && !client && (
                  <p
                    className={classes.contractOption}
                    onClick={() =>
                      mutate(
                        `${URL}/api/v1/contracts/${params.contractId}/submit`
                      )
                    }
                  >
                    submit your work
                  </p>
                )}
                {contract.activity === "submit" && client && (
                  <p className={classes.contractOption}>report</p>
                )}
                {contract.activity === "submit" &&
                  client &&
                  contract.reviewCs.length === 0 && (
                    <p
                      className={classes.contractOption}
                      onClick={() => setShowModal(true)}
                    >
                      add review
                    </p>
                  )}
                {contract.activity === "submit" &&
                  !client &&
                  contract.reviewFs.length === 0 && (
                    <p
                      className={classes.contractOption}
                      onClick={() => setShowModal(true)}
                    >
                      add review
                    </p>
                  )}

                {contract.activity === "submit" &&
                  client &&
                  contract.reviewCs.length > 0 && (
                    <p className={classes.contractOption}>view review</p>
                  )}
                {contract.activity === "submit" &&
                  !client &&
                  contract.reviewFs.length > 0 && (
                    <p className={classes.contractOption}>view review</p>
                  )}

                <p
                  className={classes.contractOption}
                  onClick={() =>
                    navigate(`/messages/${contract?.conversation}`)
                  }
                >
                  Send message
                </p>
              </div>
              <div className={classes.contractClientCon}>
                <h3 className={classes.contractClientTitle}>
                  {client ? "The talent" : "the client"}
                </h3>
                <div
                  className={classes.user}
                  onClick={() =>
                    navigate(
                      client
                        ? `/${contract.freelancer?.username}`
                        : `/u/${contract.client?.username}`
                    )
                  }
                >
                  <img
                    src={
                      client
                        ? ` ${contract.freelancer?.photo}`
                        : `${contract.client?.photo}`
                    }
                    className={classes.img}
                    alt=""
                  />
                  <p className={classes.contractClientName}>
                    {client
                      ? `${contract.freelancer?.username}`
                      : `${contract.client?.username}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <BackDropModal onClick={showModalHandler} />}
      {showModal && <ReviewModal onClick={showModalHandler} />}
    </div>
  );
};

export default OneContractContent;
