import classes from "./OneContractContent.module.css";
import img1 from "../../img/user2.jpg";
import { useState } from "react";
import BackDropModal from "../modal/BackDrop";
import ReviewModal from "../modal/ReviewModal";

const OneContractContent = () => {
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal((prev) => {
      return !prev;
    });
  };

  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.contractCon}>
          <div className={classes.contractLeft}>
            <div className={classes.contractDetailsCon}>
              <h3 className={classes.contractDetailsName}>Status</h3>
              <p className={classes.contractDetailsOne}>
                Pending - expires on June 30.2023
              </p>
            </div>
            <div className={classes.contractDetailsCon}>
              <h3 className={classes.contractDetailsName}>Contract Title</h3>
              <p className={classes.contractDetailsOne}>Instagram Story </p>
            </div>
            <div className={classes.contractDetailsCon}>
              <h3 className={classes.contractDetailsName}>Job Description</h3>
              <p className={classes.contractDetailsOne}>
                I have a product for make up i will send u the video which is 30
                sec and please put in story in your account
              </p>
            </div>
            <div className={classes.contractDetailsCon}>
              <h3 className={classes.contractDetailsName}>Offer Expires</h3>
              <p className={classes.contractDetailsOne}>June 30.2023</p>
            </div>
            <div className={classes.contractDetailsCon}>
              <h3 className={classes.contractDetailsName}>Offer Date</h3>
              <p className={classes.contractDetailsOne}>June 23.2023</p>
            </div>
            <div className={classes.contractDetailsCon}>
              <h3 className={classes.contractDetailsName}>Contract period</h3>
              <p className={classes.contractDetailsOne}>7 days</p>
            </div>
            <div className={classes.contractDetailsCon}>
              <h3 className={classes.contractDetailsName}>Payment Method</h3>
              <p className={classes.contractDetailsOne}>Go pay </p>
            </div>
          </div>
          <div className={classes.contractRight}>
            <div className={classes.contractOptionCon}>
              <p onClick={showModalHandler} className={classes.contractOption}>
                Accept Offer
              </p>
              <p className={classes.contractOption}>Decline Offer</p>
              <p className={classes.contractOption}>Messages</p>
            </div>
            <div className={classes.contractClientCon}>
              <h3 className={classes.contractClientTitle}>The client</h3>
              <div className={classes.user}>
                <img src={img1} className={classes.img} />
                <p className={classes.contractClientName}>Jonas 123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && <BackDropModal onClick={showModalHandler} />}
      {showModal && <ReviewModal onClick={showModalHandler} />}
    </div>
  );
};

export default OneContractContent;
