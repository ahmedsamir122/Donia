import classes from "./BlockedList.module.css";
import { useSelector } from "react-redux";
import BlockListOne from "./BlockListOne";
const BlockedList = () => {
  const blocklist = useSelector((state) => state.blocklist.blocklist);
  console.log(blocklist);
  return (
    <div className={classes.main}>
      <p className={classes.title}>Blocked accounts</p>
      <div>
        {blocklist.length > 0 &&
          blocklist.map((item) => (
            <BlockListOne
              username={item.username}
              photo={item.photo}
              id={item.user}
              key={item.user}
            />
          ))}
        {blocklist.length === 0 && <div>the block list is empty</div>}
      </div>
    </div>
  );
};

export default BlockedList;
