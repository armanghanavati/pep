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
  addOrderStoreSupplierDate,
  orderStoreSupplierDateList,
} from "../../redux/reducers/orderStoreSupplierDate/orderStoreSupplierDate-actions.js";
import { DataGridOrderStoreSupplierDateColumns } from "./OrderStoreSupplierDate-config";
import UpdateIcon from "../../assets/images/icon/update.png";
import { userLocationList, userLocationListCombo } from "../../redux/reducers/user/user-actions";
import { location } from "../../redux/reducers/location/location-actions";
import { supplierList, supplierListComboByCompanyId } from "../../redux/reducers/supplier/supplier-action";
import { json } from "react-router";

class OrderStoreSupplierDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cmbLocationValue: null,
      OrderStoreSupplierDateGridData: null,
      RowSelected: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: true,
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      cmbLocationGroup: null,
      cmbLocation: null,
      chkIsSaturday: false,
      chkIsSunday: false,
      chkIsMonday: false,
      chkIsTuesday: false,
      chkIsWednsday: false,
      chkIsThursday: false,
      chkIsFriday: false,
      cmbSupplier: null,
      cmbSupplierValue: null,
      cmbSupplierValue: null,
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_updateGrid();
    this.fn_locationGroup();
    this.fn_supplierList();
  }

  fn_updateGrid = async (locationId = "", supplierId = "") => {
    var response = await orderStoreSupplierDateList(
      this.props.Company.currentCompanyId,
      locationId,
      supplierId,
      this.props.User.token
    );
    if (response == null)
      this.setState({
        OrderStoreSupplierDateGridData: response,
      });
    else if (this.state.stateDisable_show && response != null) {
      var result = response
      this.setState({
        OrderStoreSupplierDateGridData: result,
      });
      if (locationId != "" && result != null) {
        for (let i = 0; i < result.length; i++)
          switch (result[i].daysOfWeek) {
            case 1:
              this.setState({ chkIsSunday: true });
              break;
            case 2:
              this.setState({ chkIsMonday: true });
              break;
            case 3:
              this.setState({ chkIsTuesday: true });
              break;
            case 4:
              this.setState({ chkIsWednsday: true });
              break;
            case 5:
              this.setState({ chkIsThursday: true });
              break;
            case 6:
              this.setState({ chkIsFriday: true });
              break;
            case 7:
              this.setState({ chkIsSaturday: true });
              break;
          }
      }
    }
  };

  fn_locationGroup = async () => {
    this.setState({
      cmbLocationGroup: await userLocationListCombo(
        this.props.User.userId,
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  fn_supplierList = async () => {
    this.setState({
      cmbSupplier: await supplierListComboByCompanyId(
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
          case "orderStoreSupplierDate.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "orderStoreSupplierDate.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  cmbLocationGroup_onChange = async (e) => {
    const IDS = e.toString().split(",");
    const TEMP_LOCATION = await userLocationListCombo(
      this.props.User.userId,
      this.props.Company.currentCompanyId,
      this.props.User.token
    );
    let tempLocation = [];
    for (let i = 0; i < IDS.length; i++)
      for (let j = 0; j < TEMP_LOCATION.length; j++)
        if (IDS[i] == TEMP_LOCATION[j].id) tempLocation.push(TEMP_LOCATION[j]);
    if (IDS.includes('0')) {
      this.setState({
        cmbLocation: null,
        cmbLocationValue: null,
        cmbSupplierValue: null,
        chkIsSaturday: false,
        chkIsSunday: false,
        chkIsMonday: false,
        chkIsTuesday: false,
        chkIsWednsday: false,
        chkIsThursday: false,
        chkIsFriday: false,
      })
      this.fn_updateGrid();
    }
    else {
      this.setState({
        cmbLocation: tempLocation,
      });
    }
  };

  cmbLocation_onChange = async (e) => {
    this.setState({
      cmbLocationValue: e,
      chkIsSunday: false,
      chkIsMonday: false,
      chkIsTuesday: false,
      chkIsWednsday: false,
      chkIsThursday: false,
      chkIsFriday: false,
      chkIsSaturday: false,
      OrderStoreSupplierDateGridData: null
    });
    //if (this.state.cmbSupplierValue != null)
    await this.fn_updateGrid(e, this.state.cmbSupplierValue)
  };

  cmbSupplier_onChange = async (e) => {
    this.setState({
      cmbSupplierValue: e,
      chkIsSunday: false,
      chkIsMonday: false,
      chkIsTuesday: false,
      chkIsWednsday: false,
      chkIsThursday: false,
      chkIsFriday: false,
      chkIsSaturday: false,
      OrderStoreSupplierDateGridData: null
    })
    await this.fn_updateGrid(this.state.cmbLocationValue, e)
  }
  chkIsSaturday_onChange = (e) => {
    this.setState({
      chkIsSaturday: e.value,
    });
  };
  chkIsSunday_onChange = (e) => {
    this.setState({
      chkIsSunday: e.value,
    });
  };
  chkIsMonday_onChange = (e) => {
    this.setState({
      chkIsMonday: e.value,
    });
  };
  chkIsTuesday_onChange = (e) => {
    this.setState({
      chkIsTuesday: e.value,
    });
  };
  chkIsWednsday_onChange = (e) => {
    this.setState({
      chkIsWednsday: e.value,
    });
  };
  chkIsThursday_onChange = (e) => {
    this.setState({
      chkIsThursday: e.value,
    });
  };
  chkIsFriday_onChange = (e) => {
    this.setState({
      chkIsFriday: e.value,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errLocationId").innerHTML = "";
    if (this.state.cmbLocationValue == null) {
      document.getElementById("errLocationId").innerHTML =
        "نام  فروشگاه را انتخاب نمائید";
      flag = false;
    }
    return flag;
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        locationId: this.state.cmbLocationValue,
        supplierId: this.state.cmbSupplierValue,
        sunday: this.state.chkIsSunday,
        monday: this.state.chkIsMonday,
        tuesday: this.state.chkIsTuesday,
        wednsday: this.state.chkIsWednsday,
        thursday: this.state.chkIsThursday,
        friday: this.state.chkIsFriday,
        saturday: this.state.chkIsSaturday,
      };
      const RESULT = await addOrderStoreSupplierDate(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
          Type: RESULT > 0 ? "success" : "error",
        },
      });

      await this.fn_updateGrid(this.state.cmbLocationValue, this.state.cmbSupplierValue);
    }
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
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
              <Label>روز ویرایش سفارشات هر تامین کننده فروشگاه در هفته</Label>
            </Row>
            <Row className="standardPadding">
              <Col xs="auto">
                <Label className="standardLabelFont">نام گروه فروشگاه</Label>
                <SelectBox
                  dataSource={this.state.cmbLocationGroup}
                  displayExpr="label"
                  placeholder="نام گروه فروشگاه"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbLocationGroup_onChange}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نام فروشگاه</Label>
                <SelectBox
                  dataSource={this.state.cmbLocation}
                  displayExpr="label"
                  placeholder="نام فروشگاه"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbLocation_onChange}
                  value={this.state.cmbLocationValue}
                />
                <Label
                  id="errLocationId"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نام تامین کننده</Label>
                <SelectBox
                  dataSource={this.state.cmbSupplier}
                  displayExpr="label"
                  placeholder="نام تامین کننده"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbSupplier_onChange}
                  value={this.state.cmbSupplierValue}
                />
                <Label
                  id="errSupplierId"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <p></p>
              <Row>
                <Col xs="auto">
                  <CheckBox
                    value={this.state.chkIsSaturday}
                    text="شنبه"
                    rtlEnabled={true}
                    onValueChanged={this.chkIsSaturday_onChange}
                  />
                </Col>
                <Col xs="auto">
                  <CheckBox
                    value={this.state.chkIsSunday}
                    text="یک شنبه"
                    rtlEnabled={true}
                    onValueChanged={this.chkIsSunday_onChange}
                  />
                </Col>
                <Col xs="auto">
                  <CheckBox
                    value={this.state.chkIsMonday}
                    text="دو شنبه"
                    rtlEnabled={true}
                    onValueChanged={this.chkIsMonday_onChange}
                  />
                </Col>
                <Col xs="auto">
                  <CheckBox
                    value={this.state.chkIsTuesday}
                    text="سه شنبه"
                    rtlEnabled={true}
                    onValueChanged={this.chkIsTuesday_onChange}
                  />
                </Col>
                <Col xs="auto">
                  <CheckBox
                    value={this.state.chkIsWednsday}
                    text="چهار شنبه"
                    rtlEnabled={true}
                    onValueChanged={this.chkIsWednsday_onChange}
                  />
                </Col>
                <Col xs="auto">
                  <CheckBox
                    value={this.state.chkIsThursday}
                    text="پنج شنبه"
                    rtlEnabled={true}
                    onValueChanged={this.chkIsThursday_onChange}
                  />
                </Col>
                <Col xs="auto">
                  <CheckBox
                    value={this.state.chkIsFriday}
                    text="جمعه"
                    rtlEnabled={true}
                    onValueChanged={this.chkIsFriday_onChange}
                  />
                </Col>
              </Row>
            </Row>
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
          </Row>
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label className="title">لیست زمانبندی تامین کننده ها</Label>
            </Row>

            <Row>
              <Col xs="auto" className="standardPadding">
                <DataGrid
                  dataSource={this.state.OrderStoreSupplierDateGridData}
                  defaultColumns={DataGridOrderStoreSupplierDateColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
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

export default connect(mapStateToProps)(OrderStoreSupplierDate);
