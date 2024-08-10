import React, { useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";

const CopyLocation = ({}) => {
  const handleAcceptEditTable = () => {};
  const [showCopyModal, setShowCopyModal] = useState(false);

  return (
    <span>
      <Button
        // icon={<ContentCopyIcon className="ms-1 font18 fw-bold" />}
        onClick={() => setShowCopyModal(true)}
        className="fontStyle me-2 "
        label="کپی تنظیمات"
        type="success"
        // stylingMode="contained"
        rtlEnabled={true}
      />
      <Modal
        size="lg"
        label={"کپی تنظیمات"}
        classHeader="bg-white"
        isOpen={showCopyModal}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowCopyModal(false)}
            label="لغو"
          />,
          <Button
            type="success"
            onClick={handleAcceptEditTable}
            label="تایید"
          />,
        ]}
      >
        CopyLocation
      </Modal>
    </span>
  );
};

export default CopyLocation;
