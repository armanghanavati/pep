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
            visible={main?.showToast?.isToastVisible}
            message={main?.showToast?.Message}
            type={
              main?.showToast?.Type?.toLowerCase() === "success"
                ? "success"
                : main?.showToast?.Type?.toLowerCase() === "unsuccess"
                ? "error"
                : main?.showToast?.Type?.toLowerCase() === "exception"
                ? "warning"
                : ""
            }
            onHiding={() => dispatch(RsetShowToast({ isToastVisible: false }))}
            displayTime={10000}
            animation={{
              show: { type: "fade", duration: 500 },
              hide: { type: "fade", duration: 500 },
            }}
            width={size}
            rtlEnabled={true}
          />
        </Col>
      </Row>
    </>
  );
};

export default Toastify;
