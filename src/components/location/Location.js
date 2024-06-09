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
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
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
  updateLocation,
  addLocation,
  locationList,
  deleteLocation,
} from "../../redux/reducers/location/location-actions";
import {
  stateList
} from "../../redux/reducers/state/state-actions";
import {
  cityList
} from "../../redux/reducers/city/city-actions";
import { locationTypeList } from "../../redux/reducers/locationType/locationType-action";
import companySlice, {
  companyActions,
} from "../../redux/reducers/company/company-slice";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { DataGridLocationColumns } from "./Location-config";
import { Gfn_ExportToExcel } from "../../utiliy/GlobalMethods";

import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import { th } from "date-fns-jalali/locale";

class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LocationGridData: null,
      Id: null,
      LocationId: null,
      txtCodeValue: null,
      txtLocationNameValue: null,
      txtPersianNameValue: null,
      txtDescValue: null,
      LocationTypeId: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_btnDelete: false,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      Location: null,
      chkIsActive: null,
      Company: null,
      LocationType: null,
      stateDisable_txtCode: false,
      RowSelected: null,
      cmbState: null,
      cmbStateValue: null,
      cmbCity: null,
      cmbCityValue: null,
      txtGradeValue: null
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    await this.fn_stateList();
    this.fn_updateGrid();
    await this.locationTypes();
    await this.fn_locationList();
  }

  fn_locationList = async () => {
    this.setState({
      Location: await locationList(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };
  fn_updateGrid = async () => {
    if (this.state.stateDisable_show) {
      this.setState({
        LocationGridData: await locationList(
          this.props.Company.currentCompanyId,
          this.props.User.token
        ),
      });
    }
  };

  fn_stateList = async () => {
    this.setState({
      cmbState: await stateList(this.props.User.token)
    })
  }

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
  }

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "location.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "location.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "location.show":
            this.setState({ stateDisable_show: true });
            break;
          case "location.delete":
            this.setState({ stateDisable_btnDelete: true });
            break;
        }
      }
  };

  grdLocation_onClickRow = async (e) => {
    if (e.data.stateId != null)
      this.setState({
        cmbCity: await cityList(e.data.stateId, this.props.User.token)
      })

    this.setState({
      Id: e.data.id,
      txtCodeValue: e.data.code,
      LocationId: e.data.locationId,
      txtLocationNameValue: e.data.locationName,
      txtPersianNameValue: e.data.persianName,
      txtDescValue: e.data.desc,
      LocationTypeId: e.data.locationTypeId,
      chkIsActive: e.data.isActive,
      stateUpdateDelete: true,
      stateDisable_txtCode: true,
      RowSelected: e.data,
      cmbStateValue: e.data.stateId,
      cmbCityValue: e.data.cityId
    });
  };

  btnNew_onClick = () => {
    this.setState({
      txtLocationNameValue: null,
      txtPersianNameValue: null,
      txtDescValue: null,
      stateUpdateDelete: false,
      stateDisable_txtCode: false,
      LocationTypeId: null,
      LocationId: null,
      chkIsActive: null,
      cmbStateValue: null,
      cmbCityValue: null,
      txtCodeValue: null
    });
  };

  chkIsActive_onChange = (e) => {
    this.setState({
      chkIsActive: e.value,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errLocationName").innerHTML = "";
    document.getElementById("errPersianName").innerHTML = "";
    document.getElementById("errCity").innerHTML = "";
    document.getElementById("errCode").innerHTML = "";
    document.getElementById("errGrade").innerHTML = "";
    if (this.state.txtLocationNameValue == null) {
      document.getElementById("errLocationName").innerHTML =
        "نام  محل را وارد نمائید";
      flag = false;
    }
    if (this.state.txtPersianNameValue == null) {
      document.getElementById("errPersianName").innerHTML =
        "نام فارسی را وارد نمائید";
      flag = false;
    }

    if (this.state.chkIsActive == null) {
      document.getElementById("errLocationIsActive").innerHTML =
        "فعال بودن را مشخص نمائید.";
      flag = false;
    }
    if (this.state.cmbCityValue == null) {
      document.getElementById("errCity").innerHTML =
        "شهر را مشخص نمائید";
      flag = false;
    }
    if (this.state.txtCodeValue == null) {
      document.getElementById("errCode").innerHTML =
        "کد را وارد نمائید";
      flag = false;
    }
    if (this.state.txtGradeValue == null) {
      document.getElementById("errGrade").innerHTML =
        "رتبه را وارد نمائید";
      flag = false;
    }
    return flag;
  };

  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        code: this.state.txtCodeValue,
        locationName: this.state.txtLocationNameValue,
        persianName: this.state.txtPersianNameValue,
        desc: this.state.txtDescValue,
        locationTypeId: this.state.LocationTypeId,
        locationId: this.state.LocationId,
        companyId: this.props.Company.currentCompanyId,
        isActive: this.state.chkIsActive,
        cityId: this.state.cmbCityValue,
        grade: this.state.txtGradeValue
      };
      const RESULT = await addLocation(data, this.props.User.token);
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
  txtCode_onChange = (e) => {
    this.setState({ txtCodeValue: e.value });
  };
  txtLocationName_onChange = (e) => {
    this.setState({ txtLocationNameValue: e.value });
  };

  txtPersianName_onChange = (e) => {
    this.setState({ txtPersianNameValue: e.value });
  };

  txtDesc_onChange = (e) => {
    this.setState({ txtDescValue: e.value });
  };

  txtGrade_onChange = (e) => {
    this.setState({ txtGradeValue: e.value })
  }

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        id: this.state.Id,
        locationName: this.state.txtLocationNameValue,
        persianName: this.state.txtPersianNameValue,
        desc: this.state.txtDescValue,
        locationTypeId: this.state.LocationTypeId,
        locationId: this.state.LocationId,
        companyId: this.props.Company.currentCompanyId,
        isActive: this.state.chkIsActive,
        cityId: this.state.cmbCityValue,
        grade: this.state.txtGradeValue
      };
      const RESULT = await updateLocation(data, this.props.User.token);
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

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  cmbLocationType_onChange = (e) => {
    this.setState({
      LocationTypeId: e,
    });
  };

  cmbLocation_onChange = (e) => {
    this.setState({
      LocationId: e,
    });
  };

  cmbCity_onChange = (e) => {
    this.setState({
      cmbCityValue: e
    });
  }

  cmbState_onChange = async (e) => {
    this.setState({
      cmbStateValue: e,
      cmbCity: await cityList(e, this.props.User.token)
    })
  }

  locationTypes = async () => {
    this.setState({
      LocationType: await locationTypeList(this.props.User.token),
    });
  };

  btnDelete_onClick = async () => {
    const MSG = await deleteLocation(
      this.state.RowSelected.id,
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

  btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(this.state.LocationGridData, "Locations")
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
              <Label>محل</Label>
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
                <Label className="standardLabelFont">کد</Label>
                <TextBox
                  value={this.state.txtCodeValue}
                  showClearButton={true}
                  placeholder="کد"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtCode_onChange}
                  disabled={this.state.stateDisable_txtCode}
                />
                <Label id="errCode" className="standardLabelFont errMessage" />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نوع محل</Label>
                <SelectBox
                  dataSource={this.state.LocationType}
                  displayExpr="persianName"
                  placeholder="انتخاب نوع محل"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbLocationType_onChange}
                  value={this.state.LocationTypeId}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">زیر گروه محل</Label>
                <SelectBox
                  dataSource={this.state.Location}
                  displayExpr="locationName"
                  placeholder="زیر گروه محل"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbLocation_onChange}
                  value={this.state.LocationId}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">استان</Label>
                <SelectBox
                  dataSource={this.state.cmbState}
                  displayExpr="name"
                  placeholder="استان"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbState_onChange}
                  value={this.state.cmbStateValue}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">شهر</Label>
                <SelectBox
                  dataSource={this.state.cmbCity}
                  displayExpr="name"
                  placeholder="شهر"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbCity_onChange}
                  value={this.state.cmbCityValue}
                />
                <Label id="errCity" className="standardLabelFont errMessage" />
              </Col>
              <Row>
                <Col xs="auto">
                  <Label className="standardLabelFont">نام محل</Label>
                  <TextBox
                    value={this.state.txtLocationNameValue}
                    showClearButton={true}
                    placeholder="نام محل"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtLocationName_onChange}
                  />
                  <Row>
                    <Label
                      id="errLocationName"
                      className="standardLabelFont errMessage"
                    />
                  </Row>
                </Col>
                <Col xs="auto">
                  <Label className="standardLabelFont">نام فارسی محل</Label>
                  <TextBox
                    value={this.state.txtPersianNameValue}
                    showClearButton={true}
                    placeholder="نام فارسی موقعیت"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtPersianName_onChange}
                  />
                  <Row>
                    <Label
                      id="errPersianName"
                      className="standardLabelFont errMessage"
                    />
                  </Row>
                </Col>
                <Col xs="auto">
                  <Label className="standardLabelFont">توضیحات</Label>
                  <TextBox
                    value={this.state.txtDescValue}
                    showClearButton={true}
                    placeholder="توضیحات"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtDesc_onChange}
                  />
                </Col>
                <Col xs="auto">
                  <Label className="standardLabelFont">رتبه</Label>
                  <TextBox
                    value={this.state.txtGradeValue}
                    showClearButton={true}
                    placeholder="رتبه"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtGrade_onChange}
                  />
                  <Row>
                    <Label
                      id="errGrade"
                      className="standardLabelFont errMessage"
                    />
                  </Row>
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
                    id="errLocationIsActive"
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
                  )}
                  {this.state.stateDisable_btnDelete && (
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
                  )}
                </Row>
              </Row>
            )}
            <Row>
              <Col>
                <p
                  id="ErrorUpdateLocation"
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
              <Label className="title">لیست محل ها</Label>
            </Row>
            <Row style={{ direction: 'ltr' }}>
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
            <Row>
              <Col xs="auto" className="standardPadding">
                <DataGrid
                  dataSource={this.state.LocationGridData}
                  defaultColumns={DataGridLocationColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowClick={this.grdLocation_onClickRow}
                  height={DataGridDefaultHeight}
                  className="fontStyle"
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
  Location: state.locations,
});

export default connect(mapStateToProps)(Location);
