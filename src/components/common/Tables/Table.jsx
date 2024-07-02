import React from "react";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  FilterRow,
  Pager,
} from "devextreme-react/data-grid";
import { Col } from "reactstrap";

const Table = ({ DataGridCompanyColumns, allListRF, defaultPageSize = 50 }) => {
  return (
    <Col className="mt-4">
      <DataGrid
        dataField="Price"
        dataSource={allListRF}
        defaultColumns={DataGridCompanyColumns}
        showBorders
        rtlEnabled
        allowColumnResizing
        className="fontStyle"
        // onRowClick={states}
        height={500}
      >
        <Scrolling
          rowRenderingMode="virtual"
          showScrollbar="always"
          columnRenderingMode="virtual"
        />
        <Paging defaultPageSize={defaultPageSize} />
        {/* <Pager
          visible={true}
          allowedPageSizes={10}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        /> */}
        <FilterRow visible={true} />
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
