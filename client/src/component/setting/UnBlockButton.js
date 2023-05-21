import classes from "./BlockedList.module.css";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "react-query";
import { useSelector } from "react-redux";
import { deleteDataProtect, URL } from "../utils/queryFunctions";
import { useDispatch } from "react-redux";
import { blocklistActions } from "../../store/blocklist";
const UnBlockButton = (props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const unBlock = (data) => {
    return deleteDataProtect(`${URL}/api/v1/block/${props.id}`, data, token);
  };

  const { mutate, isError, error } = useMutation(unBlock, {
    onSuccess: (data) => {
      queryClient.setQueryData("blockList", (oldData) => {
        return {
          ...data,
        };
      });
      dispatch(blocklistActions.toggle({ user: props.id, photo: props.photo }));
    },
  });

  const unBlockHandler = () => {
    mutate();
  };
  return (
    <p className={classes.block} onClick={unBlockHandler}>
      unblock
    </p>
  );
};

export default UnBlockButton;
