import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import classes from "./LinkAccount.module.css";
import { useState } from "react";
const LinkAccount = (props) => {
  const [showCopied, setShowCopied] = useState(false);
  let text = "www.ahmed.com";
  return (
    <div className={classes.main}>
      <p className={classes.content}>{`localHost/${props.onData.username}`}</p>
      <div className={classes.iconCon}>
        <ContentCopyIcon
          className={classes.icon}
          onClick={() => {
            navigator.clipboard.writeText(text);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 3000);
          }}
        />
      </div>
      {showCopied && <p className={classes.copied}>Copied</p>}
    </div>
  );
};

export default LinkAccount;
