import React, { useEffect, useState } from "react";
import Table from "../common/Tables/Table";
import { Card, Container, ModalBody, ModalHeader, Row } from "reactstrap";
import asyncWrapper from "../../utiliy/asyncWrapper";
import Modal from "../common/Modals/Modal";
import PromotionDetail from "./PromotionDetail";
import Button from "../common/Buttons/Button";
import {
  itemPromotionList,
  slaPromotionByUserIdList,
  slaPromotionPlatformList,
  slaPromotionTypeList,
} from "../../redux/reducers/promotion/promotion-action";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { render } from "@testing-library/react";
import MainTitle from "../common/MainTitles/MailTitle";
import Toastify from "../common/Toasts/Toastify";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import QuestionModal from "../common/QuestionModal/index";
import { DashboardCustomizeOutlined } from "@mui/icons-material";
import { Behavior } from "devextreme-react/range-selector";

const Promotion = () => {
  const { users, main } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showDetail, setShowDetail] = useState(false);
  const [detailRow, setDetailRow] = useState({});
  const [inputFields, setInputFields] = useState({});
  const [promotionList, setPromotionList] = useState([]);
  const [itsEditRow, setItsEditRow] = useState(false);
  const [selectedRowKeys, setselectedRowKeys] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });

  const handleGetAllList = asyncWrapper(async () => {
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await slaPromotionByUserIdList(users?.userId);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status == "Success") {
      setPromotionList(data);
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
  useEffect(() => {
    handleGetAllList();
  }, []);

  const handleShowDetail = () => {
    setShowDetail(true);
    setItsEditRow(false);
  };

  const handleChangePageSize = (event) => {
    event.preventDefault();
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        pageSize: Number(event.target.value) || 0,
        current: 1,
      },
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const customRender = (cellInfo) => {
    console.log(cellInfo);
    return cellInfo.value;
  };

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
      dataField: "title",
      caption: "عنوان",
      allowEditing: false,
      renderGridCell: (item) => {
        if (item === "title") {
          return <>{"یییی"}</>;
        }
      },
    },
    {
      dataField: "fromDate",
      caption: "از‌ تاریخ",
      allowEditing: false,
    },
    {
      dataField: "toDate",
      caption: "تا تاریخ",
      allowEditing: false,
    },
    {
      dataField: "isActive",
      caption: "فعال/غیر فعال",
      allowEditing: false,
      cellRender: (item) => {
        return <>{`${item?.key?.isActive ? "فعال" : "غیرفعال"}`}</>;
      },
    },
    {
      dataField: "desc",
      caption: "توضیحات",
      allowEditing: false,
    },
  ];

  // const handleCellClick = (cellData) => {
  //   console.log("Cell data:", cellData);
  //   // اینجا می‌توانید عملیات دیگری انجام دهید، مثلا ارسال به سرور یا نمایش در یک modal
  // };

  // const columning = [
  //   {
  //     dataField: "id",
  //     text: "ردیف",
  //     formatter: (cellContent, row, rowIndex) =>
  //       rowIndex +
  //       1 +
  //       (Number(tableParams?.pagination?.current || 1) - 1) *
  //         Number(tableParams.pagination.pageSize || 1),
  //   },
  //   {
  //     dataField: "code",
  //     text: "کد",
  //     cellRender: (data) => (
  //       <div onClick={() => handleCellClick(data)}>{data.text}</div>
  //     ),
  //   },
  //   {
  //     dataField: "title",
  //     text: "عنوان",
  //   },
  //   {
  //     dataField: "fromDate",
  //     text: "از‌ تاریخ",
  //   },
  //   {
  //     dataField: "toDate",
  //     text: "تا تاریخ",
  //   },
  //   {
  //     dataField: "isActive",
  //     text: "فعال/غیر فعال",
  //     formatter: (cellContent) => (cellContent ? "فعال" : "غیر فعال"),
  //   },
  //   {
  //     dataField: "desc",
  //     text: "توضیحات",
  //   },
  //   {
  //     text: "عملیات",
  //     formatter: (cellContent, row) =>
  //       customRender({ value: cellContent, column: row }),
  //   },
  // ];

  // const MyTableComponent = ({ data }) => (
  //   <DataGrid dataSource={data} showBorders={true}>
  //     {columns.map((col, index) => (
  //       <Column key={index} {...col} />
  //     ))}
  //   </DataGrid>
  // );

  const handleOnRowClick = (data) => {
    setDetailRow(data);
    setShowDetail(true);
    setItsEditRow(true);
  };

  const onSelectionChanged = (e) => {
    console.log(e);
    // const fixed = e?.selectedRowsData?.map((row) => row?.id);
    setselectedRowKeys(e);
  };

  console.log(selectedRowKeys);

  return (
    <>
      <Container fluid className="mt-4">
        <MainTitle label="پروموشن" />
        <Card className=" shadow bg-white border pointer">
          <div className="mt-3 mx-3">
            <Button
              type="success"
              icon={<AddIcon className="ms-1 fw-bold" />}
              onClick={handleShowDetail}
              label="جدید"
            />
          </div>
          <Row className="standardPadding">
            <Table
              selection
              selectedRowKeys={selectedRowKeys}
              onSelectionChanged={onSelectionChanged}
              headerFilter
              onRowClick={handleOnRowClick}
              columns={columns}
              allListRF={promotionList}
            />
          </Row>
        </Card>
        {showDetail && (
          <PromotionDetail
            handleGetAllList={handleGetAllList}
            itsEditRow={itsEditRow}
            inputFields={inputFields}
            setInputFields={setInputFields}
            promotionList={promotionList}
            detailRow={detailRow}
            showDetail={showDetail}
            setShowDetail={setShowDetail}
          />
        )}
        <Toastify />
      </Container>
    </>
  );
};

export default Promotion;

// const Table = ({
//   onRowClick,
//   headerFilter,
//   filterRow,
//   allListRF = [],
//   defaultPageSize = 25,
//   deleteRow,
//   editRow,
// }) => {
//   const DataGridPageSizes =
//     allListRF?.length < 25
//       ? []
//       : allListRF?.length > 25
//       ? [25, 50]
//       : [25, 50, 100];

//   const columns = [
//     {
//       dataField: "code",
//       caption: "کد",
//       allowEditing: false,
//     },
//     {
//       dataField: "operations",
//       caption: "عملیات",
//       allowEditing: false,
//       cellRender: (cellData) => (
//         <div>
//           <FontAwesomeIcon
//             icon={faEdit}
//             style={{ marginRight: 10, cursor: "pointer" }}
//             onClick={() => editRow(cellData.data)}
//           />
//           <FontAwesomeIcon
//             icon={faTrash}
//             style={{ cursor: "pointer" }}
//             onClick={() => deleteRow(cellData.data)}
//           />
//         </div>
//       ),
//     },
//   ];

//         <Scrolling
//           rowRenderingMode="virtual"
//           showScrollbar="always"
//           columnRenderingMode="virtual"
//         />
//         <Paging defaultPageSize={defaultPageSize} />
//         <Editing
//           mode="row"
//           allowUpdating={true}
//           allowDeleting={true}
//           allowAdding={true}
//         />
//         <HeaderFilter visible={headerFilter} />
//         <Pager
//           visible
//           allowedPageSizes={DataGridPageSizes}
//           showPageSizeSelector
//           showNavigationButtons
//         />
//         <FilterRow visible={filterRow} />
//       </DataGrid>
//     </Col>
//   );
// };

// export default Table;
