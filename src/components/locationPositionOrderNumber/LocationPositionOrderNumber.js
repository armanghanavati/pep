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
  RowDragging,
} from "devextreme-react/data-grid";
import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  DataGridDefaultHeight,
  ToastTime,
  ToastWidth,
} from "../../config/config";
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
import { location } from "../../redux/reducers/location/location-actions";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import { ElevenMp } from "@mui/icons-material";
import { userLocationList } from "../../redux/reducers/user/user-actions";

class LocationPositionOrderNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txtMaxOrderNumberValue: null,
      txtMaxOutRouteNumberValue: null,
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
      PositionList: await positionList(
        companyId,
        this.props.User.token
      ),
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
    this.setState({
      LocationGroupId:e,
      LocationList: await location(e, this.props.User.token),
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

  grdLocationPositionOrderNumber_onClickRow = async(e) => {
    this.setState({
      LocationList: await location(e.data.locationId, this.props.User.token),
    })
    
    this.fn_positionList(this.props.Company.currentCompanyId);
    this.fn_locationGroupList(this.props.Company.currentCompanyId);

    this.setState({
      txtMaxOrderNumberValue: e.data.maxOrderNumber,
      txtMaxOutRouteNumberValue: e.data.maxOutRouteNumber,
      stateUpdateDelete: true,
      RowSelected: e.data,
      PositionId: e.data.positionId,
      LocationGroupId: e.data.locationId, 
      LocationId:e.data.locationId
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
        maxOrderNumber:this.state.txtMaxOrderNumberValue,
        maxOutRouteNumber:this.state.txtMaxOutRouteNumberValue
      };

      const RESULT = await updateLocationPositionOrderNumber(data, this.props.User.token);
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

  txtMaxOutRouteNumber_onChange = (e) => {
    this.setState({
      txtMaxOutRouteNumberValue: e.value,
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
              <Col>
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
              <Col>
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
              <Col>
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
                  تعداد مجاز ویرایش سفارش
                </Label>
                <TextBox
                  value={this.state.txtMaxOrderNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز ویرایش سفارش"
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
                  تعداد مجاز ویرایش سفارشات بدون برنامه ریزی
                </Label>
                <TextBox
                  value={this.state.txtMaxOutRouteNumberValue}
                  showClearButton={true}
                  placeholder="تعداد مجاز ویرایش  سفارشات بدون برنامه ریزی"
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
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label className="title">
                لیست تعداد مجاز ثبت درخواست فروشگاه
              </Label>
            </Row>
            <Row>
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
        </Card>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(LocationPositionOrderNumber);
