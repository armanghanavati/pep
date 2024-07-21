import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RsetShowToast } from "../../../redux/reducers/main/main-slice";
import { Toast } from "devextreme-react/toast";

const Toastify = ({ size = "lg" }) => {
  const { main } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <>
      <Row className="d-flex toastContainer">
        <Col xs="10" sm="10" xl="12" className="d-flex">
          <Toast
            // direction="up-push"
            // position="top-center"
            visible={main?.showToast?.isToastVisible}
            message={main?.showToast?.Message}
            type={main?.showToast?.Type === "Success" ? "success" : "error"}
            onHiding={() => dispatch(RsetShowToast({ isToastVisible: false }))}
            displayTime={10000}
            width={size}
            rtlEnabled={true}
          />
        </Col>
      </Row>
    </>
  );
};

export default Toastify;
