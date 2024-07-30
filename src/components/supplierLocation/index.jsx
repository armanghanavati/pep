import React, { useEffect, useState } from "react";
import Table from "../common/Tables/Table";
import { Card, Col, Container, ModalBody, ModalHeader, Row } from "reactstrap";
import Button from "../common/Buttons/Button";
import MainTitle from "../common/MainTitles/MailTitle";
import Toastify from "../common/Toasts/Toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";
import HdrWeakIcon from "@mui/icons-material/HdrWeak";
import AddSupplierLocation from "./AddSupplierLocation";
import AddIcon from "@mui/icons-material/Add";
import {
  allLocationSupplierLimitList,
  supplierLocationSupplierLimitListByLocationIds,
} from "../../redux/reducers/supplier/supplier-action";
import asyncWrapper from "../../utiliy/asyncWrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import { Gfn_FormatNumber } from "../../utiliy/GlobalMethods";
import TableMultiSelect2 from "../common/Tables/TableMultiSelect2";
import SearchIcon from "@mui/icons-material/Search";
import { locationPromotionList } from "../../redux/reducers/location/location-actions";
import Coppy from "./Coppy";

const SupplierLocation = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showCoppy, setShowCoppy] = useState(false);
  const [allLocationSupplier, setAllLocationSupplier] = useState([]);
  const [editSupplierRowData, setEditSupplierRowData] = useState({});
  const [inputFields, setInputFields] = useState({});
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [getLocation, setGetLocation] = useState({});
  const [allSupplier, setAllSupplier] = useState([]);

  const fixStoreList = storeList?.map((store) => ({
    id: store?.id,
    label: store?.locationName,
  }));

  const handleShowStartSupplier = () => {
    setShowSupplier(true);
  };

  const handleAllLocationSupplierLimitList = asyncWrapper(async () => {
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await allLocationSupplierLimitList();
    const { data, status, message } = res;
    dispatch(RsetIsLoading({ stateWait: false }));
    if (status == "Success") {
      setAllLocationSupplier(data);
    } else {
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: message || "لطفا دوباره امتحان کنید",
          Type: status,
        })
      );
    }

    console.log(res);
  });

  useEffect(() => {
    handleAllLocationSupplierLimitList();
    handleGroupStore();
  }, []);

  const columns = [
    {
      dataField: 1,
      caption: "ردیف",
      allowEditing: false,
      cellRender: (item) => {
        return <>{item?.row?.dataIndex + 1}</>;
      },
    },
    {
      dataField: "locationName",
      caption: "فروشگاه",
      allowEditing: false,
    },
    {
      dataField: "supplierName",
      caption: "تامین کننده",
      allowEditing: false,
    },
    {
      dataField: "minOrderWeight",
      caption: "حداقل وزن",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.minOrderWeight)}</>;
      },
    },
    {
      dataField: "maxOrderWeight",
      caption: "حداکثر وزن",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.maxOrderWeight)}</>;
      },
    },
    {
      dataField: "minOrderNumber",
      caption: "حداقل تعداد",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.minOrderNumber)}</>;
      },
    },
    {
      dataField: "maxOrderNumber",
      caption: "حداکثر تعداد",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.maxOrderNumber)}</>;
      },
    },
    {
      dataField: "minOrderRiali",
      caption: "حداقل ریال",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.minOrderRiali)}</>;
      },
    },
    {
      dataField: "maxOrderRiali",
      caption: "حداکثر ریال",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.maxOrderRiali)}</>;
      },
    },
  ];

  const handleGroupStore = asyncWrapper(async () => {
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await locationPromotionList(users?.userId, 0);
    dispatch(RsetIsLoading({ stateWait: false }));

    const { data, status, message } = res;
    if (status == "Success") {
      console.log(data);
      setStoreList(data);
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

  const handleSupplierLocationSupplierLimitListByLocationIds = asyncWrapper(
    async (e) => {
      dispatch(RsetIsLoading({ stateWait: true }));
      const res = await supplierLocationSupplierLimitListByLocationIds(e);
      dispatch(RsetIsLoading({ stateWait: false }));

      const { data, status, message } = res;
      if (status == "Success") {
        const fixdata = data.map((item) => ({
          id: item?.supplierId,
          label: item?.supplierName,
        }));
        console.log(data);
        setAllSupplier(fixdata);
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
  );

  const handleSearching = asyncWrapper(() => {});

  const handleOnRowClick = (data) => {
    setEditSupplierRowData(data);
    const {
      minOrderWeight,
      maxOrderWeight,
      minOrderNumber,
      maxOrderNumber,
      minOrderRiali,
      maxOrderRiali,
    } = data?.data;
    setShowSupplier(true);
    setInputFields({
      weight: [minOrderWeight, maxOrderWeight],
      number: [minOrderNumber, maxOrderNumber],
      rial: [minOrderRiali, maxOrderRiali],
    });
  };
  const handleAcceptLocation = () => {
    handleSupplierLocationSupplierLimitListByLocationIds();
    setGetLocation(selectedLocation);
  };

  return (
    <>
      <Container fluid className="mt-4">
        <MainTitle label="تامین کننده/ فروشگاه‌ها" />
        <Card className="p-3 shadow bg-white border pointer">
          <div className="d-flex justify-content-start mt-1 mb-3">
            <Button
              className="ms-3"
              icon={<AddIcon className="ms-1 font18 fw-bold" />}
              type="success"
              onClick={handleShowStartSupplier}
              label="جدید"
            />
            <Button
              type="success"
              icon={<ContentCopyIcon className="ms-1 font18 fw-bold" />}
              onClick={() => setShowCoppy(true)}
              label="کپی تنظیمات"
            />
          </div>
          <Col className="d-flex justify-content-start " xxl={12} xl={12}>
            <TableMultiSelect2
              className="ms-3"
              itemName={"label"}
              selected={selectedLocation}
              setSelected={setSelectedLocation}
              submit={handleAcceptLocation}
              allListRF={fixStoreList}
              xxl={4}
              xl={4}
              label="فروشگاه"
            />
            <TableMultiSelect2
              itemName={"label"}
              // selected={selectedSupplier}
              // setSelected={setSelectedSupplier}
              // submit={() => setGetSupplier(selectedSupplier)}
              // allListRF={allSupplier}
              xxl={4}
              xl={4}
              label="تامین کننده"
            />
            <div className="d-flex me-3 align-items-end justify-content-end ">
              <Button
                // loading
                type="default"
                onClick={handleSearching}
                icon={<SearchIcon className="d-flex ms-2 font18" />}
                label="جستجو"
              />
            </div>
          </Col>
          <Table
            //   selectedRowKeys={selectedRowKeys}
            //   onSelectionChanged={onSelectionChanged}
            filterRow
            headerFilter
            onRowClick={handleOnRowClick}
            columns={columns}
            allListRF={allLocationSupplier}
          />
        </Card>
        <Toastify />
      </Container>
      {showSupplier && (
        <AddSupplierLocation
          allSupplier={allSupplier}
          setAllSupplier={setAllSupplier}
          getLocation={getLocation}
          setGetLocation={setGetLocation}
          storeList={storeList}
          setStoreList={setStoreList}
          inputFields={inputFields}
          setInputFields={setInputFields}
          editSupplierRowData={editSupplierRowData}
          setShowSupplier={setShowSupplier}
          showSupplier={showSupplier}
          handleSupplierLocationSupplierLimitListByLocationIds={
            handleSupplierLocationSupplierLimitListByLocationIds
          }
        />
      )}

      {showCoppy && <Coppy showCoppy={showCoppy} setShowCoppy={setShowCoppy} />}
    </>
  );
};

export default SupplierLocation;
