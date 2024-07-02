import React from "react";
import { Button, LoadIndicator } from "devextreme-react";
import { Col } from "reactstrap";

const index = ({
  style,
  type = "default",
  className = "bg-danger",
  label,
  icon,
  xs = 12,
  md = 2,
  xl = 5,
  stylingMode = "contained",
  onClick,
  text = "Contained",
}) => {
  return (
    // <Col xs={xs} md={md} xl={xl}>
    <Button
      width={120}
      text={text}
      type={type}
      stylingMode={stylingMode}
      onClick={onClick}
      style={style}
    >
      {/* {true ? ( */}
      {/* <LoadIndicator
        className="button-indicator"
        height={20}
        width={20}
        style={{ backgroundColor: "white", color: "red" }}
        visible={true}
      /> */}
      {/* ) : ( */}
      <>
        <span>{icon}</span>
        {label}
      </>
      {/* )} */}
    </Button>
    // </Col>
  );
};

export default index;
