import * as React from "react";
import TagBox from "devextreme-react/tag-box";
import SelectBox from "devextreme-react/select-box";
import { Col, Label } from "reactstrap";

export default function ComboBox({
  xs = 12,
  md = 4,
  xl = 4,
  style,
  name,
  placeholder = "انتخاب کنید ...",
  className,
  disabled,
  validations,
  options = [],
  label = "",
  value,
  onChange,
  error,
  multi,
  valueExpr = "id",
  displayExpr = "label",
  index = "",
  showClearButton = true,
  validation,
}) {
  const handleChange = (value) => {
    onChange(name, value, validation || undefined, index);
  };

  return (
    <Col xs={xs} md={md} xl={xl} className={`${className} my-2`}>
      <Label>{label}</Label>
      {multi ? (
        <TagBox
          style={style}
          disabled={disabled}
          value={value}
          dataSource={options}
          searchEnabled
          displayExpr={displayExpr}
          valueExpr={valueExpr}
          placeholder={placeholder}
          name={name}
          rtlEnabled={true}
          onValueChange={handleChange}
        />
      ) : (
        <SelectBox
          // labelMode=""
          // onValueChanged={}
          showClearButton={showClearButton}
          disabled={disabled}
          valueExpr={valueExpr}
          displayExpr={displayExpr}
          dataSource={options}
          searchEnabled
          placeholder={placeholder}
          name={name}
          value={value}
          onValueChange={handleChange}
          rtlEnabled={true}
        />
      )}
      <span className="">
        {error &&
          error.map((err, index) => (
            <span key={`${name}-errors-${index}`} className="font12 text-danger">
              {err}
            </span>
          ))}
      </span>
    </Col>
  );
}
