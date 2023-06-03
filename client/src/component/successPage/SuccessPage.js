import { Link } from "react-router-dom";
import classes from "./SuccessPage.module.css";
import CheckIcon from "@mui/icons-material/Check";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { postDataProtect, URL } from "../utils/queryFunctions";
const SuccessPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [task, setTask] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  const postData = (data) => {
    return postDataProtect(`${URL}/api/v1/contracts/${username}`, data, token);
  };

  const { mutate } = useMutation(postData, {
    onSuccess: (data) => {},
  });

  useEffect(() => {
    setUsername(searchParams.get("username"));
    setName(searchParams.get("name"));
    setTask(searchParams.get("task"));
    setBudget(searchParams.get("budget"));
    setDeadline(searchParams.get("deadline"));
    if (!username || !name || !task || !budget) {
      return;
    }
    mutate({ name, task, budget, deadline });
  }, [token]);

  return (
    <div className={classes.main}>
      <div className={classes.cardCon}>
        <div className={classes.card}>
          <div className={classes.iconCon}>
            <CheckIcon sx={{ fontSize: 50 }} />
          </div>
          <p className={classes.text}>you successfully startd your contract</p>
          <p className={classes.linkText}>
            click <Link to="/">here</Link> to go back to the home page
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
