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
import EditTables from "../common/EditTables/index";
import {
  activeSupplierComboList,
  allLocationSupplierLimitList,
  getAllSupplierComboList,
  searchLocationSupplierLimitList,
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
import {
  allLocationOrderWithSupplier,
  allSupplierList,
  locationPromotionList,
} from "../../redux/reducers/location/location-actions";
import Coppy from "./Coppy";
const SupplierLocation = () => {
  const dispatch = useDispatch();
  const { companies, users } = useSelector((state) => state);
  const [permission, setPermission] = useState({});

  const fn_GetPermissions = () => {
    const perm = users?.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "supplier.update":
            setPermission((prev) => ({ ...prev, update: true }));
            break;
          case "supplier.insert":
            setPermission((prev) => ({ ...prev, insert: true }));
            break;
          case "supplier.show":
            setPermission((prev) => ({ ...prev, show: true }));
            break;
          case "supplier.delete":
            setPermission((prev) => ({ ...prev, delete: true }));
            break;
        }
      }
  };

  console.log(permission);

  const [showSupplier, setShowSupplier] = useState(false);
  const [showCoppy, setShowCoppy] = useState(false);
  const [allLocationSupplier, setAllLocationSupplier] = useState([]);
  const [editSupplierRowData, setIsEditSupplierRowData] = useState({});
  const [itsEdit, setItsEdit] = useState(false);
  const [inputFields, setInputFields] = useState({});
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [getLocation, setGetLocation] = useState({});
  const [getSupplier, setGetSupplier] = useState({});
  const [allSupplier, setAllSupplier] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState([]);
  const fixStoreList = storeList?.map((store) => ({
    id: store?.id,
    label: store?.locationName,
  }));

  useEffect(() => {
    handleActiveSupplierComboList();
    handleGroupStore();
    handleAllLocationSupplierLimitList();
    fn_GetPermissions();
  }, []);

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
    // {
    //   caption: "عملیات",
    //   allowEditing: true,
    //   cellRender: (data) => {
    //     console.log(data?.row?.data);
    //     return (
    //       <>
    //         <DeleteIcon className="font18 fw-bold text-primary cursorPointer" />
    //       </>
    //     );
    //   },
    // },
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

  // const handleSupplierLocationSupplierLimitListByLocationIds = asyncWrapper(
  //   async (e) => {
  //     console.log(e);
  //     dispatch(RsetIsLoading({ stateWait: true }));
  //     const res = await supplierLocationSupplierLimitListByLocationIds(e);
  //     dispatch(RsetIsLoading({ stateWait: false }));

  //     const { data, status, message } = res;
  //     if (status == "Success") {
  //       const fixdata = data.map((item) => ({
  //         id: item?.supplierId,
  //         label: item?.supplierName,
  //       }));
  //       console.log(data);
  //       setAllSupplier(fixdata);
  //     } else {
  //       dispatch(
  //         RsetShowToast({
  //           isToastVisible: true,
  //           Message: message || "لطفا دوباره امتحان کنید",
  //           Type: status,
  //         })
  //       );
  //     }
  //   }
  // );

  const handleSearching = asyncWrapper(async () => {
    const postData = {
      locationIds: selectedLocation,
      supplierIds: selectedSupplier,
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await searchLocationSupplierLimitList(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status == "Success") {
      console.log(data);
      setAllLocationSupplier(data);
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
  });

  const handleOnRowClick = (data) => {
    setIsEditSupplierRowData(data);
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
    setItsEdit(true);
  };

  console.log(companies?.currentCompanyId);

  const handleActiveSupplierComboList = asyncWrapper(async () => {
    dispatch(RsetIsLoading({ stateWait: true }));
    // const res = await getAllSupplierComboList();
    const res = await allSupplierList();

    const { data, status, message } = res;
    dispatch(RsetIsLoading({ stateWait: false }));
    if (status == "Success") {
      setAllSupplier(data);
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

  const handleShowStartSupplier = () => {
    setInputFields({
      weight: undefined,
      number: undefined,
      rial: undefined,
      setSelectedLocation: [],
      setSelectedSupplier: [],
    });
    setShowSupplier(true);
    setItsEdit(false);
  };

  const handleAcceptLocation = () => {
    // handleSupplierLocationSupplierLimitListByLocationIds(selectedLocation);
  };

  const handleFixEditTable = () => {};

  return (
    <>
      <Container fluid className="mt-4">
        <MainTitle label="تامین کننده/ فروشگاه‌ها" />
        <Card className="p-3 shadow bg-white border pointer">
          <div className="d-flex justify-content-start mt-1 mb-3">
            {!!permission && (
              <Button
                className="ms-3"
                icon={<AddIcon className="ms-1 font18 fw-bold" />}
                type="success"
                onClick={handleShowStartSupplier}
                label="جدید"
              />
            )}
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
              submit={() => setGetLocation(selectedLocation)}
              allListRF={fixStoreList}
              xxl={4}
              xl={4}
              label="فروشگاه"
            />
            <TableMultiSelect2
              itemName={"supplierName"}
              selected={selectedSupplier}
              setSelected={setSelectedSupplier}
              submit={() => setGetSupplier(selectedSupplier)}
              allListRF={allSupplier}
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
            onRowClick={!!permission && handleOnRowClick}
            columns={columns}
            allListRF={allLocationSupplier}
          />
        </Card>
        <Toastify />
      </Container>
      {showSupplier && (
        <AddSupplierLocation
          permission={permission}
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
          handleAllLocationSupplierLimitList={
            handleAllLocationSupplierLimitList
          }
          itsEdit={itsEdit}
          // handleSupplierLocationSupplierLimitListByLocationIds={
          //   handleSupplierLocationSupplierLimitListByLocationIds
          // }
        />
      )}

      {showCoppy && (
        <Coppy
          handleAllLocationSupplierLimitList={
            handleAllLocationSupplierLimitList
          }
          showCoppy={showCoppy}
          storeList={fixStoreList}
          setShowCoppy={setShowCoppy}
        />
      )}
    </>
  );
};

export default SupplierLocation;
