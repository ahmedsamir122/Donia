import classes from "./ContractsTableHtml.module.css";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { postDataProtect, URL } from "../utils/queryFunctions";
import { useSelector } from "react-redux";

const ContractsTableHtml = (props) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const postData = (data, id) => {
    return postDataProtect(
      `${URL}/api/v1/conversations/${data.id}`,
      data,
      token
    );
  };

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      console.log(data);
      navigate(`/messages/${data.data.data.conversation._id}`);
    },
  });
  const chatHandler = (id) => {
    mutate({ id });
  };

  console.log(props.onData);
  return (
    <div>
      <table className={classes.table}>
        <thead>
          <tr className={classes.headRow}>
            <th className={`${classes.headCell} ${classes.nameHead}`}>name</th>
            <th className={`${classes.headCell}`}>status</th>
            <th className={`${classes.headCell}`}>date</th>
            <th className={`${classes.headCell}`}>client</th>
            <th className={`${classes.headCell}`}>chat</th>
          </tr>
        </thead>
        <tbody>
          {props.onData.map((con) => (
            <tr>
              <td className={`${classes.bodyCell} ${classes.nameBody}`}>
                {
                  <Link
                    className={classes.contractName}
                    to={`/contracts/${con._id}`}
                  >
                    {con.name}
                  </Link>
                }
              </td>
              <td className={`${classes.bodyCell} ${classes.statusBody}`}>
                {con.activity}
              </td>
              <td className={`${classes.bodyCell} ${classes.dateBody}`}>
                {dateFormat(con.createdAt, " mmmm dS, yyyy")}
              </td>
              <td className={`${classes.bodyCell} ${classes.withBody}`}>
                <Link
                  to={
                    props.client
                      ? `/${con.freelancer.username}`
                      : `/u/${con.client.username}`
                  }
                  className={classes.contractName}
                >
                  {props.client ? con.freelancer.username : con.client.username}
                </Link>
              </td>
              <td className={`${classes.bodyCell} `}>
                <div
                  className={`${classes.chatBody}`}
                  onClick={() => chatHandler(con.id)}
                >
                  <div
                    className={`${classes.chatPoint} ${
                      con.activity === "active" && classes.active
                    }`}
                  ></div>
                  <p className={classes.chat}>Chat</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsTableHtml;
