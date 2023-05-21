import classes from "./FilterList.module.css";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import FilterClientModal from "../modal/FilterClient";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BackDropModal from "../modal/BackDrop";
import FilterListOne from "./FilterListOne";
import { useSelector } from "react-redux";

const FilterList = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const showModalHandler = () => {
    setShowModal((prev) => {
      return !prev;
    });
  };

  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <h2 className={classes.reviewsTitle}>Filter</h2>
        <div className={classes.editIcon}>
          <AddOutlinedIcon
            className={classes.icon}
            onClick={showModalHandler}
          />
        </div>
      </div>
      <div>
        {user.filterValues.map((item, i) => (
          <FilterListOne
            key={i}
            name={Object.keys(item)[0]}
            value={item[Object.keys(item)[0]]}
          />
        ))}
      </div>

      {showModal && <FilterClientModal onClick={showModalHandler} />}
      {showModal && <BackDropModal onClick={showModalHandler} />}
    </div>
  );
};

export default FilterList;
