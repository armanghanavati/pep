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
  locationUserAccessList,
  addUserLocation,
  deleteUserLocation,
  removeLocationListFromUser,
  removeLocationFromUser,
  updateUserLocation,
} from "../../redux/reducers/userLocation/userLocation-actions";
import { DataGridUserColumns } from "../user/User-config";
import { DataGridLocationColumns } from "../location/Location-config";
import DataSource from "devextreme/data/data_source";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import { locationList, allLocation } from "../../redux/reducers/location/location-actions";
import { userList } from "../../redux/reducers/user/user-actions";

class UserLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RowSelected: null,
      UserGridData: null,
      LocationGridData: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      LocationId: null,
      LocationList: null,
      UserId: null,
      cmbUser: null,
      selectedItemKeys: [],
      LocationRowSelected:null,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_userGrid();
    this.fn_userList();
    this.fn_locationList();
  }

  fn_userGrid = async () => {
    this.setState({
      UserGridData: await userList(this.props.User.token),
    });
  };

  fn_locationGrid = async (userId) => {
    this.setState({
      LocationGridData: await locationUserAccessList(
        userId,
        this.props.User.token
      ),
    });
  };

  fn_locationList = async () => {
    this.setState({
      LocationList: await allLocation(this.props.User.token),
    });
  };

  fn_userList = async () => {
    const USERLIST=await userList(this.props.User.token);
    const LAZY = new DataSource({
      store: USERLIST,
      paginate: true,
      pageSize: 10,
    });
    this.setState({
      cmbUser: LAZY
    });
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "userLocation.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "userLocation.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "userLocation.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  grdUser_onClickRow = async (e) => {
    this.fn_locationGrid(e.data.id);
    this.setState({
      RowSelected: e.data,
    });
  };

  btnNew_onClick = () => {
    this.setState({
      LocationId: null,
      UserId: null,
      stateUpdateDelete: false,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errLocationName").innerHTML = "";
    if (this.state.LocationId == null) {
      document.getElementById("errLocationName").innerHTML =
        "محل شرکت را انتخاب نمائید";
      flag = false;
    }
    return flag;
  };
  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        userId: this.state.UserId,
        locationId: this.state.LocationId,
      };
      const RESULT = await addUserLocation(data, this.props.User.token);
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
      this.fn_locationGrid(RESULT.userId);
    }
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  btnDelete_onClick = async () => {
    const MSG = await deleteUserLocation(
      this.state.RowSelected.id,
      this.state.LocationId,
      this.props.User.token
    );
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: MSG,
        Type: "success",
      },
    });
    this.fn_locationGrid();
  };

  cmbUser_onChange = (e) => {
    this.setState({
      UserId: e,
    });
  };

  cmbLocation_onChange = (e) => {
    this.setState({
      LocationId: e,
    });
  };
  grdLocation_onClickRow=(e)=>{
    this.setState({
        UserId:this.state.RowSelected.id,
        LocationId:e.data.id,
        stateUpdateDelete: true,
        LocationRowSelected:e.data
    })
  }

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        userId: this.state.UserId,
        locationId:this.state.LocationRowSelected.id,
        newLocationId:this.state.LocationId
      };
      const RESULT = await updateUserLocation(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
          Type: RESULT > 0 ? "success" : "error",
        },
      });
      this.fn_locationGrid(this.state.UserId);
    }
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
              <Label>دسترسی کاربران به محل  شرکت ها</Label>
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
                  dataSource={this.state.cmbUser}
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
                <Label className="standardLabelFont">محل شرکت</Label>
                <SelectBox
                  dataSource={this.state.LocationList}
                  displayExpr="locationName"
                  placeholder="محل شرکت"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbLocation_onChange}
                  value={this.state.LocationId}
                />
                <Row>
                  <Label
                    id="errLocationName"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
            </Row>
            <Row>
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
                    </>
                  )}
                </Row>
              </Row>
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
                <Label className="title">لیست محل شرکت ها</Label>
              </Row>
              <Row>
                <Col>
                  <DataGrid
                    dataSource={this.state.LocationGridData}
                    defaultColumns={DataGridLocationColumns}
                    showBorders={true}
                    rtlEnabled={true}
                    allowColumnResizing={true}
                    onRowClick={this.grdLocation_onClickRow}
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
    var locations = [];
    this.state.selectedItemKeys.forEach((key) => {
      locations.push(key.id);
    });
    //console.log(locations[0]);
    this.setState({
      selectedItemKeys: [],
    });
    var data = {
      locationId: locations,
    };
    const RESULT = await removeLocationListFromUser(
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
    await this.fn_locationGrid(this.state.RowSelected.id);
  };

  selectionChanged = (data) => {
    this.setState({
      selectedItemKeys: data.selectedRowKeys,
    });
  };

  onRowRemoved = async (e) => {
    const RESULT = await removeLocationFromUser(
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
  Company:state.companies
});

export default connect(mapStateToProps)(UserLocation);
