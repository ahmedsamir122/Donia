import classes from "./CreateContract.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useForm } from "react-hook-form";

const CreateContract = (props) => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const onsubmit = async (data) => {
    const [name, descripton, budget] = getValues([
      "name",
      "descripton",
      "budget",
    ]);
  };

  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}>Open aContract</h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      <div className={classes.formCon}>
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
          <div className={classes.paymentCon}>
            <h3 className={classes.paymentTitle}>Payment method</h3>
            <div className={classes.paymentInput}>
              <p>BCA virtual</p>
              <div className={classes.arrowRight}>
                <KeyboardArrowRightIcon />
              </div>
            </div>
          </div>
          <button className={classes.button}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateContract;
