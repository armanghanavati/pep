import React from "react";
import { Button, LoadIndicator } from "devextreme-react";
import { Col } from "reactstrap";
import "../../../assets/CSS/button_style.css";

const index = ({
  style,
  disabled = false,
  type = "",
  className = "",
  label,
  icon,
  xs = 12,
  md = 2,
  xl = 5,
  stylingMode = "",
  onClick,
  text = "",
  loading = false,
}) => {
  return (
    // <Col xs={xs} md={md} xl={xl}>
    <Button
      className={className}
      width={120}
      text={text}
      disabled={disabled}
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
