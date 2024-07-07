import React, { useEffect, useState } from "react";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import MenuIcon from "@mui/icons-material/Menu";

import "../../../assets/CSS/table_multi_select.css";
import { Col } from "reactstrap";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  FilterRow,
  Pager,
  Selection,
  Editing,
  HeaderFilter,
} from "devextreme-react/data-grid";
import Modal from "../../common/Modals/Modal";
import Button from "../Buttons/Button";

const TableMultiSelect = ({
  xs = 12,
  md = 3,
  xl = 3,
  xxl = 4,
  label,
  onRowClick,
  headerFilter,
  filterRow,
  columns = [],
  allListRF = [],
  defaultPageSize = 10,
  className,
  deleteRow,
  selectedRowKeys,
  onSelectionChanged,
  setSelectedRowKeys,
  submit,
}) => {
  const [showTable, setShowTable] = useState(false);

  const handleSubmit = () => {
    setShowTable(false);
    submit();
  };

  return (
    <Col className={className} xxl={xxl} xs={xs} md={md} xl={xl}>
      <div
        onClick={() => setShowTable(true)}
        className="d-flex justify-content-between py-1 bg-white-multi  cursorPointer px-2 border rounded-2"
      >
        <span className="text-secondary ms-2">{label}</span>
        <span>
          <MenuIcon className="text-secondary" />
        </span>
      </div>
      <Modal
        label={label}
        classHeader="bg-white"
        isOpen={showTable}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowTable(false)}
            label="لغو"
          />,
          <Button onClick={handleSubmit} label="افزودن" />,
        ]}
      >
        <Col className="mt-4">
          <DataGrid
            id="grdTicket"
            columnResizingMode="widget"
            selectedRowKeys={selectedRowKeys}
            onSelectionChanged={onSelectionChanged}
            columnAutoWidth={true}
            allowColumnReordering={true}
            // keyExpr="id"
            onRowClick={onRowClick}
            dataField="Price"
            dataSource={allListRF}
            defaultColumns={columns}
            showBorders
            rtlEnabled
            allowColumnResizing
            className="fontStyle"
            height={500}
          >
            <Paging defaultPageSize={10000000} />
            <Scrolling
              rowRenderingMode="virtual"
              showScrollbar="always"
              columnRenderingMode="virtual"
            />
            <Editing mode="cell" allowUpdating allowDeleting={deleteRow} />
            <HeaderFilter visible={headerFilter} />
            <FilterRow visible={filterRow} />
          </DataGrid>
        </Col>
      </Modal>
    </Col>
  );
};

export default TableMultiSelect;

// import React, { useState, useEffect } from "react";
// import DataGrid, {
//   Column,
//   Paging,
//   Scrolling,
//   Selection,
//   FilterRow,
//   Pager,
//   Editing,
//   HeaderFilter,
// } from "devextreme-react/data-grid";
// import { Col } from "reactstrap";

// const Table = ({
//   onRowClick,
//   headerFilter,
//   filterRow,
//   columns = [],
//   allListRF = [],
//   defaultPageSize = 10,
//   deleteRow,
// }) => {
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);

//   useEffect(() => {
//     const initialSelectedKeys = allListRF
//       .filter(row => row.check) // فیلتر کردن سطرهایی که `check` آن‌ها `true` است
//       .map(row => row.id); // استخراج کلیدهای آن سطرها (فرض کنید `id` کلید سطر است)
//     setSelectedRowKeys(initialSelectedKeys);
//   }, [allListRF]);

//   const handleSelectionChanged = (e) => {
//     setSelectedRowKeys(e.selectedRowKeys);
//     console.log("Selected Row Keys:", e.selectedRowKeys);
//   };

//   const DataGridPageSizes =
//     allListRF?.length < 25 ? [10, 25, 50, 100] : [25, 50, 100];

//   return (
//     <Col className="mt-4">
//       <DataGrid
//         id="grdTicket"
//         columnResizingMode="widget"
//         selectedRowKeys={selectedRowKeys}
//         onSelectionChanged={handleSelectionChanged}
//         columnAutoWidth={true}
//         allowColumnReordering={true}
//         onRowClick={onRowClick}
//         dataSource={allListRF}
//         showBorders
//         rtlEnabled
//         allowColumnResizing
//         className="fontStyle"
//         height={500}
//       >
//         <Scrolling
//           rowRenderingMode="virtual"
//           showScrollbar="always"
//           columnRenderingMode="virtual"
//         />
//         <Selection mode="multiple" />
//         <Paging defaultPageSize={defaultPageSize} />
//         <Editing mode="cell" allowUpdating allowDeleting={deleteRow} />
//         <HeaderFilter visible={headerFilter} />
//         <Pager
//           visible
//           allowedPageSizes={DataGridPageSizes}
//           showPageSizeSelector
//           showNavigationButtons
//         />
//         <FilterRow visible={filterRow} />
//         {columns.map((col, index) => (
//           <Column key={index} {...col} />
//         ))}
//       </DataGrid>
//     </Col>
//   );
// };
