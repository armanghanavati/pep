import React from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import CommonFields from "./CommonFields";

const GroupDelete = ({ setShowDelete, showDelete }) => {
  return (
    <>
      <Modal
        size="lg"
        label="حذف گروهی"
        isOpen={showDelete}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowDelete(false)}
            label="لغو"
          />,
          <Button
            type="success"
            // onClick={handleAccept}
            label="تایید"
          />,
        ]}
      >
        <CommonFields />
      </Modal>
    </>
  );
};

export default GroupDelete;
