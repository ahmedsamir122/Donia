import classes from "./Footer.module.css";
import android from "../../img/android-store.png";
import apple from "../../img/android-store.png";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className={classes.main}>
      <div className="container">
        <div className={classes.top}>
          <div className={classes.logo} onClick={() => navigate("/")}>
            logo
          </div>
          <div className={classes.appImg}>
            <a href="https://www.google.com">
              <img className={classes.img} src={android} alt="" />
            </a>
            <a href="https://www.google.com">
              <img className={classes.img} src={apple} alt="" />
            </a>
          </div>
        </div>

        <div className={classes.bottom}>
          <div className={classes.bottomLeft}>STAY ON TOUCH WITH US</div>
          <div className={classes.bottomRight}>
            <a href="https://www.google.com" className={classes.oneSocial}>
              <FacebookOutlinedIcon className={classes.oneSocialIcon} />
            </a>
            <a href="https://www.google.com" className={classes.oneSocial}>
              <InstagramIcon className={classes.oneSocialIcon} />
            </a>
            <a href="https://www.google.com" className={classes.oneSocial}>
              <YouTubeIcon className={classes.oneSocialIcon} />
            </a>
            <a href="https://www.google.com" className={classes.oneSocial}>
              <WhatsAppIcon className={classes.oneSocialIcon} />
            </a>
          </div>
        </div>
        <div className={classes.middle}>
          © Copyright 2024. All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default Footer;
