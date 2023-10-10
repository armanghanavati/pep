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
import {
  supplierList,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../redux/reducers/supplier/supplier-action";
import { DataGridSupplierColumns } from "./Supplier-config";

import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

class Supplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txtSupplierNameValue: null,
      txtSupplierNamePersianValue: null,
      txtSupplierDescValue: null,
      chkIsActive: null,
      chkIsDirect: null,
      RowSelected: null,
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
      txtSupplierMinOrderWeightValue:null,
      txtSupplierMaxOrderWeightValue:null,
      txtSupplierMinOrderRialiValue:null,
      txtSupplierMaxOrderRialiValue:null
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

  btnNew_onClick = () => {
    this.setState({
      txtSupplierNameValue: null,
      txtSupplierNamePersianValue: null,
      txtSupplierDescValue: null,
      chkIsActive: null,
      chkIsDirect: null,
      stateUpdateDelete: false,
    });
  };
  txtSupplierName_onChanege=(e)=>{
    this.setState({ txtSupplierNameValue: e.value });
  }
  txtSupplierNamePersian_onChanege=(e)=>{
    this.setState({ txtSupplierNamePersianValue: e.value });
  }
  txtSupplierDesc_onChanege=(e)=>{
    this.setState({ txtSupplierDescValue: e.value });
  }
  txtSupplierMinOrderWeight_onChanege = (e) => {
    this.setState({ txtSupplierMinOrderWeightValue: e.value });
  };

  txtSupplierMaxOrderWeight_onChanege = (e) => {
    this.setState({ txtSupplierMaxOrderWeightValue: e.value });
  };

  txtSupplierMinOrderRiali_onChanege = (e) => {
    this.setState({ txtSupplierMinOrderRialiValue: e.value });
  };

  txtSupplierMaxOrderRiali_onChanege=(e)=>{
    this.setState({txtSupplierMaxOrderRialiValue:e.value })
  }

  chkIsActive_onChange = (e) => {
    this.setState({
      chkIsActive: e.value,
    });
  };
  chkIsDirect_onChange = (e) => {
    this.setState({
      chkIsDirect: e.value,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errSupplierName").innerHTML = "";
    document.getElementById("errSupplierIsActive").innerHTML = "";
    document.getElementById("errSupplierIsDirect").innerHTML = "";
    if (this.state.txtSupplierNameValue == null) {
      document.getElementById("errSupplierName").innerHTML =
        "نام را وارد نمائید";
      flag = false;
    }

    if (this.state.chkIsActive == null) {
      document.getElementById("errSupplierIsActive").innerHTML =
        "فعال بودن را مشخص نمائید.";
      flag = false;
    }

    if (this.state.chkIsDirect == null) {
      document.getElementById("errSupplierIsDirect").innerHTML =
        "دایرکتی بودن را مشخص نمائید.";
      flag = false;
    }
    return flag;
  };

  btnAdd_onClick = async (e) => {
    if (await this.fn_CheckValidation()) {
      const data = {
        supplierName: this.state.txtSupplierNameValue,
        persianName: this.state.txtSupplierNamePersianValue,
        extSupplierId: null,
        desc: this.state.txtSupplierDescValue,
        isActive: this.state.chkIsActive,
        isDirect: this.state.chkIsDirect,
        minOrderWeight:this.state.txtSupplierMinOrderWeightValue,
        maxOrderWeight:this.state.txtSupplierMaxOrderWeightValue,
        minOrderRiali:this.state.txtSupplierMinOrderRialiValue,
        maxOrderRiali:this.state.txtSupplierMaxOrderRialiValue
      };
      await addSupplier(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: "ثبت با موفقیت انجام گردید.",
          Type: "success",
        },
      });
      this.fn_updateGrid();
    }
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        id: this.state.RowSelected.id,
        supplierName: this.state.txtSupplierNameValue,
        persianName: this.state.txtSupplierNamePersianValue,
        extSupplierId: null,
        desc: this.state.txtSupplierDescValue,
        isActive: this.state.chkIsActive,
        isDirect: this.state.chkIsDirect,
        minOrderWeight:this.state.txtSupplierMinOrderWeightValue,
        maxOrderWeight:this.state.txtSupplierMaxOrderWeightValue,
        minOrderRiali:this.state.txtSupplierMinOrderRialiValue,
        maxOrderRiali:this.state.txtSupplierMaxOrderRialiValue
      };
      const RESULT = await updateSupplier(data, this.props.User.token);
      this.setState({
        SupplierGridData: RESULT
      });
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT != null ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
          Type: RESULT != null ? "success" : "error",
        },
      });
      this.fn_updateGrid();
    }
  };

  grdSupplier_onClickRow = (e) => {
    this.setState({
      txtSupplierNameValue: e.data.supplierName,
      txtSupplierNamePersianValue: e.data.persianName,
      txtSupplierDescValue: e.data.desc,
      chkIsActive: e.data.isActive,
      chkIsDirect: e.data.isDirect == null && false,
      stateUpdateDelete: true,
      RowSelected: e.data,
      txtSupplierMinOrderWeightValue:e.data.minOrderWeight,
      txtSupplierMaxOrderWeightValue:e.data.maxOrderWeight,
      txtSupplierMinOrderRialiValue:e.data.minOrderRiali,
      txtSupplierMaxOrderRialiValue:e.data.maxOrderRiali
    });
  };

  btnDelete_onClick = async () => {
    const data = {
      id: this.state.RowSelected.id,
      supplierName: this.state.txtSupplierNameValue,
      persianName: this.state.txtSupplierNamePersianValue,
      extSupplierId: null,
      desc: this.state.txtSupplierDescValue,
      isActive: this.state.chkIsActive,
      isDirect: this.state.chkIsDirect,
    };
    const MSG = await deleteSupplier(data, this.props.User.token);
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: MSG,
        Type: "success",
      },
    });
    this.fn_updateGrid();
  }

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
              <Col xs="auto">
                <Label className="standardLabelFont">نام تامین کننده</Label>
                <TextBox
                  value={this.state.txtSupplierNameValue}
                  showClearButton={true}
                  placeholder="نام تامین کننده"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtSupplierName_onChanege}
                />
                <Row>
                  <Label
                    id="errSupplierName"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نام فارسی</Label>
                <TextBox
                  value={this.state.txtSupplierNamePersianValue}
                  showClearButton={true}
                  placeholder="نام فارسی تامین کننده"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtSupplierNamePersian_onChanege}
                />
                <Row>
                  <Label
                    id="errSupplierNamePersian"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">توضیحات</Label>
                <TextBox
                  value={this.state.txtSupplierDescValue}
                  showClearButton={true}
                  placeholder="توضیحات"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtSupplierDesc_onChanege}
                />
                <Row>
                  <Label
                    id="errSupplierDesc"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">حداقل وزنی</Label>
                <TextBox
                  value={this.state.txtSupplierMinOrderWeightValue}
                  showClearButton={true}
                  placeholder="حداقل وزنی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtSupplierMinOrderWeight_onChanege}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">حداکثر وزنی</Label>
                <TextBox
                  value={this.state.txtSupplierMaxOrderWeightValue}
                  showClearButton={true}
                  placeholder="حداکثر وزنی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtSupplierMaxOrderWeight_onChanege}
                />
              </Col>
              <Row>
                <Col xs="auto">
                  <Label className="standardLabelFont">حداقل ریالی</Label>
                  <TextBox
                    value={this.state.txtSupplierMinOrderRialiValue}
                    showClearButton={true}
                    placeholder="حداقل ریالی"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtSupplierMinOrderRiali_onChanege}
                  />
                </Col>
                <Col xs="auto">
                  <Label className="standardLabelFont">حداکثر ریالی</Label>
                  <TextBox
                    value={this.state.txtSupplierMaxOrderRialiValue}
                    showClearButton={true}
                    placeholder="حداکثر ریالی"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtSupplierMaxOrderRiali_onChanege}
                  />
                </Col>
              </Row>
            </Row>
            <Row>
              <Col xs="auto">
                <CheckBox
                  value={this.state.chkIsActive}
                  text="فعال"
                  rtlEnabled={true}
                  onValueChanged={this.chkIsActive_onChange}
                />
                <Row>
                  <Label
                    id="errSupplierIsActive"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <CheckBox
                  value={this.state.chkIsDirect}
                  text="دایرکتی"
                  rtlEnabled={true}
                  onValueChanged={this.chkIsDirect_onChange}
                />
                <Row>
                  <Label
                    id="errSupplierIsDirect"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
            </Row>
            {!this.state.stateUpdateDelete ? (
              <Row className="standardSpaceTop">
                {this.state.stateDisable_btnAdd && (
                  <Col xs="auto">
                    <Button
                      icon={SaveIcon}
                      text="ثبت"
                      type="success"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnAdd_onClick}
                    />
                  </Col>
                )}
              </Row>
            ) : (
              <Row className="standardSpaceTop">
                <Row>
                  {this.state.stateDisable_btnUpdate && (
                    <>
                      <Col xs="auto">
                        <Button
                          icon={UpdateIcon}
                          text="ذخیره تغییرات"
                          type="success"
                          stylingMode="contained"
                          rtlEnabled={true}
                          onClick={this.btnUpdate_onClick}
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          icon={DeleteIcon}
                          text="حذف"
                          type="danger"
                          stylingMode="contained"
                          rtlEnabled={true}
                          onClick={this.btnDelete_onClick}
                        />
                      </Col>
                    </>
                  )}
                </Row>
              </Row>
            )}
            <Row>
              <Col>
                <p
                  id="ErrorUpdatePosition"
                  style={{ textAlign: "right", color: "red" }}
                ></p>
              </Col>
            </Row>
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
                  onRowClick={this.grdSupplier_onClickRow}
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
