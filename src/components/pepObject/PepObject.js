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
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
class PepObject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      txtObjectNameValue: null,
      txtTitleValue: null,
      txtLinkComponentValue: null,
      txtLinkNameValue: null,
      TreeTypeId: null,
      ParentId: null,
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
      ObjectList: null,
      ObjectId: null,
      TreeTypeList: null,
      ObjectList: null,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_updateGrid();
    this.fn_TreeTypeList();
  }

  fn_updateGrid = async () => {
    this.setState({
      PepObjectGridData: await pepObjectList(this.props.User.token),
    });
  };

  fn_TreeTypeList = async () => {
    this.setState({
      TreeTypeList: await treeTypeList(this.props.User.token),
    });
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "pepObject.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "pepObject.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "pepObject.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  grdPepObject_onClickRow = (e) => {
    this.setState({
      txtObjectNameValue: e.data.objectName,
      txtTitleValue: e.data.title,
      txtLinkComponentValue: e.data.linkComponent,
      txtLinkNameValue: e.data.linkName,
      TreeTypeId: e.data.treeTypeId,
      ParentId: e.data.parentId,
      stateUpdateDelete: true,
      RowSelected: e.data,
    });
  };

  btnNew_onClick = async () => {
    this.setState({
      txtObjectNameValue: null,
      txtTitleValue: null,
      txtLinkComponentValue: null,
      txtLinkNameValue: null,
      chkIsActive: null,
      TreeTypeId: null,
      ParentId: null,
      stateUpdateDelete: false,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errObjectName").innerHTML = "";
    if (this.state.txtObjectNameValue == null) {
      document.getElementById("errObjectName").innerHTML =
        "نام آیتم را وارد نمائید";
      flag = false;
    }
    return flag;
  };
  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        objectName: this.state.txtObjectNameValue,
        title: this.state.txtTitleValue,
        parentId: this.state.ParentId,
        treeTypeId: this.state.TreeTypeId,
        linkComponent: this.state.txtLinkComponentValue,
        linkName: this.state.txtLinkNameValue,
      };
      const RESULT = await addPepObject(data, this.props.User.token);
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

  txtComponentName_onChange = (e) => {
    this.setState({ txtLinkComponentValue: e.value });
  };

  txtLinkName_onChange = (e) => {
    this.setState({ txtLinkNameValue: e.value });
  };

  cmbObject_onChange = (e) => {
    this.setState({ ParentId: e });
  };

  cmbTreeType_onChange = (e) => {
    this.setState({ TreeTypeId: e });
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

    if (this.fn_CheckValidation()) {
      const data = {
        id: this.state.RowSelected.id,
        objectName: this.state.txtObjectNameValue,
        title: this.state.txtTitleValue,
        parentId: this.state.ParentId,
        treeTypeId: this.state.TreeTypeId,
        linkComponent: this.state.txtLinkComponentValue,
        linkName: this.state.txtLinkNameValue,
      };
      console.log("pep objetc data for update" + JSON.stringify(data));
      const RESULT = await updatePepObject(data, this.props.User.token);
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
    const MSG = await deletePepObject(
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
                <Label className="standardLabelFont">نام آیتم</Label>
                <TextBox
                  value={this.state.txtObjectNameValue}
                  showClearButton={true}
                  placeholder="نام آیتم"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtObjectName_onChange}
                />
                <Row>
                  <Label
                    id="errObjectName"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col>
                <Label className="standardLabelFont">عنوان</Label>
                <TextBox
                  value={this.state.txtTitleValue}
                  showClearButton={true}
                  placeholder="عنوان"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtTitle_onChange}
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">لینک کامپوننت</Label>
                <TextBox
                  value={this.state.txtLinkComponentValue}
                  showClearButton={true}
                  placeholder="لینک کامپوننت"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtComponentName_onChange}
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">نام لینک</Label>
                <TextBox
                  value={this.state.txtLinkNameValue}
                  showClearButton={true}
                  placeholder="نام لینک"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtLinkName_onChange}
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">گروه آیتم</Label>
                <SelectBox
                  dataSource={this.state.PepObjectGridData}
                  displayExpr="objectName"
                  placeholder="گروه آیتم"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbObject_onChange}
                  value={this.state.ParentId}
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">نوع آیتم</Label>
                <SelectBox
                  dataSource={this.state.TreeTypeList}
                  displayExpr="typeName"
                  placeholder="نوع آیتم"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbTreeType_onChange}
                  value={this.state.TreeTypeId}
                />
              </Col>

              {this.state.stateUpdateDelete && (
                <Col xs={3}>
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
            <Row>
              <Label className="title">لیست آیتم ها</Label>
            </Row>
            <Row>
              <Col xs="auto" className="standardMarginRight">
                <DataGrid
                  dataSource={this.state.PepObjectGridData}
                  defaultColumns={DataGridPepObjectColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowClick={this.grdPepObject_onClickRow}
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

export default connect(mapStateToProps)(PepObject);
