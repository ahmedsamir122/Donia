import classes from "./ContractsContent.module.css";
import DataTable from "./ContractsTable";
import { useState } from "react";
import { Link } from "react-router-dom";

let y = "active";
const ContractsContent = () => {
  const [talent, setTalent] = useState(true);
  const [client, setClient] = useState(false);

  const [allFilter, setAllFilter] = useState(true);
  const [activeFilter, setActiveFilter] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);

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
  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.top}>
          <h3 className={classes.pageTitle}>Contracts</h3>
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
        </div>
        <div className={classes.filterCon}>
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
        </div>
        <DataTable onClick={showReviewHandler} />
        <div className={classes.dataCon}>
          <div className={classes.contract}>
            <div className={classes.topContract}>
              <div className={classes.dateContract}>09 jan 2023</div>
              <p className={classes.statusContract}>offer</p>
            </div>
            <p className={classes.nameContract}>
              Post a story in your instagram
            </p>
            <div className={classes.bottomContract}>
              <Link to="#" className={classes.userContract}>
                Jonas123
              </Link>
              <Link className={classes.chatCon}>
                <div
                  className={`${classes.chatPoint} ${
                    y === "active" && classes.activeChat
                  }`}
                ></div>
                <p className={classes.chat}>Chat</p>
              </Link>
            </div>
          </div>
          <div className={classes.contract}>
            <div className={classes.topContract}>
              <div className={classes.dateContract}>09 jan 2023</div>
              <p className={classes.statusContract}>offer</p>
            </div>
            <p className={classes.nameContract}>
              Post a story in your instagram
            </p>
            <div className={classes.bottomContract}>
              <Link to="#" className={classes.userContract}>
                Jonas123
              </Link>
              <Link className={classes.chatCon}>
                <div
                  className={`${classes.chatPoint} ${
                    y === "active" && classes.activeChat
                  }`}
                ></div>
                <p className={classes.chat}>Chat</p>
              </Link>
            </div>
          </div>
          <div className={classes.contract}>
            <div className={classes.topContract}>
              <div className={classes.dateContract}>09 jan 2023</div>
              <p className={classes.statusContract}>offer</p>
            </div>
            <p className={classes.nameContract}>
              Post a story in your instagram
            </p>
            <div className={classes.bottomContract}>
              <Link to="#" className={classes.userContract}>
                Jonas123
              </Link>
              <Link className={classes.chatCon}>
                <div
                  className={`${classes.chatPoint} ${
                    y === "active" && classes.activeChat
                  }`}
                ></div>
                <p className={classes.chat}>Chat</p>
              </Link>
            </div>
          </div>
          <div className={classes.contract}>
            <div className={classes.topContract}>
              <div className={classes.dateContract}>09 jan 2023</div>
              <p className={classes.statusContract}>offer</p>
            </div>
            <p className={classes.nameContract}>
              Post a story in your instagram
            </p>
            <div className={classes.bottomContract}>
              <Link to="#" className={classes.userContract}>
                Jonas123
              </Link>
              <Link className={classes.chatCon}>
                <div
                  className={`${classes.chatPoint} ${
                    y === "active" && classes.activeChat
                  }`}
                ></div>
                <p className={classes.chat}>Chat</p>
              </Link>
            </div>
          </div>
          <div className={classes.contract}>
            <div className={classes.topContract}>
              <div className={classes.dateContract}>09 jan 2023</div>
              <p className={classes.statusContract}>offer</p>
            </div>
            <p className={classes.nameContract}>
              Post a story in your instagram
            </p>
            <div className={classes.bottomContract}>
              <Link to="#" className={classes.userContract}>
                Jonas123
              </Link>
              <Link className={classes.chatCon}>
                <div
                  className={`${classes.chatPoint} ${
                    y === "active" && classes.activeChat
                  }`}
                ></div>
                <p className={classes.chat}>Chat</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractsContent;
