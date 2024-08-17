import React from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";

const GroupEdit = ({ setShowEdit, showEdit }) => {
  const handleAccept = () => {};

  return (
    <div>
      {" "}
      <Modal
        size="lg"
        label={"ویرایش گروهی"}
        isOpen={showEdit}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowEdit(false)}
            label="لغو"
          />,
          <Button type="success" onClick={handleAccept} label="تایید" />,
        ]}
      >
        sdfsdfsdf
      </Modal>
    </div>
  );
};

export default GroupEdit;
