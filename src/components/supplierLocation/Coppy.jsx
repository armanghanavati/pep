import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import { Col, Row } from "reactstrap";
import TableMultiSelect2 from "../common/Tables/TableMultiSelect2";
import asyncWrapper from "../../utiliy/asyncWrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import ComboBox from "../common/ComboBox";
import Validation from "../../utiliy/validations";
import { supplierLocationSupplierLimitListByLocationIds } from "../../redux/reducers/supplier/supplier-action";
import RangeSlider from "../common/RangeSlider";

const Coppy = ({ showCoppy, setShowCoppy }) => {
  return (
    <Modal
      size="xl"
      onClose={() => setShowCoppy(false)}
      label="کپی تنظیمات"
      isOpen={showCoppy}
      footerButtons={[
        <>
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            // onClick={() => setShowDetail(false)}
            label="لغو"
          />
          <Button
            // onClick={handleQuestionToAcceptEdit}
            label="کپی"
          />
        </>,
      ]}
    >
      <Row className="">
        <TableMultiSelect2
          itemName={"label"}
          //   selected={selectedLocation}
          //   setSelected={setSelectedLocation}
          //   submit={() => setGetLocation(selectedLocation)}
          //   allListRF={fixStoreList}
          xxl={6}
          xl={6}
          label="فروشگاه مبداء"
        />
        <TableMultiSelect2
          itemName={"label"}
          //   selected={selectedSupplier}
          //   setSelected={setSelectedSupplier}
          //   submit={() => setGetSupplier(selectedSupplier)}
          //   allListRF={allSupplier}
          xxl={6}
          xl={6}
          label="تامین کننده مبداء"
        />
        <TableMultiSelect2
          itemName={"label"}
          className="mt-4"
          //   selected={selectedSupplier}
          //   setSelected={setSelectedSupplier}
          //   submit={() => setGetSupplier(selectedSupplier)}
          //   allListRF={allSupplier}
          xxl={6}
          xl={6}
          label="فروشگاه مقصد"
        />
        
      </Row>
    </Modal>
  );
};

export default Coppy;
