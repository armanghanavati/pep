import { Container, Modal, Form, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Button from "../Buttons/Button";
import { RsetQuestionModal } from "../../../redux/reducers/main/main-slice";

const QuestionModal = ({ title = "آیا از حذف آن اطمینان دارید؟" }) => {
  const dispatch = useDispatch();
  const { main } = useSelector((state) => state);

  return (
    <>
      <Modal
        centered
        show={main?.deleteModal?.show}
        onHide={() => dispatch(RsetQuestionModal({ value: false }))}
      >
        <Modal.Header
          style={{ transform: "scale(-1, 1)", direction: "ltr" }}
          className="d-flex bg-danger text-white  justify-content-center"
          closeButton
        >
          <span
            style={{ transform: "scale(-1, 1)" }}
            className="fw-bold"
          ></span>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center gap-1">
            <i className="font20 text-danger bi bi-exclamation-triangle-fill" />
            {title}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-success"
            title="لغو"
            onClick={() =>
              dispatch(
                RsetQuestionModal({
                  ...main?.quetsionoModal,
                  value: false,
                  answer: "no",
                })
              )
            }
          />
          <Button
            variant="danger"
            title="تایید"
            onClick={() =>
              dispatch(
                RsetQuestionModal({
                  ...main?.quetsionoModal,
                  value: false,
                  answer: "yes",
                })
              )
            }
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QuestionModal;
