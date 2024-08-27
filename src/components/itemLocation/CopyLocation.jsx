import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import { Col, Label, Row } from "reactstrap";
import { SelectBox, TagBox } from "devextreme-react";
import { useDispatch, useSelector } from "react-redux";
import asyncWrapper from "../../utiliy/asyncWrapper";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import ComboBox from "../common/ComboBox";
import { searchItemLocationByLocationIdList } from "../../redux/reducers/location/location-actions";
import StringHelpers from "../../utiliy/GlobalMethods";
import DataSource from "devextreme/data/data_source";
import {
  copyItemLocationGroup,
  userLocationListByUserId,
} from "../../redux/reducers/itemLocation/itemLocation-actions";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import {
  groupBySupplierId,
  itemComboByItemGroupAndSupplierList,
} from "../../redux/reducers/itemGroup/itemGroup-actions";
import { listByGroupIds } from "../../redux/reducers/item/item-action";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Validation from "../../utiliy/validations";

const CopyLocation = ({ inventoryList, supplierList }) => {
  const dispatch = useDispatch();
  const { companies, users } = useSelector((state) => state);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState([]);
  const [locationEnd, setLocationEnd] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [item, setItem] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [group, setGroup] = useState([]);
  const [errors, setErrors] = useState({});
  const [inputFields, setInputFields] = useState({});

  const handleLocationList = asyncWrapper(async () => {
    const res = await userLocationListByUserId(
      users?.userId,
      companies?.currentCompanyId
    );
    setLocationList(res?.data);
  });

  useEffect(() => {
    handleLocationList();
  }, []);

  const cmbLocationList = (e) => {
    setLocation(e);
  };

  const handleChangeInputs = (
    name,
    value,
    validationNameList = undefined,
    index
  ) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    setErrors((prevstate) => {
      return { ...prevstate, [name]: [...temp] };
    });
    setInputFields((prevstate) => {
      return { ...prevstate, [name]: value };
    });
    if (name === "supplier") {
      handleGroupListBySupplier(value);
    }
    if (name === "group") {
      handleListByGroupIds(value);
    }
  };

  const handleAccept = async () => {
    const postData = {
      itemIds: inputFields?.item?.includes(0)
        ? StringHelpers.fixComboListId(
            inputFields?.item,
            itemList?._store?._array
          )
        : inputFields?.item,
      inventoryIds: inputFields?.inventory,
      locationSoreceId: inputFields?.location,
      locationDestinationIds: inputFields?.locationEnd,
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

  const handleGroupListBySupplier = asyncWrapper(async (e) => {
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
    dispatch(RsetIsLoading({ stateWait: true }));
    const postData = {
      itemGroupIds: e?.includes(0)
        ? StringHelpers.fixComboListId(e, groupList)
        : e,
      supplierIds: inputFields?.supplier.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.supplier, supplierList)
        : inputFields?.supplier,
    };
    const res = await itemComboByItemGroupAndSupplierList(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status == "Success") {
      const LAZY = new DataSource({
        store: data,
        paginate: true,
        pageSize: 10,
      });
      console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
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
  });

  return (
    <span>
      <Button
        // icon={<ContentCopyIcon className="ms-1 font18 fw-bold" />}
        onClick={() => setShowCopyModal(true)}
        className="fontStyle me-4 "
        icon={<ContentCopyIcon className="ms-1 font18 fw-bold" />}
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
        <Row>
          <ComboBox
            xxl={12}
            xl={12}
            name="location"
            showClearButton={false}
            options={locationList}
            label="فروشگاه مبدا"
            onChange={handleChangeInputs}
            value={inputFields?.location}
          />
          <ComboBox
            xxl={12}
            xl={12}
            multi
            options={inventoryList}
            label="انبار"
            name="inventory"
            onChange={handleChangeInputs}
            value={inputFields?.inventory}
          />
          <ComboBox
            xxl={12}
            xl={12}
            multi
            name="supplier"
            options={supplierList}
            label="تامین کننده"
            onChange={handleChangeInputs}
            value={inputFields?.supplier}
          />
          <ComboBox
            xxl={12}
            xl={12}
            multi
            options={groupList}
            label="گروه کالا"
            name="group"
            onChange={handleChangeInputs}
            value={inputFields?.group}
          />
          <ComboBox
            xxl={12}
            xl={12}
            multi
            name="item"
            options={itemList}
            label="کالا"
            onChange={handleChangeInputs}
            value={inputFields?.item}
          />
          <ComboBox
            multi
            name="locationEnd"
            label="فروشگاه مقصد"
            xxl={12}
            xl={12}
            options={locationList}
            onChange={handleChangeInputs}
            value={inputFields?.locationEnd}
          />
        </Row>
      </Modal>
    </span>
  );
};

export default CopyLocation;
