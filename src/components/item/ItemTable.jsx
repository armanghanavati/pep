import React from "react";
import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
  Scrolling,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  Pager,
  Selection,
  Grouping,
  GroupPanel,
  SearchPanel,
  ColumnChooser,
} from "devextreme-react/data-grid";
import { Col } from "reactstrap";

const index = ({ DataGridCompanyColumns, allListRF }) => {

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
        <Paging defaultPageSize={50} />
        <Pager
          visible={true}
          allowedPageSizes={10}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
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

export default index;
