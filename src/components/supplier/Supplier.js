import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Card,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import classnames from "classnames";
import TextBox from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import { CheckBox } from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";
import { Tooltip } from "devextreme-react/tooltip";
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
} from "devextreme-react/data-grid";
import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  DataGridDefaultHeight,
  ToastTime,
  ToastWidth,
} from "../../config/config";
import { supplierList } from "../../redux/reducers/supplier/supplier-action";
import { DataGridSupplierColumns } from "./Supplier-config";

import PlusNewIcon from "../../assets/images/icon/plus.png";

class Supplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SupplierGridData: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_updateGrid();
  }

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "supplier.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "supplier.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "supplier.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show) {
      this.setState({
        SupplierGridData: await supplierList(this.props.User.token),
      });
    }
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  render() {
    return (
      <div className="standardMargin" style={{ direction: "rtl" }}>
        <Toast
          visible={this.state.ToastProps.isToastVisible}
          message={this.state.ToastProps.Message}
          type={this.state.ToastProps.Type}
          onHiding={this.onHidingToast}
          displayTime={ToastTime}
          width={ToastWidth}
          rtlEnabled={true}
        />
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label>تامین کننده</Label>
            </Row>
            {this.state.stateDisable_btnAdd && (
              <Row>
                <Col xs="auto">
                  <Button
                    icon={PlusNewIcon}
                    text="جدید"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnNew_onClick}
                  />
                </Col>
              </Row>
            )}
            <Row className="standardPadding">
              <Col>
                <Label className="standardLabelFont">نام تامین کننده</Label>
                <TextBox
                  defaultValue={this.state.txtSupplierNameValue}
                  showClearButton={true}
                  placeholder="نام تامین کننده"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtSupplierName_onChanege}
                />
                <Label
                  id="errSupplierName"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">نام فارسی</Label>
                <TextBox
                  defaultValue={this.state.txtSupplierNamepersianValue}
                  showClearButton={true}
                  placeholder="نام فارسی تامین کننده"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtSupplierNamePersian_onChanege}
                />
                <Label
                  id="errSupplierNamePersian"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">توضیحات</Label>
                <TextBox
                  defaultValue={this.state.txtSupplierDescValue}
                  showClearButton={true}
                  placeholder="توضیحات"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtSupplierDesc_onChanege}
                />
                <Label
                  id="errSupplierDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
            </Row>
            {!this.state.stateUpdateDelete ? (
              <Row>
                {this.state.stateDisable_btnAddPosition && (
                  <Col xs="auto">
                    <Button
                      variant="contained"
                      sx={{ fontFamily: "Tahoma" }}
                      onClick={this.btnAddPosition_onClick}
                    >
                      ثبت سمت
                    </Button>
                  </Col>
                )}
              </Row>
            ) : (
              <>
                <Row>
                  {this.state.stateDisable_btnUpdatePosition && (
                    <Col xs="auto">
                      <Button
                        variant="contained"
                        sx={{ fontFamily: "Tahoma" }}
                        onClick={this.btnUpdatePosition_onClick}
                      >
                        ذخیره تغییرات
                      </Button>
                    </Col>
                  )}
                </Row>
                <Row>
                  <Col>
                    <p
                      id="ErrorUpdatePosition"
                      style={{ textAlign: "right", color: "red" }}
                    ></p>
                  </Col>
                </Row>
              </>
            )}
          </Row>
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label className="title">لیست تامین کنندگان</Label>
            </Row>
            <Row>
              <Col xs="auto" className="standardMarginRight">
                <DataGrid
                  dataSource={this.state.SupplierGridData}
                  defaultColumns={DataGridSupplierColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowClick={this.grdPosition_onClickRow}
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Supplier: state.supplier,
});

export default connect(mapStateToProps)(Supplier);
