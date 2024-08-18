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
import { groupBySupplierId } from "../../redux/reducers/itemGroup/itemGroup-actions";
import { listByGroupIds } from "../../redux/reducers/item/item-action";

const GroupEdit = ({ showEdit, setShowEdit , supplierList }) => {
  const dispatch = useDispatch();
  const { companies, users } = useSelector((state) => state);
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState([]);
  const [locationEnd, setLocationEnd] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [item, setItem] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [group, setGroup] = useState([]);

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
  };

  const handleAccept = async () => {
    const postData = {
      itemIds: item?.includes(0)
        ? StringHelpers.fixComboListId(item, itemList?._store?._array)
        : item,
      inventoryIds: inventory,
      locationSoreceId: location,
      locationDestinationIds: locationEnd,
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await copyItemLocationGroup(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status == "Success") {
      setShowEdit(false);
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

  const handleGroupListBySupplier = asyncWrapper(async (e) => {
    setSupplier(e);
    console.log(e);
    dispatch(RsetIsLoading({ stateWait: true }));
    if (e.includes(0)) {
      const fixLoop = StringHelpers.fixComboListId(e, supplierList);
      console.log(fixLoop);
      const res = await groupBySupplierId(fixLoop);
      dispatch(RsetIsLoading({ stateWait: false }));
      const { data, status, message } = res;
      if (status == "Success") {
        setGroupList(data);
      } else {
        dispatch(
          RsetShowToast({
            isToastVisible: true,
            Message: message || "لطفا دوباره امتحان کنید",
            Type: status,
          })
        );
      }
    } else {
      const res = await groupBySupplierId(e);
      dispatch(RsetIsLoading({ stateWait: false }));
      const { data, status, message } = res;
      if (status == "Success") {
        setGroupList(data);
      } else {
        dispatch(
          RsetShowToast({
            isToastVisible: true,
            Message: message || "لطفا دوباره امتحان کنید",
            Type: status,
          })
        );
      }
    }
  });

  const handleListByGroupIds = asyncWrapper(async (e) => {
    setGroup(e);
    dispatch(RsetIsLoading({ stateWait: true }));
    if (e.includes(0)) {
      const fixLoop = StringHelpers.fixComboListId(e, groupList);
      console.log(fixLoop);
      const res = await listByGroupIds(fixLoop);
      dispatch(RsetIsLoading({ stateWait: false }));
      const { data, status, message } = res;
      if (status == "Success") {
        const LAZY = new DataSource({
          store: data,
          paginate: true,
          pageSize: 10,
        });
        setItemList(LAZY);
      } else {
        dispatch(
          RsetShowToast({
            isToastVisible: true,
            Message: message || "لطفا دوباره امتحان کنید",
            Type: status,
          })
        );
      }
    } else {
      const res = await listByGroupIds(e);
      dispatch(RsetIsLoading({ stateWait: false }));
      const { data, status, message } = res;
      if (status == "Success") {
        const LAZY = new DataSource({
          store: data,
          paginate: true,
          pageSize: 10,
        });
        setItemList(LAZY);
      } else {
        dispatch(
          RsetShowToast({
            isToastVisible: true,
            Message: message || "لطفا دوباره امتحان کنید",
            Type: status,
          })
        );
      }
    }
  });

  return (
    <span>
      <Modal
        size="lg"
        label="ویرایش گروهی"
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
        <Col className=" mt-2">
          <Label className="standardLabelFont">سمت</Label>
          <TagBox
            // dataSource={supplierList}
            searchEnabled={true}
            displayExpr="label"
            valueExpr="id"
            rtlEnabled={true}
            // onValueChange={handleGroupListBySupplier}
            // value={supplier}
            className="fontStyle"
          />
        </Col>
        <Col className=" mt-2">
          <Label className="standardLabelFont">تامین کننده</Label>
          <TagBox
            dataSource={supplierList}
            searchEnabled={true}
            displayExpr="label"
            placeholder="تامین کننده"
            valueExpr="id"
            rtlEnabled={true}
            onValueChange={handleGroupListBySupplier}
            value={supplier}
            className="fontStyle"
          />
        </Col>
        <Col xl={12} xxl={12} className=" mt-2">
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

export default GroupEdit;
