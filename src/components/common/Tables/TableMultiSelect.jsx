import React, { useState } from "react";
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
}) => {
  const [showTable, setShowTable] = useState(false);
  const DataGridPageSizes =
    allListRF?.length < 0 ? 0 : allListRF?.length >= 25 ? 50 : 100;

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
          <Button label="افزودن" />,
        ]}
      >
        <Col className="mt-4">
          <DataGrid
            id="grdTicket"
            columnResizingMode="widget"
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
            <Scrolling
              rowRenderingMode="virtual"
              showScrollbar="always"
              columnRenderingMode="virtual"
            />
            <Selection mode="multiple" />
            <Paging pageSize={25} pageIndex={10} defaultPageSize={50} />
            <Editing mode="cell" allowUpdating allowDeleting={deleteRow} />
            <HeaderFilter visible={headerFilter} />
            {/* <Pager
              visible
              allowedPageSizes={DataGridPageSizes}
              showPageSizeSelector
              showNavigationButtons
            /> */}
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
      </Modal>
    </Col>
  );
};

export default TableMultiSelect;
