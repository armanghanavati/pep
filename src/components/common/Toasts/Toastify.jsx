import React from "react";
import { Col, Row, Toast } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RsetShowToast } from "../../../redux/reducers/main/main-slice";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Toastify = () => {
  const { main } = useSelector((state) => state);
  const dispatch = useDispatch();

  const oparationIcons = () => {
    if (main?.showToast?.Type === "Unsuccess") {
      return (
        <ErrorIcon className="font20 text-danger bi bi-exclamation-triangle-fill" />
      );
    }
    if (main?.showToast?.Type === "Success") {
      return (
        <CheckCircleIcon className="font20 text-success bi bi-check-circle-fill" />
      );
    }
  };

  return (
    <>
      <Row className="d-flex toastContainer">
        <Col xs="10" sm="10" xl="12" className="d-flex">
          <Toast
            bg={main?.showToast?.Type}
            onClose={() => dispatch(RsetShowToast({ isToastVisible: false }))}
            show={main?.showToast?.isToastVisible}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="justify-content-center me-auto">
                {oparationIcons()}
              </strong>
            </Toast.Header>
            <Toast.Body
              className={`d-flex py-4 text-white justify-content-end text-end ${
                main?.showToast?.Type == "Success"
                  ? "bg-success"
                  : main?.showToast?.Type == "Unsuccess"
                  ? "bg-danger"
                  : null
              }`}
            >
              {main?.showToast?.Message}
            </Toast.Body>
          </Toast>
        </Col>
      </Row>
    </>
  );
};

export default Toastify;
