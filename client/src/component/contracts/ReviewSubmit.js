import classes from "./ReviewSubmit.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import RateEdit from "../rating/RateEdit";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { postDataProtect, URL } from "../utils/queryFunctions";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

const ReviewSubmit = (props) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [rateValue, setRateValue] = useState(0);
  const token = useSelector((state) => state.auth.token);
  const rateValueHandler = (value) => {
    setRateValue(value);
    console.log(value);
  };

  const postData = (data) => {
    return postDataProtect(
      `${URL}/api/v1/contracts/re/${params.contractId}`,
      data,
      token
    );
  };

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      console.log(data.data.data.newReview);
      queryClient.setQueryData("oneContract", (oldData) => {
        const contract = oldData.data.data.contract;
        console.log(oldData);
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: {
              ...oldData.data.data,
              contract: {
                ...contract,
                [props.client ? "reviewCs" : "reviewFs"]: [
                  data.data.data.newReview,
                ],
              },
            },
          },
        };
      });

      props.onClick();
    },
  });

  const onsubmit = (data) => {
    const [rateValue, comment] = getValues(["rateValue", "comment"]);
    console.log(rateValue, comment, params.contractId);
    mutate({ rating: rateValue, review: comment });
  };
  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}></h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      <h3 className={classes.subTitle}>Leave a review</h3>
      <form className={classes.form} onSubmit={handleSubmit(onsubmit)}>
        <div className={classes.rateCon}>
          <Controller
            name="rateValue"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <RateEdit onRate={field.onChange} value={field.value} />
            )}
          />
          {errors.email?.type === "required" && (
            <p className={classes.error}>please enter your email address</p>
          )}
        </div>
        <p className={classes.textAreaTitle}>
          If you want add acomment (optional)
        </p>
        <textarea
          className={classes.textArea}
          {...register("comment")}
        ></textarea>
        <button className={classes.button}>Submit</button>
      </form>
    </div>
  );
};

export default ReviewSubmit;
