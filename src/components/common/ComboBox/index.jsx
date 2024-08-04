import * as React from "react";
import TagBox from "devextreme-react/tag-box";
import SelectBox from "devextreme-react/select-box";
import { Col, Label } from "reactstrap";
import Validations from "../../../utiliy/validations";

export default function ComboBox({
  xs = 12,
  md = 4,
  xl = 4,
  name,
  placeholder = "انتخاب کنید ...",
  className,
  disabled,
  options = [],
  label = "",
  value,
  onChange,
  error,
  multi,
  valueExpr = "id",
  displayExpr = "label",
  index = "",
}) {
  const handleChange = (value) => {
    console.log("index index index index index", value, name);
    onChange(name, value, Validations || undefined, index);
  };

  return (
    <Col xs={xs} md={md} xl={xl} className={`${className} my-2`}>
      <Label>{label}</Label>
      {multi ? (
        <TagBox
          disabled={disabled}
          value={value}
          dataSource={options}
          searchEnabled
          displayExpr={displayExpr}
          valueExpr={valueExpr}
          placeholder={placeholder}
          name={name}
          rtlEnabled={true}
          onValueChange={onChange}
          className={`${error && "border border-danger"} `}
        />
      ) : (
        <SelectBox
          // labelMode=""
          // onValueChanged={}
          disabled={disabled}
          valueExpr={valueExpr}
          displayExpr={displayExpr}
          dataSource={options}
          searchEnabled
          placeholder={placeholder}
          name={name}
          value={value}
          onValueChange={onChange}
          rtlEnabled={true}
          className="fontStyle"
        />
      )}
      <span className="">
        {error &&
          error.map((err, index) => (
            <span key={`${name}-errors-${index}`} className="text-danger">
              {err}
            </span>
          ))}
      </span>
    </Col>
  );
}
