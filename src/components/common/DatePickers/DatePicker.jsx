import React, { FormEvent, useEffect, useRef, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import { Button, Col, Form, Row } from "react-bootstrap";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/green.css";
import Validation from "../../../utiliy/validations";
import { Label } from "reactstrap";

const index = ({
  xs = 12,
  md = 3,
  xl = 3,
  xxl = 4,
  name = "",
  disabled = false,
  format,
  onlyMonthPicker,
  className,
  label,
  value,
  onChange = () => {},
  persianType = "per",
  minDate,
  maxDate,
  important,
  errors,
  range,
  placeholder
}) => {
  const weekDays = [
    ["شنبه", "ش"],
    ["یکشنبه", "ی"],
    ["دوشنبه", "د"],
    ["سه شنبه", "س"],
    ["چهارشنبه", "چ"],
    ["پنجشنبه", "پ"],
    ["جمعه", "ج"],
  ];

  // const isSmallScreen = useMediaQuery({ query: "(max-width: 750px)" });
  // const handleChange = (value) => {
  //   console.log("index index index index index", value, name);
  //   onChange(name, value || undefined, index);
  // };

  return (
    <Col className="my-2" xxl={xxl} xs={xs} md={md} xl={xl}>
      <Label> {label} </Label>
      <DatePicker
        format={format}
        onlyMonthPicker={onlyMonthPicker}
        weekDays={weekDays}
        className={className}
        placeholder={placeholder}
        // className={`${isSmallScreen && "rmdp-mobile"} ${className} `}
        editable={false}
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        range={range}
        monthYearSeparator={" "}
        inputClass={`form-control ${errors?.[name] && "border border-danger"}`}
        calendar={persianType === "per" ? persian : undefined}
        locale={persianType === "per" ? persian_fa : undefined}
      ></DatePicker>
      {errors?.[name] && (
        <span className="text-danger font12"> {errors?.[name]?.message} </span>
      )}
    </Col>
  );
};

export default index;
