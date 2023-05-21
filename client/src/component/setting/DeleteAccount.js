import classes from "./Delete.module.css";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteDataProtect, URL } from "../utils/queryFunctions";
import { useMutation } from "react-query";

const DeleteAccount = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const deleteMyProfile = (data) => {
    return deleteDataProtect(`${URL}/api/v1/users/updateMe`, data, token);
  };

  const { mutate, isError, error } = useMutation(deleteMyProfile, {
    onSuccess: (data) => {
      localStorage.removeItem("token");
      navigate("/");
    },
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
  });

  const onsubmit = async (data) => {
    console.log(data);
    const [password] = getValues(["password"]);
    mutate({ password });
  };

  return (
    <div className={classes.main}>
      <p className={classes.title}>Delete account</p>
      <h3 className={classes.subTitle}>We hate to see you go.</h3>
      <p className={classes.description}>
        Before you delete your account, we would want you to know that this
        action will delete your data across all Donia platforms. If that's what
        you want, please proceed with entering your password to confirm that
        it's you.
      </p>
      <p className={classes.email}>{user.email}</p>
      <form className={classes.form} onSubmit={handleSubmit(onsubmit)}>
        <input
          placeholder="password ..."
          className={classes.input}
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password?.type === "required" && (
          <p className={classes.error}>please enter your password</p>
        )}
        <button className={classes.button}>Continue</button>
      </form>
    </div>
  );
};

export default DeleteAccount;
