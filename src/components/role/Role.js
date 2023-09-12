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
  updateRole,
  addRole,
  roleList,
  deleteRole,
} from "../../redux/reducers/role/role-actions";
import { DataGridRoleColumns } from "./Role-config";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

class Role extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RoleGridData: null,
      txtRoleNameValue: null,
      Id: null,
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
      Role: null,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_updateGrid();
  }

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show) {
      this.setState({
        RoleGridData: await roleList(this.props.User.token),
      });
    }
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "role.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "role.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "role.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  grdRole_onClickRow = (e) => {
    this.setState({
      txtRoleNameValue: e.data.name,
      RowSelected: e.data,
      stateUpdateDelete: true,
      stateDisable_txtCode: true,
    });
  };

  btnNew_onClick = () => {
    this.setState({
      txtRoleNameValue: null,
      stateUpdateDelete: false,
      chkIsActive: null,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errRoleName").innerHTML = "";
    if (this.state.txtRoleNameValue == null) {
      document.getElementById("errRoleName").innerHTML =
        "نام  نقش را وارد نمائید";
      flag = false;
    }
    return flag;
  };

  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        name: this.state.txtRoleNameValue,
      };
      const RESULT = await addRole(data, this.props.User.token);
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

  txtRoleName_onChange = (e) => {
    this.setState({ txtRoleNameValue: e.value });
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        id: this.state.RowSelected.id,
        name: this.state.txtRoleNameValue,
      };
      const RESULT = await updateRole(data, this.props.User.token);
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
    const MSG = await deleteRole(
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
              <Label>نقش</Label>
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
                <Label className="standardLabelFont">نام</Label>
                <TextBox
                  value={this.state.txtRoleNameValue}
                  showClearButton={true}
                  placeholder="نام"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtRoleName_onChange}
                />
                <Label
                  id="errRoleName"
                  className="standardLabelFont errMessage"
                />
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
                  id="ErrorUpdateRole"
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
              <Label className="title">لیست نقش ها</Label>
            </Row>

            <Row>
              <Col xs="auto" className="standardPadding">
                <DataGrid
                  dataSource={this.state.RoleGridData}
                  defaultColumns={DataGridRoleColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowClick={this.grdRole_onClickRow}
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
});
export default connect(mapStateToProps)(Role);
