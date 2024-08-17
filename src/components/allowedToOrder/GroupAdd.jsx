import React from "react";
import Modal from "../common/Modals/Modal";
import Button from '../common/Buttons/Button'

const GroupAdd = ({ showAdd, setShowAdd }) => {
  const handleAccept = () => {};
  return (
    <div>
      <Modal
        size="lg"
        label={"افزودن"}
        isOpen={showAdd}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowAdd(false)}
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

export default GroupAdd;
