import React from "react";
import { Col } from "reactstrap";
import "../../../assets/CSS/main_tiltle.css"

const MainTitle = ({ label }) => {
  return (
    <div className="d-flex mb-2 mx-1 pb-3">
      <span className="font15 rounded-1 fw-bold border-solid-bottom px-3 py-2">
        {label}
        {/* <h3 className="h1"></h3> */}
      </span>
    </div>
  );
};

export default MainTitle;
