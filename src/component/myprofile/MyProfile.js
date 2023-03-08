import user from "../../img/user.jpg";
import background from "../../img/sales-growth-man-clicks-inscription-on-virtual-3d-screen-photo.jpg";
import classes from "./MyProfile.module.css";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineCopy } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";
import { FiTwitter } from "react-icons/fi";
import { Link } from "react-router-dom";
import Review from "./Review";

const MyProfile = () => {
  return (
    <section className={classes.page}>
      <div className="container">
        <div className={classes.info}>
          <img className={classes.user} src={user} alt="" />
          <div className={classes.userData}>
            <div className={classes.top}>
              <h1 className={classes.name}>Mark</h1>
              <FiEdit2 />
            </div>
            <h1 className={classes.data}>Jakarta</h1>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.top}>
            <h1>Links</h1>
            <FiEdit2 />
          </div>
          <ul className={classes.listSocial}>
            <li>
              <Link to="https://www.instagram.com/rezaheadline/?hl=en">
                <BsInstagram className={classes.iconSocial} />
              </Link>
            </li>
            <li>
              <Link to="https://www.instagram.com/rezaheadline/?hl=en">
                <FiTwitter className={classes.iconSocial} />
              </Link>
            </li>
          </ul>
        </div>
        <div className={classes.submit}>Make an offer</div>
        <div className={classes.card}>
          <div className={classes.top}>
            <h1>URL</h1>
            <FiEdit2 />
          </div>
          <div className={classes.linkTitle}>my link</div>
          <div className={classes.link}>
            <span>www.donia.com/rezaheadline</span>
            <AiOutlineCopy />
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.top}>
            <h1>Filter Client</h1>
            <FiEdit2 />
          </div>
          <ul className={classes.listFilter}>
            <li>
              Location : <span>jakarta</span>
            </li>
            <li>
              Payment method : <span>Go pay</span>
            </li>
            <li>
              Minimum Budget : <span>1000000 RP</span>
            </li>
            <li>
              History : <span>3 jobs</span>
            </li>
          </ul>
        </div>
        <div className={classes.card}>
          <div className={classes.top}>
            <h1>Reviews</h1>
            <Link>See all</Link>
          </div>
          <ul className={classes.listReviews}>
            <li>
              <Review />
              <Review />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
