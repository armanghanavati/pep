import React, { FormEvent, useEffect, useRef, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import { Col, Form, Row } from "react-bootstrap";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/green.css";
import Validation from "../../../utiliy/validations";
import { Label } from "reactstrap";
import Button from "../Buttons/Button";

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
  error,
  range,
  placeholder,
  validations,
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

  return (
    <Col className={`${className} my-2`} xxl={xxl} xs={xs} md={md} xl={xl}>
      <Label> {label} </Label>
      <DatePicker
        // format={format}
        // onlyMonthPicker={onlyMonthPicker}
        placeholder={placeholder}
        // className={`${isSmallScreen && "rmdp-mobile"} ${className} `}
        // editable={false}
        range={range}
        // weekDays={weekDays}
        // editable={false}
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        monthYearSeparator={" "}
        inputClass={`form-control 
            ${errors?.[name] && "border border-danger"} `}
        calendar={persianType === "per" ? persian : undefined}
        locale={persianType === "per" ? persian_fa : undefined}
      >
        <Button
          className="mb-2"
          style={{ margin: "5px" }}
          onClick={() => onChange(null)}
          label="لغو انتخاب"
        />
      </DatePicker>
      <span className="flex-order-column">
        {error &&
          error.map((err, index) => (
            <span
              key={`${name}-errors-${index}`}
              className="text-danger font12"
            >
              {err}
            </span>
          ))}
      </span>
    </Col>
  );
};

export default index;
