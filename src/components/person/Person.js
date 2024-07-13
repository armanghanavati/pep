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
import { Gfn_ExportToExcel } from "../../utiliy/GlobalMethods";
import {
  updatePerson,
  addPerson,
  personLocationList,
  deletePerson,
} from "../../redux/reducers/person/person-actions";
import { positionActions } from "../../redux/reducers/position/position-slice";
import { locationList } from "../../redux/reducers/location/location-actions";
import { locationActions } from "../../redux/reducers/location/location-slice";
import { positionList } from "../../redux/reducers/position/position-actions";
import { companyList } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { DataGridPersonColumns } from "./Person-config";

import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";

class Person extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txtPersonalCodeValue: null,
      txtNameValue: null,
      txtFamilyValue: null,
      txtMobileValue: null,
      txtTarikhGhateHamkariValue: null,
      txtElateGhateHamkariValue: null,
      chkIsActive: null,
      RowSelected: null,
      PersonGridData: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      Location: null,
      Position: null,
      PositionId: null,
      LocationId: null,
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    this.fn_updateGrid();
    await this.fn_locationList(this.state.CompanyId);
    await this.fn_positionList(this.state.CompanyId);
  }

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show)
      this.setState({
        PersonGridData: await personLocationList(this.props.User.token),
      });
  };

  fn_positionList = async () => {
    this.setState({
      Position: await positionList(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  fn_locationList = async () => {
    this.setState({
      Location: await locationList(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "person.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "person.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "person.show":
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
  }

  grdPerson_onClickRow = (e) => {
    this.setState({
      txtPersonalCodeValue: e.data.personalCode,
      txtNameValue: e.data.name,
      txtFamilyValue: e.data.family,
      txtMobileValue: e.data.mobile,
      txtTarikhGhateHamkariValue: e.data.tarikhGhateHamkari,
      txtElateGhateHamkariValue: e.data.elateGhateHamkari,
      chkIsActive: e.data.isActive,
      stateUpdateDelete: true,
      RowSelected: e.data,
      PositionId: e.data.positionId,
      LocationId: e.data.locationId,
    });
  };

  btnNew_onClick = () => {
    this.setState({
      txtPersonalCodeValue: null,
      txtNameValue: null,
      txtFamilyValue: null,
      txtMobileValue: null,
      txtTarikhGhateHamkariValue: null,
      txtElateGhateHamkariValue: null,
      chkIsActive: null,
      stateUpdateDelete: false,
      PositionId: null,
      LocationId: null,
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
    //document.getElementById("errPersonalCode").innerHTML = "";
    document.getElementById("errPosition").innerHTML = "";
    document.getElementById("errLocation").innerHTML = "";
    document.getElementById("errPersonIsActive").innerHTML = "";

    // if (this.state.txtPersonalCodeValue == null) {
    //   document.getElementById("errPersonalCode").innerHTML =
    //     "کد کاربری را وارد نمائید";
    //   flag = false;
    // }
    if (this.state.PositionId == null) {
      document.getElementById("errPosition").innerHTML = "سمت را مشخص نمائید.";
      flag = false;
    }
    if (this.state.LocationId == null) {
      document.getElementById("errLocation").innerHTML = "محل را مشخص نمائید.";
      flag = false;
    }
    if (this.state.chkIsActive == null) {
      document.getElementById("errPersonIsActive").innerHTML =
        "فعال بودن را مشخص نمائید.";
      flag = false;
    }
    return flag;
  };
  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        personalCode: this.state.txtPersonalCodeValue,
        name: this.state.txtNameValue,
        family: this.state.txtFamilyValue,
        mobile: this.state.txtMobileValue,
        tarikhGhateHamkari: this.state.txtTarikhGhateHamkariValue,
        elateGhateHamkari: this.state.txtElateGhateHamkariValue,
        locationId: this.state.LocationId,
        positionId: this.state.PositionId,
        isActive: this.state.chkIsActive,
      };
      const RESULT = await addPerson(data, this.props.User.token);
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
  txtPersonalCode_onChange = (e) => {
    this.setState({ txtPersonalCodeValue: e.value });
  };
  txtName_onChange = (e) => {
    this.setState({ txtNameValue: e.value });
  };

  txtFamily_onChange = (e) => {
    this.setState({ txtFamilyValue: e.value });
  };

  txtMobile_onChange = (e) => {
    this.setState({ txtMobileValue: e.value });
  };

  txtTarikhGhateHamkari_onChange = (e) => {
    this.setState({ txtTarikhGhateHamkariValue: e.value });
  };

  txtElateGhateHamkari_onChange = (e) => {
    this.setState({ txtElateGhateHamkariValue: e.value });
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        id: this.state.RowSelected.id,
        personalCode: this.state.txtPersonalCodeValue,
        name: this.state.txtNameValue,
        family: this.state.txtFamilyValue,
        mobile: this.state.txtMobileValue,
        tarikhGhateHamkari: this.state.txtTarikhGhateHamkariValue,
        elateGhateHamkari: this.state.txtElateGhateHamkariValue,
        isActive: this.state.chkIsActive,
        locationId: this.state.LocationId,
        positionId: this.state.PositionId,
      };
      const RESULT = await updatePerson(data, this.props.User.token);
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

  btnDelete_onClick = async () => {
    const MSG = await deletePerson(
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
  cmbPosition_onChange = (e) => {
    this.setState({
      PositionId: e,
    });
  };

  cmbLocation_onChange = (e) => {
    this.setState({
      LocationId: e,
    });
  };

  btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(this.state.PersonGridData, "bsePersons");
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
              <Label>اشخاص</Label>
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
                <Label className="standardLabelFont">کد پرسنلی</Label>
                <TextBox
                  value={this.state.txtPersonalCodeValue}
                  showClearButton={true}
                  placeholder="کد پرسنلی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtPersonalCode_onChange}
                  disabled={this.state.stateDisable_txtPersonalCode}
                />
                {/* <Row>
                  <Label
                    id="errPersonalCode"
                    className="standardLabelFont errMessage"
                  />
                </Row> */}
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">سمت</Label>
                <SelectBox
                  dataSource={this.state.Position}
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
              <Col xs="auto">
                <Label className="standardLabelFont">محل</Label>
                <SelectBox
                  dataSource={this.state.Location}
                  displayExpr="locationName"
                  placeholder="محل"
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
                <Label className="standardLabelFont">نام</Label>
                <TextBox
                  value={this.state.txtNameValue}
                  showClearButton={true}
                  placeholder="نام"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtName_onChange}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نام خانوادگی</Label>
                <TextBox
                  value={this.state.txtFamilyValue}
                  showClearButton={true}
                  placeholder="نام خانوادگی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtFamily_onChange}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">شماره همراه</Label>
                <TextBox
                  value={this.state.txtMobileValue}
                  showClearButton={true}
                  placeholder="شماره همراه"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtMobile_onChange}
                />
              </Col>
              <Row>
                <Col xs="auto">
                  <Label className="standardLabelFont">تاریخ قطع همکاری</Label>
                  <TextBox
                    value={this.state.txtTarikhGhateHamkariValue}
                    showClearButton={true}
                    placeholder="تاریخ قطع همکاری"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtTarikhGhateHamkari_onChange}
                  />
                </Col>
                <Col xs="auto">
                  <Label className="standardLabelFont">علت قطع همکاری</Label>
                  <TextBox
                    value={this.state.txtElateGhateHamkariValue}
                    showClearButton={true}
                    placeholder="علت قطع همکاری"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtElateGhateHamkari_onChange}
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
                    id="errPersonIsActive"
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
                  id="ErrorUpdateCompany"
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
              <Label className="title">لیست اشخاص</Label>
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
            <Row className="standardSpaceTop">
              <Col xs="auto" className="standardMarginRight">
                <DataGrid
                  dataSource={this.state.PersonGridData}
                  defaultColumns={DataGridPersonColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowClick={this.grdPerson_onClickRow}
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
  Position: state.positions,
  Location: state.locations,
  Company: state.companies,
});

export default connect(mapStateToProps)(Person);
