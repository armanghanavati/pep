import TextBox from "devextreme-react/text-box";
import { Col, Label } from "reactstrap";

const Input = ({
  value = "",
  errors,
  name = "",
  onClick = () => {},
  onChange = () => {},
  required = false,
  error,
  label,
  type = "text",
  maxLength,
  placeholder,
  labelWidth = "300px",
  validations,
  index,
  readOnly,
  isCurrency = false,
  className = undefined,
  borderRadius,
  onBlur = () => {},
  titleFontSize,
  TooltipTitle = null,
  minWidth,
  maxWidth,
  height,
  centerText = false,
  align = "center",
  xxl = 3,
  xl = 3,
  lg = 4,
  md = 6,
  sm = 12,
  xs = 12,
}) => {
  const handleChange = (event) => {
    // event?.preventDefault();
    const { value } = event.event.target;
    if (
      String(value).trim()?.length == 0 ||
      value == "" ||
      value === undefined ||
      value == null
    ) {
      onChange(name, undefined, validations, index);
    } else {
      onChange(name, value, validations, index);
    }
    // if (!!className && (error?.length === 0 || !!!error)) {
    //   setNewClassName("orange");
    // }
  };

  const handleChangeForCurrencyFormat = (value) => {
    if (value == 0) {
      onChange(name, 0, validations, index);
    } else if (
      String(value).trim()?.length == 0 ||
      value == "" ||
      value === undefined ||
      value == null
    ) {
      onChange(name, undefined, validations, index);
    } else {
      onChange(name, value, validations, index);
    }
  };

  const formatNumberInput = (e) => {
    let checkIfNum;
    let checkDot;
    // if (e.key !== undefined) {
    //   checkIfNum = e.key === "Enter" || e.key === "e" || e.key === "+" || e.key === "-" || e.keyCode === 69 ||
    //     (maxLength !== undefined &&
    //       type === "number" &&
    //       JSON.stringify(value)?.length - 2 === Number(maxLength) &&
    //       e.key !== "Backspace");
    //   // checkDot = e.key === "."
    // }
    if (e.key === ".") {
      const test = e.target.value;
      const getDot = test.split(".");
      console.log(test);
      // e.preventDefault()
    }
    // return checkDot && e.preventDefault()
  };
  const formatInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  let direction = false;
  const handelValue = (value) => {
    const tempDirection = /\s*[a-zA-Z0-9!@#\$%\^\&*/\)\(+=._-]\s*$/?.test(
      value
    );
    direction = tempDirection;
    return value;
  };

  return (
    <>
      <Col
        className={`${className} "my-2"`}
        xxl={xxl}
        xl={xl}
        lg={lg}
        md={md}
        sm={sm}
        xs={xs}
      >
        <Label> {label} </Label>
        <TextBox
          className={`${error?.[name] && "border border-danger"}`}
          rtlEnabled
          id={name}
          placeholder={placeholder}
          name={name}
          maxLength={maxLength}
          pattern={
            maxLength !== undefined && type === "number"
              ? // ? "/^-?d+.?d*$/"
                /[^0-9]/g
              : // "/^-?d+.?d*$/"
                undefined
          }
          value={value}
          // value={handelValue(value)}
          // title={value}
          // type={(maxLength && type === 'number') ? 'text' : type}
          // type={passwordShown ? "text" : type}
          style={{
            textAlign: centerText
              ? align
              : type === "number" || isCurrency || direction
              ? "left"
              : "right",
            direction:
              type === "number" || isCurrency || direction ? "ltr" : "rtl",
            height: height ? height : "",
          }}
          onChange={handleChange}
          readOnly={readOnly}
          onKeyDown={type === "number" ? formatNumberInput : formatInput}
        />
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
    </>
  );
};
export default Input;
