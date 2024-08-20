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
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
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
  RowDragging,
} from "devextreme-react/data-grid";
import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  ToastTime,
  ToastWidth,
  DataGridDefaultHeight,
} from "../../config/config";
import { Gfn_ExportToExcel } from "../../utiliy/GlobalMethods";
import {
  pepObjectList,
  addPepObject,
  deletePepObject,
  updatePepObject,
} from "../../redux/reducers/pepObject/pepObject-actions";
import { treeTypeList } from "../../redux/reducers/treeType/treeType-actions";
import { DataGridPepObjectColumns } from "../pepObject/PepObject-config";
import { locationList } from "../../redux/reducers/location/location-actions";
import { positionList } from "../../redux/reducers/position/position-actions";
import {
  locationPositionOrderNumberList,
  addLocationPositionOrderNumber,
  updateLocationPositionOrderNumber,
  deleteLocationPositionOrderNumber,
} from "../../redux/reducers/locationPositionOrderNumber/locationPositionOrderNumber-actions";
import { DataGridLocationPositionOrderNumberColumns } from "./LocationPositionOrderNumber-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { location } from "../../redux/reducers/location/location-actions";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import { ElevenMp } from "@mui/icons-material";
import { userLocationList } from "../../redux/reducers/user/user-actions";
import TableOrderNumb from "./TableOrderNumb";

class LocationPositionOrderNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txtMaxOrderNumberValue: null,
      txtMaxOutRouteNumberValue: null,
      txtMaxIncEditOrderNumberValue: null,
      txtMaxNewInventoryOrderNumberValue: null,
      txtMaxZeroInventoryOrderNumberValue: null,
      txtMaxDecEditSupplierOrderNumberValue: null,
      txtMaxIncEditSupplierOrderNumberValue: null,
      txtMaxNewSupplierOrderNumberValue: null,
      txtMaxZeroSupplierOrderNumberValue: null,
      txtMaxOutRouteSupplierOrderNumberValue: null,
      LocationId: null,
      PositionId: null,
      RowSelected: null,
      LocationPositionOrderNumberGridData: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      LocationGroupId: null,
      LocationGroupList: null,
      LocationList: null,
      PositionList: null,
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    await this.fn_locationGroupList(this.props.Company.currentCompanyId);
    await this.fn_positionList(this.props.Company.currentCompanyId);
    this.fn_updateGrid();
  }

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "locationPositionOrderNumber.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "locationPositionOrderNumber.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "locationPositionOrderNumber.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  fn_CheckRequireState = async () => {
    if (this.props.Company.currentCompanyId == null) {
      const companyCombo = await companyListCombo(this.props.User.token);
      if (companyCombo !== null) {
        const currentCompanyId = companyCombo[0].id;
        this.props.dispatch(
          companyActions.setCurrentCompanyId({
            currentCompanyId,
          })
        );
      }
      this.props.dispatch(
        companyActions.setCompanyCombo({
          companyCombo,
        })
      );
    }
  };

  fn_locationGroupList = async (companyId) => {
    this.setState({
      LocationGroupList: await userLocationList(
        this.props.User.userId,
        companyId,
        this.props.User.token
      ),
    });
  };
  fn_positionList = async (companyId) => {
    this.setState({
      PositionList: await positionList(companyId, this.props.User.token),
    });
  };

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show)
      this.setState({
        LocationPositionOrderNumberGridData:
          await locationPositionOrderNumberList(
            this.props.Company.currentCompanyId,
            this.props.User.token
          ),
      });
  };

  cmbLocationGroup_onChange = async (e) => {
    // const LOCATION=await location(e, this.props.User.token)
    let tempLocationGroups = this.state.LocationGroupList;
    let tempLocations = [];
    for (let i = 0; i < tempLocationGroups.length; i++)
      if (tempLocationGroups[i].id == e) {
        tempLocations.push(tempLocationGroups[i]);
        break;
      }

    this.setState({
      LocationGroupId: e,
      LocationList: tempLocations,
    });
  };

  cmbLocation_onChange = (e) => {
    this.setState({
      LocationId: e,
    });
  };
  cmbPosition_onChange = (e) => {
    this.setState({
      PositionId: e,
    });
  };

  grdLocationPositionOrderNumber_onClickRow = async (e) => {
    const LOCATIONS = [{ id: e.data.locationId, label: e.data.locationName }];
    this.setState({
      LocationList: LOCATIONS, //await location(e.data.locationId, this.props.User.token),
    });

    // this.fn_positionList(this.props.Company.currentCompanyId);
    // this.fn_locationGroupList(this.props.Company.currentCompanyId);

    this.setState({
      txtMaxOrderNumberValue: e.data.maxOrderNumber,
      txtMaxOutRouteNumberValue: e.data.maxOutRouteNumber,
      txtMaxIncEditOrderNumberValue: e.data.maxIncEditOrderNumber,
      txtMaxNewInventoryOrderNumberValue: e.data.maxNewInventoryOrderNumber,
      txtMaxZeroInventoryOrderNumberValue: e.data.maxZeroInventoryOrderNumber,
      txtMaxDecEditSupplierOrderNumberValue:
        e.data.maxDecEditSupplierOrderNumber,
      txtMaxIncEditSupplierOrderNumberValue:
        e.data.maxIncEditSupplierOrderNumber,
      txtMaxNewSupplierOrderNumberValue: e.data.maxNewSupplierOrderNumber,
      txtMaxZeroSupplierOrderNumberValue: e.data.maxZeroSupplierOrderNumber,
      txtMaxOutRouteSupplierOrderNumberValue:
        e.data.maxOutRouteSupplierOrderNumber,
      stateUpdateDelete: true,
      RowSelected: e.data,
      PositionId: e.data.positionId,
      LocationGroupId: e.data.locationId,
      LocationId: e.data.locationId,
    });
  };

  btnNew_onClick = () => {
    this.setState({
      txtMaxOrderNumberValue: null,
      txtMaxOutRouteNumberValue: null,
      LocationGroupId: null,
      LocationId: null,
      PositionId: null,
      stateUpdateDelete: false,
    });
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        locationId: this.state.LocationId,
        positionId: this.state.PositionId,
        maxOrderNumber: parseInt(this.state.txtMaxOrderNumberValue),
        maxOutRouteNumber: parseInt(this.state.txtMaxOutRouteNumberValue),
        maxIncEditOrderNumber: parseInt(
          this.state.txtMaxIncEditOrderNumberValue
        ),
        maxNewInventoryOrderNumber: parseInt(
          this.state.txtMaxNewInventoryOrderNumberValue
        ),
        maxZeroInventoryOrderNumber: parseInt(
          this.state.txtMaxZeroInventoryOrderNumberValue
        ),
        maxDecEditSupplierOrderNumber: parseInt(
          this.state.txtMaxDecEditSupplierOrderNumberValue
        ),
        maxIncEditSupplierOrderNumber: parseInt(
          this.state.txtMaxIncEditSupplierOrderNumberValue
        ),
        maxNewSupplierOrderNumber: parseInt(
          this.state.txtMaxNewSupplierOrderNumberValue
        ),
        maxZeroSupplierOrderNumber: parseInt(
          this.state.txtMaxZeroSupplierOrderNumberValue
        ),
        maxOutRouteSupplierOrderNumber: parseInt(
          this.state.txtMaxOutRouteSupplierOrderNumberValue
        ),
      };

      const RESULT = await updateLocationPositionOrderNumber(
        data,
        this.props.User.token
      );
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
          Type: RESULT > 0 ? "success" : "error",
        },
      });
      this.fn_updateGrid();
    }
  };

  txtMaxOrderNumber_onChange = (e) => {
    this.setState({
      txtMaxOrderNumberValue: e.value,
    });
  };

  txtMaxIncEditOrderNumber_onChange = (e) => {
    this.setState({
      txtMaxIncEditOrderNumberValue: e.value,
    });
  };

  txtMaxZeroInventoryOrderNumber_onChange = (e) => {
    this.setState({
      txtMaxZeroInventoryOrderNumberValue: e.value,
    });
  };

  txtMaxNewInventoryOrderNumber_onChange = (e) => {
    this.setState({
      txtMaxNewInventoryOrderNumberValue: e.value,
    });
  };

  txtMaxOutRouteNumber_onChange = (e) => {
    this.setState({
      txtMaxOutRouteNumberValue: e.value,
    });
  };

  txtMaxDecEditSupplierOrderNumber_onChange = (e) => {
    this.setState({
      txtMaxDecEditSupplierOrderNumberValue: e.value,
    });
  };

  txtMaxIncEditSupplierOrderNumber_onChange = (e) => {
    this.setState({
      txtMaxIncEditSupplierOrderNumberValue: e.value,
    });
  };

  txtMaxNewSupplierOrderNumber_onChange = (e) => {
    this.setState({
      txtMaxNewSupplierOrderNumberValue: e.value,
    });
  };

  txtMaxZeroSupplierOrderNumber_onChange = (e) => {
    this.setState({
      txtMaxZeroSupplierOrderNumberValue: e.value,
    });
  };

  txtMaxOutRouteSupplierOrderNumber_onChange = (e) => {
    this.setState({
      txtMaxOutRouteSupplierOrderNumberValue: e.value,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errLocationGroup").innerHTML = "";
    document.getElementById("errLocation").innerHTML = "";
    document.getElementById("errPosition").innerHTML = "";
    document.getElementById("errMaxOrderNumber").innerHTML = "";
    document.getElementById("errMaxOutRouteNumber").innerHTML = "";

    if (this.state.LocationGroupId == null) {
      document.getElementById("errLocationGroup").innerHTML =
        "نام گروه فروشگاه را انتخاب نمائید";
      flag = false;
    }
    if (this.state.LocationId == null) {
      document.getElementById("errLocation").innerHTML =
        " نام فروشگاه را انتخاب نمایید.";
      flag = false;
    }
    if (this.state.PositionId == null) {
      document.getElementById("errPosition").innerHTML =
        "سمت را انتخاب نمائید.";
      flag = false;
    }
    if (this.state.txtMaxOrderNumberValue == null) {
      document.getElementById("errMaxOrderNumber").innerHTML =
        "تعداد مجاز ویرایش سفارش را مشخص نمائید.";
      flag = false;
    }
    if (this.state.txtMaxOutRouteNumberValue == null) {
      document.getElementById("errMaxOutRouteNumber").innerHTML =
        "تعداد مجاز ویرایش سفارش بدون برنامه ریزی را مشخص نمائید.";
      flag = false;
    }
    return flag;
  };

  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        locationId: this.state.LocationId,
        positionId: this.state.PositionId,
        maxOrderNumber: parseInt(this.state.txtMaxOrderNumberValue),
        maxOutRouteNumber: parseInt(this.state.txtMaxOutRouteNumberValue),
        maxIncEditOrderNumber: parseInt(
          this.state.txtMaxIncEditOrderNumberValue
        ),
        maxNewInventoryOrderNumber: parseInt(
          this.state.txtMaxNewInventoryOrderNumberValue
        ),
        maxZeroInventoryOrderNumber: parseInt(
          this.state.txtMaxZeroInventoryOrderNumberValue
        ),
        maxDecEditSupplierOrderNumber: parseInt(
          this.state.txtMaxDecEditSupplierOrderNumberValue
        ),
        maxIncEditSupplierOrderNumber: parseInt(
          this.state.txtMaxIncEditSupplierOrderNumberValue
        ),
        maxNewSupplierOrderNumber: parseInt(
          this.state.txtMaxNewSupplierOrderNumberValue
        ),
        maxZeroSupplierOrderNumber: parseInt(
          this.state.txtMaxZeroSupplierOrderNumberValue
        ),
        maxOutRouteSupplierOrderNumber: parseInt(
          this.state.txtMaxOutRouteSupplierOrderNumberValue
        ),
      };
      const RESULT = await addLocationPositionOrderNumber(
        data,
        this.props.User.token
      );
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت",
          Type: RESULT != null ? "success" : "error",
        },
      });
      this.fn_updateGrid();
    }
  };

  btnDelete_onClick = async () => {
    const MSG = await deleteLocationPositionOrderNumber(
      this.state.LocationId,
      this.state.PositionId,
      this.props.User.token
    );
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: MSG,
        Type: "success",
      },
    });
    this.fn_updateGrid();
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(
      this.state.LocationPositionOrderNumberGridData,
      "LocationPositionOrderNumber"
    );
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
              <Label>آیتم</Label>
            </Row>
            {this.state.stateDisable_btnAdd && (
              <Row>
                <Col>
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
                <Label className="standardLabelFont">نام گروه فروشگاه</Label>
                <SelectBox
                  dataSource={this.state.LocationGroupList}
                  displayExpr="label"
                  placeholder="نام گروه فروشگاه"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbLocationGroup_onChange}
                  value={this.state.LocationGroupId}
                />
                <Row>
                  <Label
                    id="errLocationGroup"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نام فروشگاه</Label>
                <SelectBox
                  dataSource={this.state.LocationList}
                  displayExpr="label"
                  placeholder="نام فروشگاه"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbLocation_onChange}
                  value={this.state.LocationId}
                />
                <Row>
                  <Label
                    id="errLocation"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">سمت</Label>
                <SelectBox
                  dataSource={this.state.PositionList}
                  displayExpr="positionName"
                  placeholder="سمت"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbPosition_onChange}
                  value={this.state.PositionId}
                />
                <Row>
                  <Label
                    id="errPosition"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد مجاز ویرایش (کم کردن) سفارش انباری
                </Label>
                <TextBox
                  value={this.state.txtMaxOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز ویرایش (کم کردن) سفارش انباری"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtMaxOrderNumber_onChange}
                />
                <Row>
                  <Label
                    id="errMaxOrderNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد مجاز ویرایش (افزایش دادن) سفارش انباری
                </Label>
                <TextBox
                  value={this.state.txtMaxIncEditOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز ویرایش (افزایش دادن) سفارش انباری"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtMaxIncEditOrderNumber_onChange}
                />
                <Row>
                  <Label
                    id="errMaxIncEditOrderNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد مجاز سفارش جدید انباری
                </Label>
                <TextBox
                  value={this.state.txtMaxNewInventoryOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز سفارش جدید انباری"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtMaxNewInventoryOrderNumber_onChange}
                />
                <Row>
                  <Label
                    id="errMaxNewInventoryOrderNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد مجاز صفر کردن سفارشات انباری
                </Label>
                <TextBox
                  value={this.state.txtMaxZeroInventoryOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز صفر کردن سفارشات انباری"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtMaxZeroInventoryOrderNumber_onChange}
                />
                <Row>
                  <Label
                    id="errMaxZeroInventoryOrderNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد سفارشات خارج از مسیر انباری
                </Label>
                <TextBox
                  value={this.state.txtMaxOutRouteNumberValue}
                  showClearButton={true}
                  placeholder="تعداد سفارشات خارج از مسیر انباری"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtMaxOutRouteNumber_onChange}
                />
                <Row>
                  <Label
                    id="errMaxOutRouteNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
            </Row>
            {/* -------------------------------دایرکتی------------------------------- */}
            <Row>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد مجاز ویرایش (کم کردن) سفارش دایرکتی
                </Label>
                <TextBox
                  value={this.state.txtMaxDecEditSupplierOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز ویرایش (کم کردن) سفارش دایرکتی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={
                    this.txtMaxDecEditSupplierOrderNumber_onChange
                  }
                />
                <Row>
                  <Label
                    id="errMaxDecEditSupplierOrderNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد مجاز ویرایش (افزایش دادن) سفارش دایرکتی
                </Label>
                <TextBox
                  value={this.state.txtMaxIncEditSupplierOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز ویرایش  سفارشات بدون برنامه ریزی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={
                    this.txtMaxIncEditSupplierOrderNumber_onChange
                  }
                />
                <Row>
                  <Label
                    id="errMaxIncEditSupplierOrderNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد مجاز سفارش جدید دایرکتی
                </Label>
                <TextBox
                  value={this.state.txtMaxNewSupplierOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز سفارش جدید دایرکتی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtMaxNewSupplierOrderNumber_onChange}
                />
                <Row>
                  <Label
                    id="errMaxNewSupplierOrderNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد مجاز صفر کردن سفارشات دایرکتی
                </Label>
                <TextBox
                  value={this.state.txtMaxZeroSupplierOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز صفر کردن سفارشات دایرکتی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtMaxZeroSupplierOrderNumber_onChange}
                />
                <Row>
                  <Label
                    id="errMaxZeroSupplierOrderNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">
                  تعداد مجاز سفارشات خارج از مسیر
                </Label>
                <TextBox
                  value={this.state.txtMaxOutRouteSupplierOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز سفارشات خارج از مسیر"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={
                    this.txtMaxOutRouteSupplierOrderNumber_onChange
                  }
                />
                <Row>
                  <Label
                    id="errMaxOutRouteSupplierOrderNumber"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
            </Row>
            {!this.state.stateUpdateDelete ? (
              <Row>
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
                  id="ErrorUpdateUser"
                  style={{ textAlign: "right", color: "red" }}
                ></p>
              </Col>
            </Row>
          </Row>
        </Card>
        <p></p>
        <TableOrderNumb
          LocationPositionOrderNumberGridData={
            this.state.LocationPositionOrderNumberGridData
          }
          grdLocationPositionOrderNumber_onClickRow={
            this.grdLocationPositionOrderNumber_onClickRow
          }
          btnExportExcel_onClick={this.btnExportExcel_onClick}
        />
        {/* <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label className="title">
                لیست تعداد مجاز ثبت درخواست فروشگاه
              </Label>
            </Row>
            <Row style={{ direction: "ltr" }}>
              <Col xs="auto">
                <Button
                  icon={ExportExcelIcon}
                  type="default"
                  stylingMode="contained"
                  rtlEnabled={true}
                  onClick={this.btnExportExcel_onClick}
                />
              </Col>
            </Row>
            <Row className="standardSpaceTop">
              <Col xs="auto" className="standardMarginRight">
                <DataGrid
                  dataSource={this.state.LocationPositionOrderNumberGridData}
                  defaultColumns={DataGridLocationPositionOrderNumberColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowClick={this.grdLocationPositionOrderNumber_onClickRow}
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
        </Card> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(LocationPositionOrderNumber);
