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
  Pager,
  Paging,
  Scrolling,
} from "devextreme-react/data-grid";
import Button from "../common/Buttons/Button";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import ArticleIcon from "@mui/icons-material/Article";

const TableOrderNumb = ({
  btnExportExcel_onClick,
  LocationPositionOrderNumberGridData,
  grdLocationPositionOrderNumber_onClickRow,
}) => {
  return (
    <Card className="shadow bg-white border pointer">
      <Row className="standardPadding">
        <Row>
          <Label className="title">لیست تعداد مجاز ثبت درخواست فروشگاه</Label>
        </Row>
        <Row className="mb-2" style={{ direction: "ltr" }}>
            <Button
              icon={<ArticleIcon className="font18 fwbold me-2" />}
              label="اکسل"
              type="success"
              stylingMode="contained"
              rtlEnabled={true}
              onClick={btnExportExcel_onClick}
            />
        </Row>
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
              <FilterPanel visible={true} />
            </DataGrid>
          </Col>
        </Row>
      </Row>
    </Card>
  );
};

export default TableOrderNumb;
