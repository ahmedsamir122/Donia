import classes from "./OfferDetails.module.css";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  postDataProtect,
  URL,
  MIDTRANS_CLIENT_KEY,
} from "../utils/queryFunctions";
import { useMutation } from "react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OfferDetails = (props) => {
  const params = useParams();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const postData = (data) => {
    return postDataProtect(
      `${URL}/api/v1/contracts/checkout-session/${params.username}`,
      data,
      token
    );
  };

  useEffect(() => {
    // You can also change below url value to any script url you wish to load,
    // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    // Optional: set script attribute, for example snap.js have data-client-key attribute
    // (change the value according to your client-key)
    const myMidtransClientKey = MIDTRANS_CLIENT_KEY;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);
  const { mutate, isError, error, isLoading } = useMutation(postData, {
    onSuccess: (data) => {
      console.log(data.data);
      window.snap.pay(data.data.tokenMidtrans, {
        // Function triggered when the user closes the modal without completing payment
        onClose: function () {
          // Redirect the user to a specific URL when they close the modal
          navigate(`/contracts/${data.data.contract._id}`);
        },
      });
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
    console.log(params.userId, name, task, budget, deadline, URL);
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
            {...register("deadline", {
              required: true,
              validate: (value) => {
                const selectedDate = new Date(value); // Convert the selected date string to a Date object
                const minimumDate = new Date(Date.now() + 48 * 60 * 60 * 1000); // Get the minimum date (current date + 48 hours)

                // Compare timestamps to check if the selected date is after the minimum date
                return selectedDate.getTime() > minimumDate.getTime();
              },
            })}
          />
          <p className={classes.dateWarning}>( minimum 48hours )</p>
          {errors.deadline?.type === "required" && (
            <p className={classes.error}>please enter your deadline date</p>
          )}
          {errors.deadline?.type === "validate" && (
            <p className={classes.error}>the deadline minimum is 48 hours </p>
          )}
          {isError && error?.response?.data?.message.includes("deadline") && (
            <p className={classes.error}>{error?.response.data.message}</p>
          )}
        </div>
        <div className={classes.box}>
          <h5 className={classes.subTitle}>What is your budget?</h5>
          <input
            type="number"
            id="price"
            className={classes.input}
            {...register("budget", { required: true })}
            onChange={(e) => props.onPrice(e.target.value)}
          />
          {errors.budget?.type === "required" && (
            <p className={classes.error}>please enter your budget</p>
          )}
          {isError && error?.response?.data?.message.includes("budget") && (
            <p className={classes.error}>{error?.response.data.message}</p>
          )}
        </div>
        <button className={classes.submit}>submit your offer</button>
      </form>
    </div>
  );
};

export default OfferDetails;
