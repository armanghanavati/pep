import React from "react";
import { Button, LoadIndicator } from "devextreme-react";
import { Col } from "reactstrap";
import "../../../assets/CSS/button_style.css";

const index = ({
  style,
  type = "default",
  className = "bg-danger",
  label,
  icon,
  xs = 12,
  md = 2,
  xl = 5,
  stylingMode = "Contained",
  onClick,
  text = "Contained",
  loading = false,
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
      {loading ? (
        <LoadIndicator
          className="button-indicator"
          height={20}
          width={20}
          style={{ color: "red" }}
          visible={true}
        />
      ) : (
        <>
          <span>{icon}</span>
          {label}
        </>
      )}
    </Button>
    // </Col>
  );
};

export default index;
