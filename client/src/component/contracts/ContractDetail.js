import React from "react";
import classes from "./ContractDetail.module.css";
import { useForm } from "react-hook-form";

const ContractDetail = (props) => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const onsubmit = async (data) => {
    const [name, description, budget, deadline] = getValues([
      "name",
      "description",
      "budget",
      "deadline",
    ]);
    props.onData({ name, description, budget, deadline });
  };

  return (
    <React.Fragment>
      <div className={classes.formCon}>
        <p>
          * your offer will be cancelled if the talent doesn't react to your
          offer after 72 hours
        </p>
        <form className={classes.form} onSubmit={handleSubmit(onsubmit)}>
          <div className={classes.inputCon}>
            <input
              type="text"
              id="name"
              className={classes.input}
              placeholder="Choose a name for your contract.."
              {...register("name", { required: true })}
            />
            {errors.name?.type === "required" && (
              <p className={classes.error}>please enter your contract name</p>
            )}
          </div>
          <div className={classes.inputCon}>
            <label htmlFor="textArea" className={classes.inputName}>
              Description
            </label>
            <textarea
              id="textArea"
              className={classes.inputText}
              placeholder="Describe what you need here.."
              {...register("description", { required: true })}
            ></textarea>
            {errors.description?.type === "required" && (
              <p className={classes.error}>
                please enter your contract description
              </p>
            )}
          </div>
          <div className={classes.inputCon}>
            <input
              type="number"
              id="price"
              className={classes.input}
              placeholder="Write your budget here.."
              {...register("budget", { required: true })}
            />
            {errors.budget?.type === "required" && (
              <p className={classes.error}>please enter your budget</p>
            )}
          </div>
          <div className={classes.inputCon}>
            <input
              type="date"
              id="deadline"
              className={classes.input}
              {...register("deadline", { required: true })}
            />
            {errors.name?.type === "required" && (
              <p className={classes.error}>please enter your deadline date</p>
            )}
          </div>
          <button className={classes.button} onClick={props.onContinue}>
            Continue
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default ContractDetail;
