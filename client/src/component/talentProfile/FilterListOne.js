import classes from "./FilterListOne.module.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { updateFileData, URL } from "../utils/queryFunctions";

const FilterListOne = (props) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  console.log(token);
  const postData = (data) => {
    return updateFileData(`${URL}/api/v1/users/updateMe`, data, token);
  };
  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      queryClient.setQueryData("myProfil", (oldData) => {
        return {
          ...data,
        };
      });
      props.onClick();
    },
  });

  const deleteFilterHandler = () => {
    let filterSendArray = [...user.filterValues];
    const IndexSameFilter = filterSendArray.findIndex(
      (el) => Object.keys(el)[0] === props.name
    );

    filterSendArray.splice(IndexSameFilter, 1);

    const filterSend = {
      filterValues: [...filterSendArray],
    };
    mutate(filterSend);
  };
  return (
    <div className={classes.oneFilter}>
      <div className={classes.oneFilterLeft}>
        <span className={classes.nameFilter}>{props.name}</span>
        <p className={classes.valueFilter}>{props.value}</p>
      </div>
      <div>
        <DeleteOutlineOutlinedIcon
          className={classes.iconDelete}
          onClick={deleteFilterHandler}
        />
      </div>
    </div>
  );
};

export default FilterListOne;
