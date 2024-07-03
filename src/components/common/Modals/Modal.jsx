import React from "react";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const index = ({
  classHeader = "bg-dev-blue text-white",
  hidden,
  children,
  isOpen,
  toggle,
  centered = true,
  label,
  onClose,
  footerButtons = [],
  size,
}) => {
  return (
    <Col>
      <Modal
        style={{ direction: "rtl" }}
        isOpen={isOpen}
        toggle={onClose}
        // hidden={hidden}
        className="fontStyle"
        centered={centered}
        size={size}
      >
        <ModalHeader className={classHeader} toggle={onClose}>
          {label}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footerButtons?.map((btn) => btn)}</ModalFooter>
      </Modal>
    </Col>
  );
};

export default index;
