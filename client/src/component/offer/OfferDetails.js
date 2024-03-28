import classes from "./OfferDetails.module.css";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { postDataProtect, URL } from "../utils/queryFunctions";
import { useMutation } from "react-query";

const OfferDetails = () => {
  const params = useParams();
  const token = useSelector((state) => state.auth.token);

  const postData = (data) => {
    return postDataProtect(
      `${URL}/api/v1/contracts/checkout-session/${params.username}`,
      data,
      token
    );
  };
  const { mutate, isError, error, isLoading } = useMutation(postData, {
    onSuccess: (data) => {
      console.log(data.data.session.url);
      window.location.href = data.data.session.url;
    },
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const onsubmit = async (data) => {
    const [name, task, budget, deadline] = getValues([
      "name",
      "task",
      "budget",
      "deadline",
    ]);
    console.log(params.userId, name, task, budget, deadline);
    mutate({
      name,
      task,
      budget,
      deadline,
    });
  };

  return (
    <div className={classes.main}>
      <div className={classes.boxCaution}>
        <p className={classes.caution}>
          <span className={classes.cautionTitle}>Caution:</span> To know the
          general rules of the contract between the client and the talent you
          can click <span className={classes.cautionLink}>here</span>
        </p>
      </div>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className={classes.box}>
          <h5 className={classes.subTitle}>Contract name</h5>
          <input
            className={classes.input}
            id="name"
            {...register("name", { required: true })}
          />
          {errors.name?.type === "required" && (
            <p className={classes.error}>please enter your contract name</p>
          )}
        </div>
        <div className={classes.box}>
          <h5 className={classes.subTitle}>Contract description</h5>
          <textarea
            id="task"
            className={classes.inputText}
            placeholder="Describe what you need here.."
            {...register("task", { required: true })}
          ></textarea>
          {errors.task?.type === "required" && (
            <p className={classes.error}>
              please enter your contract description
            </p>
          )}
        </div>
        <div className={classes.box}>
          <h5 className={classes.subTitle}>When will be the deadline ?</h5>
          <input
            type="date"
            id="deadline"
            className={classes.input}
            {...register("deadline", { required: true })}
          />
          <p className={classes.dateWarning}>( minimum 72hours )</p>
          {errors.deadline?.type === "required" && (
            <p className={classes.error}>please enter your deadline date</p>
          )}
        </div>
        <div className={classes.box}>
          <h5 className={classes.subTitle}>What is your budget?</h5>
          <input
            type="number"
            id="price"
            className={classes.input}
            {...register("budget", { required: true })}
          />
          {errors.budget?.type === "required" && (
            <p className={classes.error}>please enter your budget</p>
          )}
        </div>
        <button className={classes.submit}>submit your offer</button>
      </form>
    </div>
  );
};

export default OfferDetails;
