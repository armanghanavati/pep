import React from "react";
import { DataGridLocationPositionOrderNumberColumns } from "./LocationPositionOrderNumber-config";
import {
  DataGridDefaultHeight,
  DataGridDefaultPageSize,
  DataGridPageSizes,
} from "../../config/config";
import { Card, Col, Label, Row } from "reactstrap";
import { DataGrid } from "devextreme-react";
import {
  FilterPanel,
  FilterRow,
  HeaderFilter,
  Pager,
  Paging,
  Scrolling,
} from "devextreme-react/data-grid";
import Button from "../common/Buttons/Button";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";

const TableOrderNumb = ({
  btnExportExcel_onClick,
  LocationPositionOrderNumberGridData,
  grdLocationPositionOrderNumber_onClickRow,
}) => {
  return (
    <>
      {/* <Row>
        <Label className="title">لیست تعداد مجاز ثبت درخواست فروشگاه</Label>
      </Row> */}
      <Row className="standardSpaceTop">
        <Col xs="auto" className="standardMarginRight">
          <DataGrid
            dataSource={LocationPositionOrderNumberGridData}
            defaultColumns={DataGridLocationPositionOrderNumberColumns}
            showBorders={true}
            rtlEnabled={true}
            allowColumnResizing={true}
            onRowClick={grdLocationPositionOrderNumber_onClickRow}
            height={DataGridDefaultHeight}
          >
            <Scrolling
              rowRenderingMode="virtual"
              showScrollbar="always"
              columnRenderingMode="virtual"
            />

            <Paging defaultPageSize={DataGridDefaultPageSize} />
            <Pager
              visible={true}
              allowedPageSizes={DataGridPageSizes}
              showPageSizeSelector={true}
              showNavigationButtons={true}
            />
            <FilterRow visible={true} />
            <HeaderFilter
              texts={{ cancel: "لغو", ok: "تایید" }}
              visible={true}
            />
            <FilterPanel visible={true} />
          </DataGrid>
        </Col>
      </Row>
    </>
  );
};

export default TableOrderNumb;
