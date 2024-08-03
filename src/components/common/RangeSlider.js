import React from "react";
import { Slider } from "@mui/material";
import { Col, Label } from "reactstrap";
import { Gfn_FormatNumber } from "../../utiliy/GlobalMethods";

const RangeSlider = ({
  xs = 11,
  xxl = 11,
  xl = 11,
  lg = 11,
  md = 11,
  label,
  min,
  max,
  onChange,
  value,
  isCurrency,
  isWeight,
  isPercent,
}) => {
  function labelFormatCurrency(value) {
    return ` ${Gfn_FormatNumber(value)} تومان`;
  }

  function labelFormatPercent(value) {
    return `% ${value}`;
  }

  function labelFormatWeight(value) {
    return `kg ${Gfn_FormatNumber(value)}`;
  }

  function labelFormatNormal(value) {
    return Gfn_FormatNumber(value);
  }

  // function spanLabel() {
  //   switch (labelType) {
  //     case "isWeight":
  //       break;

  //     default:
  //       break;
  //   }
  // }

  return (
    <>
      <Col className=" ms-2 my-2 ">
        <label className="mb-2"> {label} </label>
        <div className="border rounded-3 p-2">
          <div className="d-flex justify-content-center">
            <Col className="d-flex" lg={lg} md={md} xs={xs} xl={xl} xxl={xxl}>
              <Slider
                // shiftStep={30}
                step={isCurrency && 1000}
                className=""
                valueLabelDisplay="auto"
                onChange={onChange}
                value={value}
                valueLabelFormat={
                  isCurrency
                    ? labelFormatCurrency
                    : isWeight
                    ? labelFormatWeight
                    : isPercent
                    ? labelFormatPercent
                    : labelFormatNormal
                }
                min={min}
                max={max}
              />
            </Col>
          </div>
          <div className="d-flex justify-content-between">
            <span className="">
              {isCurrency
                ? Gfn_FormatNumber(value[1]) + " " + "تومان"
                : isWeight
                ? Gfn_FormatNumber(value[1]) + " " + "kg"
                : isPercent
                ? `${Gfn_FormatNumber(value[1])}%`
                : Gfn_FormatNumber(value[1])}
            </span>
            <span className="">
              {isCurrency
                ? Gfn_FormatNumber(value[0]) + " " + "تومان"
                : isWeight
                ? Gfn_FormatNumber(value[0]) + " " + "kg"
                : isPercent
                ? `${Gfn_FormatNumber(value[0])}%`
                : Gfn_FormatNumber(value[0])}
            </span>
          </div>
        </div>
      </Col>
    </>
  );
};

export default RangeSlider;
