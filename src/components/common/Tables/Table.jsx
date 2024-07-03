import React from "react";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  FilterRow,
  Pager,
  Editing,
  HeaderFilter,
} from "devextreme-react/data-grid";
import { Col } from "reactstrap";

const Table = ({
  onRowClick,
  headerFilter,
  filterRow,
  columns = [],
  allListRF = [],
  defaultPageSize = 10,
  deleteRow,
}) => {
  const DataGridPageSizes =
    allListRF?.length < 0 ? 0 : allListRF?.length >= 25 ? 50 : 100;
  return (
    <Col className="mt-4">
      <DataGrid
        columnResizingMode="widget"
        columnAutoWidth={true}
        allowColumnReordering={true}
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
        <Scrolling
          rowRenderingMode="virtual"
          showScrollbar="always"
          columnRenderingMode="virtual"
        />
        <Paging pageSize={25} pageIndex={10} defaultPageSize={50} />
        <Editing mode="cell" allowUpdating allowDeleting={deleteRow} />
        <HeaderFilter visible={headerFilter} />
        <Pager
          visible
          allowedPageSizes={DataGridPageSizes}
          showPageSizeSelector
          showNavigationButtons
        />
        <FilterRow visible={filterRow} />
        <Column
          allowGrouping={false}
          dataField="OrderNumber"
          width={130}
          caption="Invoice Number"
        />
        <Column dataField="barcode" caption="City" />
        <Column dataField="CustomerStoreState" caption="State" />
        <Column dataField="Employee" />
        <Column dataField="OrderDate" dataType="date" />
        <Column dataField="SaleAmount" format="currency" />
      </DataGrid>
    </Col>
  );
};

export default Table;
