import FormRange from "react-bootstrap/FormRange";
import React, { ChangeEvent, useState } from "react";
import { Col, Form } from "react-bootstrap";

const SwitchCase = ({
  range,
  normal = true,
  label,
  name,
  checked,
  onChecked,
  className,
  control,
  onChange,
  value,
  radioType = false,
  min,
  max,
  checkLabel,
  switcher,
  trueLabel,
  falseLabel,
  validations,
  index,
}) => {
  const handleChange = (e) => {

    console.log(name, value, validations, index, checked, e);
    onChange(name, value, validations, index);
  };

  return (
    <>
      {switcher ? (
        <>
          <label htmlFor={name} className="align-items-center mx-2 d-flex ">
            <Form.Check
              className="my-2"
              type="switch"
              label={trueLabel}
              name={name}
              checked={checked}
              min={min}
              max={max}
              value={value}
              onChange={onChange}
            />
            <span className="d-flex align-items-center mx-2">{falseLabel}</span>
          </label>
        </>
      ) : radioType ? (
        <Col className=" d-flex align-items-end">
          <label className="">{label} </label>
          <Form.Check
            type="radio"
            aria-label="radio 1"
            checked={checked}
            onChange={onChecked}
          />
        </Col>
      ) : control ? (
        <Col className=" d-flex align-items-end">
          <Form.Check
            className={`d-flex justify-content-center mb-1 cursorPointer ${className}`}
            color="#00000"
            width={400}
            id={name}
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label htmlFor={name} className="px-2">
            {label}
          </label>
        </Col>
      ) : (
        <Form.Check
          checked={checked}
          value={value}
          onChange={onChange}
          className={className}
          inline
          label={label}
          name="group1"
          type="checkbox"
        />
      )}
    </>
  );
};

export default SwitchCase;
