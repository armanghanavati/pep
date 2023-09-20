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
  Texts,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  DataGridDefaultHeight,
  ToastTime,
  ToastWidth,
} from "../../config/config";
import {
  companyUserAccessList,
  addUserCompany,
  deleteUserCompany,
  removeCompanyListFromUser,
  removeCompanyFromUser,
} from "../../redux/reducers/userCompany/userCompany-actions";
import { DataGridUserColumns } from "../user/User-config";
import { DataGridCompanyColumns } from "../company/Company-config";

import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import { companyList } from "../../redux/reducers/company/company-actions";
import { userList } from "../../redux/reducers/user/user-actions";

class UserCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RowSelected: null,
      UserGridData: null,
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
      CompanyList: null,
      UserId: null,
      UserList: null,
      selectedItemKeys: [],
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_userGrid();
    this.fn_userList();
    this.fn_companyList();
  }

  fn_userGrid = async () => {
    this.setState({
      UserGridData: await userList(this.props.User.token),
    });
  };

  fn_companyGrid = async (userId) => {
    this.setState({
      CompanyGridData: await companyUserAccessList(
        userId,
        this.props.User.token
      ),
    });
  };

  fn_companyList = async () => {
    this.setState({
      CompanyList: await companyList(this.props.User.token),
    });
  };

  fn_userList = async () => {
    this.setState({
      UserList: await userList(this.props.User.token),
    });
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "userCompany.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "userCompany.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "userCompany.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  grdUser_onClickRow = async (e) => {
    this.fn_companyGrid(e.data.id);
    this.setState({
      stateUpdateDelete: true,
      RowSelected: e.data,
    });
  };

  btnNew_onClick = () => {
    this.setState({
      CompanyId: null,
      UserId: null,
      stateUpdateDelete: false,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errCompanyName").innerHTML = "";
    if (this.state.CompanyId == null) {
      document.getElementById("errCompanyName").innerHTML =
        "شرکت را انتخاب نمائید";
      flag = false;
    }
    return flag;
  };
  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        userId: this.state.UserId,
        companyId: this.state.CompanyId,
      };
      const RESULT = await addUserCompany(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message:
            RESULT != null
              ? "ثبت با موفقیت انجام گردید"
              : "عدم ثبت به دلیل تکراری بودن کد",
          Type: RESULT != null ? "success" : "error",
        },
      });
      this.fn_companyGrid(RESULT.userId);
    }
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  btnDelete_onClick = async () => {
    const MSG = await deleteUserCompany(
      this.state.RowSelected.id,
      this.state.CompanyId,
      this.props.User.token
    );
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: MSG,
        Type: "success",
      },
    });
    this.fn_companyGrid();
  };

  cmbUser_onChange = (e) => {
    this.setState({
      UserId: e,
    });
  };

  cmbCompany_onChange = (e) => {
    this.setState({
      CompanyId: e,
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
              <Label>دسترسی کاربران به شرکت ها</Label>
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
                <Label className="standardLabelFont">کاربر</Label>
                <SelectBox
                  dataSource={this.state.UserList}
                  displayExpr="userName"
                  placeholder="کاربر"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbUser_onChange}
                  value={this.state.UserId}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">شرکت</Label>
                <SelectBox
                  dataSource={this.state.CompanyList}
                  displayExpr="companyName"
                  placeholder="شرکت"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbCompany_onChange}
                  value={this.state.CompanyId}
                />
                <Row>
                  <Label
                    id="errCompanyName"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
            </Row>
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
          </Row>
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
          <Row>
            <Col className="standardPadding">
              <Row>
                <Label className="title">لیست کاربران</Label>
              </Row>
              <Row>
                <Col>
                  <DataGrid
                    dataSource={this.state.UserGridData}
                    defaultColumns={DataGridUserColumns}
                    showBorders={true}
                    rtlEnabled={true}
                    allowColumnResizing={true}
                    onRowClick={this.grdUser_onClickRow}
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
            <Col className="standardPadding">
              <Row>
                <Label className="title">لیست شرکت ها</Label>
              </Row>
              <Row>
                <Col>
                  <DataGrid
                    dataSource={this.state.CompanyGridData}
                    defaultColumns={DataGridCompanyColumns}
                    showBorders={true}
                    rtlEnabled={true}
                    allowColumnResizing={true}
                    onRowClick={this.grdCompany_onClickRow}
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
    var companies = [];
    this.state.selectedItemKeys.forEach((key) => {
      companies.push(key.id);
    });
    //console.log(companies[0]);
    this.setState({
      selectedItemKeys: [],
    });
    var data = {
      companyId: companies,
    };
    const RESULT = await removeCompanyListFromUser(
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
    await this.fn_companyGrid(this.state.RowSelected.id);
  };

  selectionChanged = (data) => {
    this.setState({
      selectedItemKeys: data.selectedRowKeys,
    });
  };

  onRowRemoved = async (e) => {
    const RESULT = await removeCompanyFromUser(
      this.state.RowSelected.id,
      e.data.id,
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
});

export default connect(mapStateToProps)(UserCompany);
