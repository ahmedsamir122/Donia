import classes from "./OneContractContent.module.css";
import { useState, useEffect } from "react";
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
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import OneReview from "./OneReview";
import ButtonContract from "./ButtonContract";

const OneContractContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [contractActivity, setContractActivity] = useState("offer");
  const [expired, setExpired] = useState(false);
  const [timer, setTimer] = useState(0);
  const [deadline, setDeadline] = useState(0); // New state variable for deadline
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

  useEffect(() => {
    setContractActivity(data?.data?.data.contract.activity);
  }, [data?.data?.data.contract.activity]);

  useEffect(() => {
    if (data && data.data && data.data.data && data.data.data.contract) {
      const contractExpiredAt = new Date(data.data.data.contract.expiredAt);

      setDeadline(contractExpiredAt);
    }
  }, [data]);

  const activityHandler = (activity) => {
    setContractActivity(activity);
  };

  useEffect(() => {
    if (contractActivity !== "offer") {
      return;
    }
    const intervalId = setInterval(() => {
      if (deadline > Date.now()) {
        // Check if the deadline is in the future
        const remainingTime = deadline - Date.now();
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        if (remainingTime === 0) {
          setExpired(true);
        }
        setTimer(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimer("Expired"); // Set a message when the deadline has passed
        clearInterval(intervalId); // Clear the interval when the deadline is reached
      }
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [deadline, contractActivity]);

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
  const other = client
    ? data?.data.data.contract.freelancer
    : data?.data.data.contract.client;
  console.log(client);
  return (
    <div className={classes.main}>
      {contract && (
        <div className="container">
          {data?.data.data.contract.activity === "offer" && (
            <div className={classes.timerCon}>
              <div>the offer will end after</div>
              <div className={classes.timer}>{timer}</div>
              <div></div>
            </div>
          )}
          <div className={classes.contractCon}>
            <div className={classes.contractLeft}>
              <div className={classes.topLeft}>
                <div className={classes.statusCon}>
                  <div>Status:</div>
                  <div className={classes.offer}>{contractActivity}</div>
                </div>

                <div className={classes.deadlineCon}>
                  <div>Deadline:</div>
                  <div className={classes.date}>
                    {" "}
                    {dateFormat(contract.deadline, "mmmm d, yyyy")}
                  </div>
                </div>
                <div className={classes.budgetCon}>
                  <div>Budget:</div>
                  <div className={classes.date}>
                    {" "}
                    {data.data.data.contract.budget}
                  </div>
                </div>
              </div>
              <div className={classes.contractDescription}>
                <div className={classes.title}>{contract.name}</div>
                <div className={classes.description}>{contract.task}</div>
              </div>
              {(contractActivity === "expiredDeadline" ||
                contractActivity === "approved" ||
                contractActivity === "refused_final") && (
                <div className={classes.reviewsCon}>
                  <div className={classes.reviewsTop}>
                    <div className={classes.reviewsTitle}>Reviews</div>
                    {((data?.data?.data.contract.reviewFs.length === 0 &&
                      !client) ||
                      (data?.data?.data.contract.reviewCs.length === 0 &&
                        client)) && (
                      <div
                        className={classes.addReviewIcon}
                        onClick={() => setShowModal(true)}
                      >
                        +
                      </div>
                    )}
                  </div>
                  <div className={classes.reviewsBothCon}>
                    {data?.data?.data.contract.reviewFs.map((review) => (
                      <OneReview
                        client={client}
                        otherData={other}
                        review={review}
                      />
                    ))}
                    {data?.data?.data.contract.reviewFs.length > 0 &&
                      data?.data?.data.contract.reviewCs.length > 0 && (
                        <div className={classes.spaceBetween}></div>
                      )}
                    {data?.data?.data.contract.reviewCs.map((review) => (
                      <OneReview
                        client={client}
                        otherData={other}
                        review={review}
                      />
                    ))}
                    {data?.data?.data.contract.reviewFs.length === 0 &&
                      data?.data?.data.contract.reviewCs.length === 0 && (
                        <div className={classes.dataEmpty}>
                          <div>
                            <div className={classes.dataEmptyIcon}>
                              <TroubleshootIcon />
                            </div>
                            <div className={classes.dataEmptyIconText}>
                              No reviews
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
              <div className={classes.buttonCon}>
                <ButtonContract
                  activity={contractActivity}
                  client={client}
                  onActivity={activityHandler}
                />
              </div>
            </div>
            <div className={classes.contractRight}>
              <div className={classes.userData}>
                <div className={classes.userTitle}>
                  {client ? "talent" : "client"}
                </div>
                <div className={classes.userNameBox}>
                  <img
                    className={classes.img}
                    src={
                      client
                        ? ` ${contract.freelancer?.photo}`
                        : `${contract.client?.photo}`
                    }
                    alt=""
                  />
                  <div className={classes.userName}>
                    {client
                      ? ` ${contract.freelancer?.username}`
                      : `${contract.client?.username}`}
                  </div>
                </div>
                <div className={classes.chatBox}>
                  <div
                    className={classes.chat}
                    onClick={() =>
                      navigate(
                        `/messages/${data?.data?.data.contract.conversation}`
                      )
                    }
                  >
                    send message
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <BackDropModal onClick={showModalHandler} />}
      {showModal && <ReviewModal onClick={showModalHandler} client={client} />}
    </div>
  );
};

export default OneContractContent;
