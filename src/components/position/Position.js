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
  updatePosition,
  addPosition,
  positionList,
  deletePosition,
} from "../../redux/reducers/position/position-actions";
import companySlice, {
  companyActions,
} from "../../redux/reducers/company/company-slice";
import { positionActions } from "../../redux/reducers/position/position-slice";
import { companyList } from "../../redux/reducers/company/company-actions";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { DataGridPositionColumns } from "./Position-config";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

class Position extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PositionGridData: null,
      txtCodeValue: null,
      Id: null,
      txtPositionNameValue: null,
      txtDescValue: null,
      PositionId: null,
      RowSelected: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      chkIsActive: null,
      stateDisable_txtCode: false,
      Position: null,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    this.fn_updateGrid();
    await this.fn_positionList();
  }

  fn_positionList = async () => {
    this.setState({
      Position: await positionList(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show) {
      this.setState({
        PositionGridData: await positionList(
          this.props.Company.currentCompanyId,
          this.props.User.token
        ),
      });
    }
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "position.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "position.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "position.show":
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

  grdPosition_onClickRow = (e) => {
    this.setState({
      txtCodeValue: e.data.code,
      Id: e.data.id,
      PositionId: e.data.positionId,
      txtPositionNameValue: e.data.positionName,
      txtDescValue: e.data.desc,
      RowSelected: e.data,
      stateUpdateDelete: true,
      chkIsActive: e.data.isActive,
      stateDisable_txtCode: true,
    });
  };

  btnNew_onClick = () => {
    this.setState({
      txtPositionNameValue: null,
      txtDescValue: null,
      stateUpdateDelete: false,
      stateDisable_txtCode: false,
      PositionId: null,
      LocationId: null,
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
    document.getElementById("errPositionName").innerHTML = "";
    if (this.state.txtPositionNameValue == null) {
      document.getElementById("errPositionName").innerHTML =
        "نام  سمت را وارد نمائید";
      flag = false;
    }

    if (this.state.chkIsActive == null) {
      document.getElementById("errPositionIsActive").innerHTML =
        "فعال بودن را مشخص نمائید.";
      flag = false;
    }
    return flag;
  };

  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        code: this.state.txtCodeValue,
        positionId: this.state.PositionId,
        positionName: this.state.txtPositionNameValue,
        desc: this.state.txtDescValue,
        companyId: this.props.Company.currentCompanyId,
        isActive: this.state.chkIsActive,
      };
      const RESULT = await addPosition(data, this.props.User.token);
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
  txtPositionName_onChange = (e) => {
    this.setState({ txtPositionNameValue: e.value });
  };

  txtDesc_onChange = (e) => {
    this.setState({ txtDescValue: e.value });
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        id: this.state.Id,
        positionId: this.state.PositionId,
        positionName: this.state.txtPositionNameValue,
        desc: this.state.txtDescValue,
        isActive: this.state.chkIsActive,
        companyId: this.props.Company.currentCompanyId,
      };
      const RESULT = await updatePosition(data, this.props.User.token);
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

  cmbPosition_onChange = (e) => {
    this.setState({
      PositionId: e,
    });
  };

  btnDelete_onClick = async () => {
    const MSG = await deletePosition(
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
              <Label>سمت</Label>
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
                <Label className="standardLabelFont">زیر گروه سمت</Label>
                <SelectBox
                  dataSource={this.state.Position}
                  displayExpr="positionName"
                  placeholder="گروه سمت"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbPosition_onChange}
                  value={this.state.PositionId}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نام سمت</Label>
                <TextBox
                  value={this.state.txtPositionNameValue}
                  showClearButton={true}
                  placeholder="نام سمت"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtPositionName_onChange}
                />
                <Label
                  id="errPositionName"
                  className="standardLabelFont errMessage"
                />
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
                    id="errPositionIsActive"
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
              <Label className="title">لیست سمت ها</Label>
            </Row>

            <Row>
              <Col xs="auto" className="standardPadding">
                <DataGrid
                  dataSource={this.state.PositionGridData}
                  defaultColumns={DataGridPositionColumns}
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
  Company: state.companies,
  Position: state.positions,
});

export default connect(mapStateToProps)(Position);
