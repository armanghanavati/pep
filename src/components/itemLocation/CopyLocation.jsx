import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import { Col, Label } from "reactstrap";
import { SelectBox, TagBox } from "devextreme-react";
import { useDispatch, useSelector } from "react-redux";
import asyncWrapper from "../../utiliy/asyncWrapper";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import ComboBox from "../common/ComboBox";
import { searchItemLocationByLocationIdList } from "../../redux/reducers/location/location-actions";
import StringHelpers from "../../utiliy/GlobalMethods";
import DataSource from "devextreme/data/data_source";
import { copyItemLocationGroup } from "../../redux/reducers/itemLocation/itemLocation-actions";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";

const CopyLocation = ({ inventoryList }) => {
  const dispatch = useDispatch();
  const { companies, users } = useSelector((state) => state);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState([]);
  const [locationEnd, setLocationEnd] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [item, setItem] = useState([]);
  const [inventory, setInventory] = useState(null);

  const handleLocationList = asyncWrapper(async () => {
    const res = await userLocationListUserId(
      users?.userId,
      companies?.currentCompanyId
    );
    setLocationList(res?.data?.data);
  });

  useEffect(() => {
    handleLocationList();
  }, []);

  const cmbLocationList = (e) => {
    setLocation(e);
    handleSearchItemLocationByLocationIdList(e);
  };

  const handleSearchItemLocationByLocationIdList = asyncWrapper(async (e) => {
    const res = await searchItemLocationByLocationIdList([e]);
    const { data, status } = res;
    const LAZY = new DataSource({
      store: data,
      paginate: true,
      pageSize: 10,
    });
    setItemList(LAZY);
    // }
  });

  const handleAccept = async () => {
    const postData = {
      itemIds: item,
      inventoryIds: inventory,
      locationSoreceId: location,
      locationDestinationIds: locationEnd,
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await copyItemLocationGroup(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status == "Success") {
      setShowCopyModal(false);
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: message || "لطفا دوباره امتحان کنید",
          Type: status,
        })
      );
    } else {
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: message || "لطفا دوباره امتحان کنید",
          Type: status,
        })
      );
    }
  };

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
          <Button type="success" onClick={handleAccept} label="تایید" />,
        ]}
      >
        <Col xl={12} xxl={12} className=" my-2">
          <ComboBox
            label="فروشگاه مبدا"
            xxl={12}
            xl={12}
            showClearButton={false}
            options={locationList}
            searchEnabled={true}
            displayExpr="label"
            placeholder="فروشگاه مبدا"
            valueExpr="id"
            rtlEnabled={true}
            onChange={cmbLocationList}
            value={location}
            className="fontStyle"
          />
        </Col>
        <Col xl={12} xxl={12} className=" my-2">
          <Label className="standardLabelFont">انبار</Label>
          <TagBox
            dataSource={inventoryList}
            searchEnabled={true}
            displayExpr="label"
            placeholder="انبار"
            valueExpr="id"
            rtlEnabled={true}
            onValueChange={(e) => setInventory(e)}
            value={inventory}
            className="fontStyle"
          />
        </Col>
        <Col xl={12} xxl={12} className=" my-2">
          <Label className="standardLabelFont">کالا</Label>
          <TagBox
            dataSource={itemList}
            searchEnabled={true}
            displayExpr="label"
            placeholder="کالا"
            valueExpr="id"
            rtlEnabled={true}
            onValueChange={
              (e) => setItem(e)
              //   (prev) => ({
              //   ...prev,
              //   e,
              // }))
            }
            value={item}
            className="fontStyle"
          />
        </Col>
        <Col xl={12} xxl={12} className=" my-2">
          <ComboBox
            multi
            label="فروشگاه مقصد"
            xxl={12}
            xl={12}
            options={locationList}
            searchEnabled={true}
            displayExpr="label"
            placeholder="فروشگاه مقصد"
            valueExpr="id"
            rtlEnabled={true}
            onChange={(e) => setLocationEnd(e)}
            value={locationEnd}
            className="fontStyle"
          />
        </Col>
      </Modal>
    </span>
  );
};

export default CopyLocation;
