import TextBox from "devextreme-react/text-box";
import { Col, Label } from "reactstrap";

const Input = ({
  value = "",
  name = "",
  onChange = () => {},
  error,
  label,
  type = "text",
  maxLength,
  placeholder,
  validations,
  index,
  readOnly,
  isCurrency = false,
  className = undefined,
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
      let inputValue;
      inputValue = value;
      // inputValue = value.replace(/[^\d.0-9]/g, "");
      // inputValue = inputValue.replace(/\.{2,}/g, ".");ّ
      if (type === "number" && isCurrency) {
        const dot = inputValue.split(".");
        dot[0] = dot[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        inputValue = dot.join(".");
      }
      if (type === "number") {
        inputValue = inputValue.replace(/[^\d.0-9]/g, "");
      }
      onChange(name, inputValue, validations, index);
    }
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
          value={value}
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
          onInput={handleChange}
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

// pattern={
//   maxLength !== undefined && type === "number"
//     ? // ? "/^-?d+.?d*$/"
//       /[^0-9]/g
//     : // "/^-?d+.?d*$/"
//       undefined
// }
// value={handelValue(value)}
// title={value}
// type={(maxLength && type === 'number') ? 'text' : type}
// type={passwordShown ? "text" : type}

// const handleChange = (e, field) => {
//   let inputValue;
//   inputValue = e.target.value.replace(/[^\d.0-9]/g, "");
//   inputValue = inputValue.replace(/\.{2,}/g, ".");
//   let part = inputValue.split(".");
//   if (currency) {
//     const dot = inputValue.split(".");
//     dot[0] = dot[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     inputValue = dot.join(".");
//   }
//   field.onChange(inputValue);
// };

// switch (field.name) {
//   case "creditPrice":
//   case "itemValueIncreasedTaxPrice":
//   case "equivalentWithRial":
//   case "article17TaxPrice":
//   case "otherTaxPrice":
//   case "constructionFee":
//   case "sellerProfit":
//   case "commission":
//   case "otherLegalFundsPrice":
//     inputValue = parseFloat(inputValue || "0").toFixed(0);
//     break;
//   case "name":
//   case "lastName":
//     inputValue = e.target.value?.replace(/[^a-zA-Zآ-ی]/g, "");
//     break;
//   case "count":
//   case "unitPrice":
//     if (
//       part[0].length > 18 ||
//       (part[1] && part[0].length + part[1].length > 18)
//     ) {
//       part[0] = part[0].slice(0, 18);
//     }
//     if (part[1] && part[1].length > 8) {
//       part[1] = part[1].slice(0, 8);
//     }
//     inputValue = part.join(".");
//     break;
//   case "otherLegalFundsRate":
//   case "otherTaxRate":
//     let partRate = inputValue.split(".");
//     if (
//       partRate[0].length > 3 ||
//       (partRate[1] && partRate[0].length + partRate[1].length > 3)
//     ) {
//       partRate[0] = partRate[0].slice(0, 3);
//     }
//     if (partRate[1] && partRate[1].length > 2) {
//       partRate[1] = partRate[1].slice(0, 2);
//     }
//     inputValue = partRate.join(".");
//     break;
//   default:
//     break;
// }
