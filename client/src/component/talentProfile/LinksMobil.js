import classes from "./LinksMobil.module.css";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import OneLinksMobil from "./OneLinksMobil";
import { useSelector } from "react-redux";

const LinksMobil = (props) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className={classes.linksMobile}>
      <h2 className={classes.reviewsTitle}>Links</h2>
      <div className={classes.socialIcons}>
        {props.onData?.links.map((el, i) => (
          <OneLinksMobil key={i} id={i} title={el} showEdit={props.showEdit} />
        ))}
      </div>
      <div className={classes.editIcon}>
        {props.showEdit && <AddOutlinedIcon onClick={props.onClick} />}
      </div>
    </div>
  );
};

export default LinksMobil;
