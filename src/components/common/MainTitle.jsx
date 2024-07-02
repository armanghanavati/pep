import React from "react";
import { Col } from "reactstrap";
import "../../assets/CSS/main_title.css"

const MainTitle = ({ label }) => {
  return (
    <div className="d-flex m-2 p-3">
      <span className="font20 rounded-1 fw-bold border-double-bottom p-3">
        {label}
        {/* <h3 className="h1"></h3> */}
      </span>
    </div>
  );
};

export default MainTitle;
