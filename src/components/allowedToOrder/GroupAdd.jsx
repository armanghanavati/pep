import React from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import CommonFields from "./CommonFields";

const GroupAdd = ({ showAdd, setShowAdd }) => {
  return (
    <>
      <Modal
        size="lg"
        label="افزودن گروهی"
        isOpen={showAdd}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowAdd(false)}
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

export default GroupAdd;
