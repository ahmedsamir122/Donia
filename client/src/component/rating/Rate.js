import * as React from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";

export default function HalfRating(props) {
  const [rate, setRate] = useState(props.value);
  useEffect(() => {
    setRate(props.value);
  }, [props.value]);
  return (
    <Stack spacing={1}>
      <Rating
        name="half-rating-read"
        value={rate}
        precision={0.5}
        size="small"
        readOnly
      />
    </Stack>
  );
}
