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
  Toolbar,
  Item,
  Texts,
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
  userRoleList,
  removeRoleFromUser,
  removeRoleListFromUser,
} from "../../redux/reducers/user/user-actions";
import {
  personList,
  personNoneAsignList,
  personLocationList,
  SearchPersonById,
} from "../../redux/reducers/person/person-actions";
import { userActions } from "../../redux/reducers/user/user-slice";
import { DataGridRoleColumns } from "../role/Role-config";
import { DataGridUserColumns } from "./User-config";
import { roleList } from "../../redux/reducers/role/role-actions";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.state = {
      txtUserNameValue: null,
      chkIsActive: null,
      RowSelected: null,
      UserGridData: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      userId: null,
      user: null,
      stateDisable_txtCode: false,
      PersonList: null,
      PersonId: null,
      txtPasswordValue: null,
      RoleGridData: null,
      UserRoleGridData: null,
      selectedItemKeys: [],
    };
  }

  get dataGrid() {
    return this.gridRef.current.instance.getDataSource();
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_updateGrid();
    this.fn_roleGrid();
    this.fn_personNoneAsignList();
  }

  fn_personNoneAsignList = async () => {
    this.setState({
      PersonList: await personNoneAsignList(this.props.User.token),
    });
  };

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show)
      this.setState({
        UserGridData: await userList(
          this.props.Company.currentCompanyId,
          this.props.User.token
        ),
      });
  };

  fn_roleGrid = async () => {
    if (this.state.stateDisable_show) {
      this.setState({
        RoleGridData: await roleList(this.props.User.token),
      });
    }
  };

  fn_userRoleGrid = async (userId) => {
    if (this.state.stateDisable_show) {
      this.setState({
        UserRoleGridData: await userRoleList(userId, this.props.User.token),
      });
    }
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "user.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "user.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "user.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  grdUser_onClickRow = async (e) => {
    this.fn_userRoleGrid(e.data.id);
    await this.fn_personNoneAsignList();
    this.setState({
      txtUserNameValue: e.data.userName,
      chkIsActive: e.data.isActive,
      stateUpdateDelete: true,
      RowSelected: e.data,
      PersonId: e.data.personId,
    });
    // var person=await personLocationList( this.props.User.token);
    // var personIdSelected= person.find((element) => {
    //   return element.id === e.data.personId;
    // });
    var personIdSelected = await SearchPersonById(
      e.data.personId,
      this.props.User.token
    );

    if (this.state.PersonList != null)
      this.setState({
        PersonList: [...this.state.PersonList, personIdSelected],
      });
  };

  btnNew_onClick = async () => {
    this.setState({
      txtUserNameValue: null,
      chkIsActive: null,
      stateUpdateDelete: false,
      stateDisable_txtCode: false,
      PersonId: null,
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
    document.getElementById("errUserName").innerHTML = "";
    if (this.state.txtUserNameValue == null) {
      document.getElementById("errUserName").innerHTML =
        "نام کاربری را وارد نمائید";
      flag = false;
    }

    if (this.state.chkIsActive == null) {
      document.getElementById("errUserIsActive").innerHTML =
        "فعال بودن را مشخص نمائید.";
      flag = false;
    }
    return flag;
  };
  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        userName: this.state.txtUserNameValue,
        isActive: this.state.chkIsActive,
        personId: this.state.PersonId,
      };
      const RESULT = await addUser(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت",
          Type: RESULT != null ? "success" : "error",
        },
      });
      await this.fn_personNoneAsignList();
      this.fn_updateGrid();
    }
  };
  txtUserName_onChange = (e) => {
    this.setState({ txtUserNameValue: e.value });
  };

  txtPassword_onChange = (e) => {
    this.setState({ txtPasswordValue: e.value });
  };
  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        id: this.state.RowSelected.id,
        userName: this.state.txtUserNameValue,
        isActive: this.state.chkIsActive,
        password: this.state.txtPasswordValue,
        personId: this.state.PersonId,
      };

      const RESULT = await updateUser(data, this.props.User.token);
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
    const MSG = await deleteUser(
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
    await this.fn_personNoneAsignList();
    this.fn_updateGrid();
  };

  cmbPerson_onChange = (e) => {
    this.setState({
      PersonId: e,
    });
  };
  onAdd = async (e) => {
    if (this.state.RowSelected == null) {
      const MSG = "خطا کاربر را انتخاب کنید";
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: MSG,
          Type: "error",
        },
      });
      return;
    }

    var items = this.dataGrid._items;
    if (e.toIndex >= items.length) return;
    const id = e.itemData.id;
    const roleName = items[e.toIndex].name;
    var data = {
      userId: id,
      roleName: roleName,
    };
    await roleAsignToUser(data, this.props.User.token);
    this.fn_updateGrid();
    await this.fn_userRoleGrid(this.state.RowSelected.id);
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
              <Label>کاربر</Label>
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
                <Label className="standardLabelFont">نام کاربری</Label>
                <TextBox
                  value={this.state.txtUserNameValue}
                  showClearButton={true}
                  placeholder="نام کاربری"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtUserName_onChange}
                />
                <Row>
                  <Label
                    id="errUserName"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">شخص</Label>
                <SelectBox
                  dataSource={this.state.PersonList}
                  displayExpr="fullName"
                  placeholder="شخص"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbPerson_onChange}
                  value={this.state.PersonId}
                />
              </Col>
              {this.state.stateUpdateDelete && (
                <Col xs="auto">
                  <Label className="standardLabelFont">رمز عبور</Label>
                  <TextBox
                    value={this.state.txtPasswordValue}
                    showClearButton={true}
                    placeholder="رمز عبور"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtPassword_onChange}
                  />
                  <Row>
                    <Label
                      id="errUserName"
                      className="standardLabelFont errMessage"
                    />
                  </Row>
                </Col>
              )}
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
                    id="errUserIsActive"
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
            <Col xs={4}>
              <Row>
                <Label className="title">لیست کاربران</Label>
              </Row>
              <Row>
                <Col xs="auto" className="standardMarginRight">
                  <DataGrid
                    dataSource={this.state.UserGridData}
                    defaultColumns={DataGridUserColumns}
                    showBorders={true}
                    rtlEnabled={true}
                    allowColumnResizing={true}
                    onRowClick={this.grdUser_onClickRow}
                    height={DataGridDefaultHeight}
                  >
                    <RowDragging group="tasksGroup" onAdd={this.onAdd} />
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
            <Col xs={4}>
              <Row>
                <Label className="title">لیست نقش ها</Label>
              </Row>
              <Row>
                <Col xs="auto">
                  <DataGrid
                    ref={this.gridRef}
                    dataSource={this.state.RoleGridData}
                    defaultColumns={DataGridRoleColumns}
                    showBorders={true}
                    rtlEnabled={true}
                    allowColumnResizing={true}
                    onRowClick={this.grdRole_onClickRow}
                    height={DataGridDefaultHeight}
                  >
                    <RowDragging
                      data={this.state.RoleGridData}
                      group="tasksGroup"
                      onAdd={this.onAdd}
                    />
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
            <Col>
              <Row>
                <Label className="title">نقش کاربر</Label>
              </Row>
              <Row>
                <Col xs="auto">
                  <DataGrid
                    dataSource={this.state.UserRoleGridData}
                    defaultColumns={DataGridRoleColumns}
                    showBorders={true}
                    rtlEnabled={true}
                    allowColumnResizing={true}
                    onRowClick={this.grdRole_onClickRow}
                    height={DataGridDefaultHeight}
                    selectedRowKeys={this.state.selectedItemKeys}
                    onSelectionChanged={this.selectionChanged}
                    onRowRemoved={this.onRowRemoved}
                  >
                    <Selection mode="multiple" />
                    <Scrolling
                      rowRenderingMode="virtual"
                      showScrollbar="always"
                      columnRenderingMode="virtual"
                    />
                    <Editing mode="cell" allowDeleting={true}>
                      <Texts deleteRow="حذف" />
                    </Editing>

                    <Toolbar>
                      <Item name="addRowButton" showText="always" />
                      <Item location="after">
                        <Button
                          onClick={this.deleteRecords}
                          icon="trash"
                          disabled={!this.state.selectedItemKeys.length}
                          text="حذف گروهی از لیست"
                        />
                      </Item>
                    </Toolbar>
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
  deleteRecords = async () => {
    var roles = [];
    this.state.selectedItemKeys.forEach((key) => {
      roles.push(key.name);
    });
    //console.log(role[0]);
    this.setState({
      selectedItemKeys: [],
    });
    var data = {
      roleNames: roles,
    };
    const RESULT = await removeRoleListFromUser(
      this.state.RowSelected.id,
      data,
      this.props.User.token
    );
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: RESULT > 0 ? "حذف با موفقیت انجام گردید" : "عدم حذف",
        Type: RESULT > 0 ? "success" : "error",
      },
    });
    await this.fn_userRoleGrid(this.state.RowSelected.id);
  };

  selectionChanged = (data) => {
    this.setState({
      selectedItemKeys: data.selectedRowKeys,
    });
  };

  onRowRemoved = async (e) => {
    const RESULT = await removeRoleFromUser(
      this.state.RowSelected.id,
      e.data.name,
      this.props.User.token
    );
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: RESULT > 0 ? "حذف با موفقیت انجام گردید" : "عدم حذف",
        Type: RESULT > 0 ? "success" : "error",
      },
    });
  };
}

const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(User);
