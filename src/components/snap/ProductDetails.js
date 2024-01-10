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
  updateCompany,
  addCompany,
  companyList,
  deleteCompany,
} from "../../redux/reducers/company/company-actions";
import { DataGridCompanyColumns } from "./Company-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

class productDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txtCodeValue: null,
      txtCompanyNameValue: null,
      txtEconomicCodeValue: null,
      txtNationalCodeValue: null,
      txtCompanyTypeValue: null,
      txtAddressValue: null,
      chkIsActive: null,
      RowSelected: null,
      CompanyGridData: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      CompanyId: null,
      Company: null,
      stateDisable_txtCode: false,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    this.fn_updateGrid();
  }

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show)
      this.setState({
        CompanyGridData: await companyList(this.props.User.token),
      });
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "company.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "company.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "company.show":
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

  grdCompany_onClickRow = (e) => {
    this.setState({
      txtCodeValue: e.data.code,
      txtCompanyNameValue: e.data.companyName,
      txtEconomicCodeValue: e.data.economicCode,
      txtNationalCodeValue: e.data.nationalCode,
      txtAddressValue: e.data.address,
      txtCompanyTypeValue: e.data.companyType,
      chkIsActive: e.data.isActive,
      stateUpdateDelete: true,
      RowSelected: e.data,
      stateDisable_txtCode: true,
      CompanyId: e.data.id,
    });
  };

  btnNew_onClick = () => {
    this.setState({
      txtCodeValue: null,
      txtCompanyNameValue: null,
      txtEconomicCodeValue: null,
      txtNationalCodeValue: null,
      txtAddressValue: null,
      txtCompanyTypeValue: null,
      stateUpdateDelete: false,
      stateDisable_txtCode: false,
      chkIsActive: null,
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
    document.getElementById("errCompanyName").innerHTML = "";
    document.getElementById("errNationalCode").innerHTML = "";
    if (this.state.txtCompanyNameValue == null) {
      document.getElementById("errCompanyName").innerHTML =
        "نام را وارد نمائید";
      flag = false;
    }
    if (this.state.txtNationalCodeValue == null) {
      document.getElementById("errNationalCode").innerHTML =
        "کد ملی را وارد نمائید";
      flag = false;
    }

    if (this.state.chkIsActive == null) {
      document.getElementById("errCompanyIsActive").innerHTML =
        "فعال بودن را مشخص نمائید.";
      flag = false;
    }
    return flag;
  };
  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        code: this.state.txtCodeValue,
        companyName: this.state.txtCompanyNameValue,
        economicCode: this.state.txtEconomicCodeValue,
        nationalCode: this.state.txtNationalCodeValue,
        address: this.state.txtAddressValue,
        companyType: this.state.txtCompanyTypeValue,
        isActive: this.state.chkIsActive,
      };
      const RESULT = await addCompany(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت به دلیل تکراری بودن کد",
          Type: RESULT != null ? "success" : "error",
        },
      });
      this.fn_updateGrid();
    }
  };
  txtCode_onChange = (e) => {
    this.setState({ txtCodeValue: e.value });
  };
  txtCompanyName_onChange = (e) => {
    this.setState({ txtCompanyNameValue: e.value });
  };

  txtEconomicCode_onChange = (e) => {
    this.setState({ txtEconomicCodeValue: e.value });
  };

  txtNationalCode_onChange = (e) => {
    this.setState({ txtNationalCodeValue: e.value });
  };

  txtAddress_onChange = (e) => {
    this.setState({ txtAddressValue: e.value });
  };

  txtCompanyType_onChange = (e) => {
    this.setState({ txtCompanyTypeValue: e.value });
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        id: this.state.CompanyId,
        companyName: this.state.txtCompanyNameValue,
        economicCode: this.state.txtEconomicCodeValue,
        nationalCode: this.state.txtNationalCodeValue,
        address: this.state.txtAddressValue,
        companyType: this.state.txtCompanyTypeValue,
        isActive: this.state.chkIsActive,
      };

      const RESULT = await updateCompany(data, this.props.User.token);
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
    const MSG = await deleteCompany(
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
              <Label>شرکت</Label>
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
              </Col>
              <Col>
                <Label className="standardLabelFont">نام شرکت</Label>
                <TextBox
                  value={this.state.txtCompanyNameValue}
                  showClearButton={true}
                  placeholder="نام شرکت"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtCompanyName_onChange}
                />
                <Row>
                  <Label
                    id="errCompanyName"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col>
                <Label className="standardLabelFont">کد اقتصادی</Label>
                <TextBox
                  value={this.state.txtEconomicCodeValue}
                  showClearButton={true}
                  placeholder="کد اقتصادی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtEconomicCode_onChange}
                />
                <Row>
                  <Label
                    id="errEconomicCode"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col>
                <Label className="standardLabelFont">کد ملی</Label>
                <TextBox
                  value={this.state.txtNationalCodeValue}
                  showClearButton={true}
                  placeholder="کد ملی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtNationalCode_onChange}
                />
                <Row>
                  <Label
                    id="errNationalCode"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col>
                <Label className="standardLabelFont">آدرس</Label>
                <TextBox
                  value={this.state.txtAddressValue}
                  showClearButton={true}
                  placeholder="آدرس"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtAddress_onChange}
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">نوع شرکت</Label>
                <TextBox
                  value={this.state.txtCompanyTypeValue}
                  showClearButton={true}
                  placeholder="نوع شرکت"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtCompanyType_onChange}
                />
              </Col>
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
                    id="errCompanyIsActive"
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
              <Label className="title">لیست شرکت ها</Label>
            </Row>
            <Row>
              <Col xs="auto" className="standardMarginRight">
                <DataGrid
                  dataSource={this.state.CompanyGridData}
                  defaultColumns={DataGridCompanyColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowClick={this.grdCompany_onClickRow}
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

export default connect(mapStateToProps)(productDetails);
