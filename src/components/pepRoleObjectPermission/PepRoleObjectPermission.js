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
  addUser,
  updateUser,
  deleteUser,
  userList,
  roleAsignToUser,
} from "../../redux/reducers/user/user-actions";
import { pepObjectList } from "../../redux/reducers/pepObject/pepObject-actions";
import { permissionList } from "../../redux/reducers/permission/permission-actions";
import { userActions } from "../../redux/reducers/user/user-slice";
import { DataGridRoleColumns } from "../role/Role-config";
import { DataGridPepRoleObjectPermissionColumns } from "../pepRoleObjectPermission/PepRoleObjectPermission-config";
import {
  addPepRoleObjectPermission,
  deletePepRoleObjectPermission,
  pepRoleObjectPermissionList,
  updatePepRoleObjectPermission
} from "../../redux/reducers/pepRoleObjectPermission/pepRoleObjectpermission-actions";
import { roleList } from "../../redux/reducers/role/role-actions";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
class PepObject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      txtUserNameValue: null,
      chkIsActive: null,
      RowSelected: null,
      PepObjectGridData: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      txtPasswordValue: null,
      RoleList: null,
      PermissionList: null,
      PermissionId: null,
      PepObjectList: null,
      PepRoleObjectPermissionGridData: null,
      RoleId: null,
      ObjectId: null,
      PermissionId: null,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_updateGrid();
    this.fn_roleList();
    this.fn_permissionList();
    this.fn_pepobjectList();
  }

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show)
      this.setState({
        PepRoleObjectPermissionGridData: await pepRoleObjectPermissionList(
          this.props.User.token
        ),
      });
  };

  fn_roleList = async () => {
    this.setState({
      RoleList: await roleList(this.props.User.token),
    });
  };

  fn_permissionList = async () => {
    this.setState({
      PermissionList: await permissionList(this.props.User.token),
    });
  };

  fn_pepobjectList = async () => {
    this.setState({
      PepObjectList: await pepObjectList(this.props.User.token),
    });
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "pepRoleObjectPermission.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "pepRoleObjectPermission.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "pepRoleObjectPermission.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  grdPepRoleObjectPermission_onClickRow = async (e) => {
    this.setState({
      PermissionId: e.data.permissionId,
      RoleId: e.data.roleId,
      ObjectId: e.data.objectId,
      stateUpdateDelete: true,
      RowSelected: e.data,
    });
  };

  btnNew_onClick = async () => {
    this.setState({
      RoleId: null,
      ObjectId: null,
      PermissionId: null,
      stateUpdateDelete: false,
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
    document.getElementById("errRoleName").innerHTML = "";
    if (this.state.RoleId == null) {
      document.getElementById("errRoleName").innerHTML = "نقش را انتخاب نمائید";
      flag = false;
    }
    if (this.state.ObjectId == null) {
      document.getElementById("errObjectName").innerHTML =
        "آیتم را انتخاب نمائید";
      flag = false;
    }
    if (this.state.PermissionId == null) {
      document.getElementById("errPermissionName").innerHTML =
        "دسترسی را انتخاب نمائید";
      flag = false;
    }

    return flag;
  };
  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        roleId: this.state.RoleId,
        objectId: this.state.ObjectId,
        permissionId: this.state.PermissionId,
      };
      const RESULT = await addPepRoleObjectPermission(
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
  txtObjectName_onChange = (e) => {
    this.setState({ txtObjectNameValue: e.value });
  };

  txtTitle_onChange = (e) => {
    this.setState({ txtTitleValue: e.value });
  };
  btnUpdate_onClick = async () => {
    if (this.state.RowSelected == null) {
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: "خطا ردیف انتخاب گردد",
          Type: "error",
        },
      });
      return;
    }
    if (await this.fn_CheckValidation()) {
      const data = {
        roleid:this.state.RoleId,
        objectId:this.state.ObjectId,
        permissionId:this.state.PermissionId
      };

      const RESULT = await updatePepRoleObjectPermission(data, this.props.User.token);
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
    const MSG = await deletePepRoleObjectPermission(
      this.state.RoleId,
      this.state.ObjectId,
      this.state.PermissionId,
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

  cmbRole_onChange = (e) => {
    this.setState({
      RoleId: e,
    });
  };

  cmbPepObject_onChange = (e) => {
    this.setState({
      ObjectId: e,
    });
  };

  cmbPermission_onChange = (e) => {
    this.setState({
      PermissionId: e,
    });
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
              <Label>آبجکت دسترسی</Label>
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
                <Label className="standardLabelFont">نقش</Label>
                <SelectBox
                  dataSource={this.state.RoleList}
                  displayExpr="name"
                  placeholder="نقش"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbRole_onChange}
                  value={this.state.RoleId}
                />
                <Row>
                  <Label
                    id="errRoleName"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">دسترسی</Label>
                <SelectBox
                  dataSource={this.state.PermissionList}
                  displayExpr="permissionName"
                  placeholder="دسترسی"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbPermission_onChange}
                  value={this.state.PermissionId}
                />
                <Row>
                  <Label
                    id="errObjectName"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">آیتم</Label>
                <SelectBox
                  dataSource={this.state.PepObjectList}
                  displayExpr="title"
                  placeholder="آیتم"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbPepObject_onChange}
                  value={this.state.ObjectId}
                />
                <Row>
                  <Label
                    id="errPermissionName"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>

              {this.state.stateUpdateDelete && (
                <Col xs="auto">
                  <Row>
                    <Label
                      id="errUserName"
                      className="standardLabelFont errMessage"
                    />
                  </Row>
                </Col>
              )}
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
            <Col>
              <Row>
                <Label className="title">لیست آبجکت دسترسی ها</Label>
              </Row>
              <Row>
                <Col xs="auto" className="standardMarginRight">
                  <DataGrid
                    dataSource={this.state.PepRoleObjectPermissionGridData}
                    defaultColumns={DataGridPepRoleObjectPermissionColumns}
                    showBorders={true}
                    rtlEnabled={true}
                    allowColumnResizing={true}
                    onRowClick={this.grdPepRoleObjectPermission_onClickRow}
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
            </Col>
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

export default connect(mapStateToProps)(PepObject);
