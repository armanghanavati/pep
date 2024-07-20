import React from "react";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  FilterRow,
  Pager,
  Editing,
  HeaderFilter,
  Selection,
} from "devextreme-react/data-grid";
import { Col } from "reactstrap";

const Table = ({
  onRowClick,
  headerFilter,
  filterRow,
  columns = [],
  allListRF = [],
  defaultPageSize = 25,
  allowEditing = false,
  allowDeleting = false,
  allowUpdating = false,
  allowAdding = false,
  onSelectionChanged,
  selectedRowKeys,
  selection,
}) => {
  const DataGridPageSizes =
    allListRF?.length < 25
      ? []
      : allListRF?.length > 25
      ? [25, 50]
      : [25, 50, 100];

  return (
    <Col className="mt-4">
      <DataGrid
        columnResizingMode="widget"
        columnAutoWidth={true}
        allowColumnReordering={true}
        onRowClick={onRowClick}
        dataField="Price"
        dataSource={allListRF}
        // defaultColumns={columns}
        // columns={columns}
        showBorders
        rtlEnabled
        allowColumnResizing
        className="fontStyle"
        height={500}
        onSelectionChanged={onSelectionChanged}
        selectedRowKeys={selectedRowKeys}
      >
        <Scrolling
          rowRenderingMode="virtual"
          showScrollbar="always"
          columnRenderingMode="virtual"
        />
        <Paging defaultPageSize={defaultPageSize} />
        <Editing
          useIcons
          mode="row"
          allowUpdating={allowUpdating}
          allowDeleting={allowDeleting}
          allowAdding={allowAdding}
          allowEditing={allowEditing}
          // texts={{
          //   confirmDeleteMessage: "آیا از حذف آن اطمینان لازم را دارد؟",
          // }}
        />
        {selection && (
          <Selection
            showCheckBoxesMode="always"
            selectAllMode="allPages"
            mode="multiple"
          />
        )}
        <HeaderFilter
          texts={{ cancel: "لغو", ok: "تایید" }}
          visible={headerFilter}
        />
        <Pager
          visible
          allowedPageSizes={DataGridPageSizes}
          showPageSizeSelector
          showNavigationButtons
        />
        <FilterRow visible={filterRow} />
        {columns.map((col, index) => (
          <Column key={index} {...col} />
        ))}
      </DataGrid>
    </Col>
  );
};
export default Table;

// import React from "react";
// import DataGrid, {
//   Column,
//   Paging,
//   Scrolling,
//   FilterRow,
//   Pager,
//   Editing,
//   HeaderFilter,
// } from "devextreme-react/data-grid";
// import { Col } from "reactstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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

//   const handleViewClick = (data) => {
//     alert(`Viewing row with code: ${data.code}`);
//   };

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
//             icon={faEye}
//             style={{ marginRight: 10, cursor: "pointer" }}
//             onClick={() => handleViewClick(cellData.data)}
//           />
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

//   return (
//     <Col className="mt-4">
//       <DataGrid
//         columnResizingMode="widget"
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
//         {columns.map((col, index) => (
//           <Column key={index} {...col} />
//         ))}
//       </DataGrid>
//     </Col>
//   );
// };

// export default Table;

// import React from "react";
// import DataGrid, {
//   Column,
//   Paging,
//   Scrolling,
//   FilterRow,
//   Pager,
//   Editing,
//   HeaderFilter,
// } from "devextreme-react/data-grid";
// import { Col } from "reactstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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

//   const handleViewClick = (data) => {
//     alert(`Viewing row with code: ${data.code}`);
//   };

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
//             icon={faEye}
//             style={{ marginRight: 10, cursor: "pointer" }}
//             onClick={() => handleViewClick(cellData.data)}
//           />
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

//   return (
//     <Col className="mt-4">
//       <DataGrid
//         columnResizingMode="widget"
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
