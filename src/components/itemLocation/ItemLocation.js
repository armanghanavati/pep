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
  Input,
} from "reactstrap";
import classnames from "classnames";
import TextBox from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
import { locale } from "devextreme/localization";
import SelectBox from "devextreme-react/select-box";
import TagBox from "devextreme-react/tag-box";
import { Button } from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";
import { CheckBox } from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";
import { Tooltip } from "devextreme-react/tooltip";
import AdapterJalali from "@date-io/date-fns-jalali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import { confirm } from "devextreme/ui/dialog";
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
  Export,
} from "devextreme-react/data-grid";

import Wait from "../common/Wait";

import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  DataGridDefaultHeight,
  ToastTime,
  ToastWidth,
  ALL_MOD,
  CHECK_BOXES_MOD,
  FILTER_BUILDER_POPUP_POSITION,
} from "../../config/config";

import { logsOrderPointInventoryActions } from "../../redux/reducers/logsOrderPointInventory/logsOrderPointInventory-slice";
import { locationActions } from "../../redux/reducers/location/location-slice";
import { companyActions } from "../../redux/reducers/company/company-slice";
import {
  itemLocationList,
  updateItemLocation,
} from "../../redux/reducers/itemLocation/itemLocation-actions";
import { userLocationList } from "../../redux/reducers/user/user-actions";
import { itemListComboBySupplierId } from "../../redux/reducers/item/item-action";
import {
  supplierListComboByCompanyId,
  supplierOrderInventoryComboList,
} from "../../redux/reducers/supplier/supplier-action";
import { itemGroupListCombo } from "../../redux/reducers/itemGroup/itemGroup-actions";
import { inventoryListByLocationId } from "../../redux/reducers/inventory/inventory-actions";
import { DataGridItemLocationColumns } from "./ItemLocation-config";

import {
  Gfn_BuildValueComboMulti,
  Gfn_ConvertComboForAll,
  Gfn_BuildValueComboSelectAll,
  Gfn_ExportToExcel,
  Gfn_DT2StringSql,
} from "../../utiliy/GlobalMethods";
import { Template } from "devextreme-react";
import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import UpdateIcon from "../../assets/images/icon/update.png";

const dateLabel = { "aria-label": "Date" };

class ItemLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LocationGroupIds: null,
      LocationIds: null,
      SupplierId: null,
      ItemGroupId: null,
      ItemId: null,
      ItemLocationGridData: null,

      Id: null,
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
      LocationList: null,
      Location: null,
      SupplierList: null,
      ItemLocationList: null,
      ItemLocation: null,
      ItemGroupList: null,
      ItemList: null,
      ItemLocationGroupId: null,
      ItemLocationId: null,
      ActiveAll: false,
      DeActiveAll: false,
      flagSelectAll: false,
      ItemsListUpdated: [],
      InventoryList: null,
      InventoryIds: null,
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_locationList();
    await this.fn_supplierList();
    this.fn_itemGroupList();
  }

  fn_locationList = async () => {
    this.setState({
      LocationList: await userLocationList(
        this.props.User.userId,
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  fn_supplierList = async () => {
    this.setState({
      SupplierList: await supplierListComboByCompanyId(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  fn_itemGroupList = async () => {
    this.setState({
      ItemGroupList: await itemGroupListCombo(this.props.User.token),
    });
  };

  fn_itemList = async () => {
    this.setState({});
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "itemLocation.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "itemLocation.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  cmbLocationList_onChange = async (e) => {
    const IDS = e.toString().split(",");
    const TEMP_LOCATION = await userLocationList(
      this.props.User.userId,
      this.props.Company.currentCompanyId,
      this.props.User.token
    );
    let tempLocation = [];
    for (let i = 0; i < IDS.length; i++)
      for (let j = 0; j < TEMP_LOCATION.length; j++)
        if (IDS[i] == TEMP_LOCATION[j].id) tempLocation.push(TEMP_LOCATION[j]);
    this.setState({
      LocationGroupIds: e,
      Location: tempLocation,
    });
  };

  cmbLocation_onChange = async (e) => {
    let tempInventory = [];
    this.setState({
      InventoryList: null,
    });
    const IDS = e.toString().split(",");
    var data = {
      locationId: e,
    };

    const TEMP_INVENTORY = await inventoryListByLocationId(
      data,
      this.props.User.token
    );
    if (TEMP_INVENTORY == null) return;

    for (let i = 0; i < IDS.length; i++)
      for (let j = 0; j < TEMP_INVENTORY.length; j++)
        if (IDS[i] == TEMP_INVENTORY[j].locationId)
          tempInventory.push(TEMP_INVENTORY[j]);
    this.setState({
      LocationIds: e,
      InventoryList: tempInventory,
    });
  };

  cmbSupplier_onChange = async (e) => {
    var data = await Gfn_BuildValueComboMulti(e);
    this.setState({
      SupplierId: e,
      ItemList: await itemListComboBySupplierId(data, this.props.User.token),
    });
  };

  cmbItemGroup_onChange = async (e) => {
    this.setState({
      ItemGroupId: e,
    });
  };
  cmbItem_onChange = async (e) => {
    this.setState({
      ItemId: e,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errLocationId").innerHTML = "";
    if (this.state.LocationIds == null) {
      document.getElementById("errLocationId").innerHTML =
        "نام  فروشگاه را انتخاب نمائید";
      flag = false;
    }
    return flag;
  };

  btnUpdate_onClick = async () => {
    if (this.state.ItemsListUpdated.length > 0) {
      const data = this.state.ItemsListUpdated;
      const RESULT = await updateItemLocation(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
          Type: RESULT > 0 ? "success" : "error",
        },
      });
      this.btnSearch_onClick();
    } else alert("کالا(ها) را انتخاب نمائید.");
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  btnSearch_onClick = async () => {
    var data = {
      locationIds: this.state.LocationIds,
      itemId: this.state.ItemId,
      supplierId: this.state.SupplierId,
      itemGroupId: this.state.ItemGroupId,
      inventoryIds: this.state.InventoryIds,
    };
    var RESULT = 0;
    RESULT = await itemLocationList(data, this.props.User.token);
    this.setState({
      ItemLocationGridData: RESULT,
    });
    if (!RESULT > 0)
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: "آیتمی جهت نمایش وجود ندارد",
          Type: "error",
        },
      });
  };

  chkDeActiveAll_onChange = async () => {
    let result = confirm(
      "<i>آیا از غیرفعال کردن تمام کالاها و فروشگاه های انتخاب شده، اطمینان دارید؟؟</i>",
      ""
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        this.setState({
          DeActiveAll: true,
          ActiveAll: false,
          flagSelectAll: true,
        });
        this.fn_ActiveDeactiveAll(false);
      } else {
        this.setState({ DeActiveAll: false });
      }
    });
  };
  chkActiveAll_onChange = () => {
    if (
      this.state.ItemLocationGridData != null &&
      this.state.ItemLocationGridData != []
    ) {
      let result = confirm(
        "<i>آیا از فعال کردن تمام کالاها و فروشگاه های انتخاب شده، اطمینان دارید؟؟</i>",
        ""
      );
      result.then((dialogResult) => {
        if (dialogResult) {
          this.setState({
            DeActiveAll: false,
            ActiveAll: true,
            flagSelectAll: true,
          });
          this.fn_ActiveDeactiveAll(true);
        } else {
          this.setState({ ActiveAll: false });
        }
      });
    } else alert("کالایی برای انتخاب وجود ندارد");
  };

  fn_ActiveDeactiveAll(Status) {
    var tempItemLocation = this.state.ItemLocationGridData;
    this.setState({
      ItemsListUpdated: [],
    });
    let tempItems = [];
    let obj = null;
    if (tempItemLocation == null) {
      tempItemLocation = [];
    }
    for (let i = 0; i < tempItemLocation.length; i++) {
      obj = {
        itemId: tempItemLocation[i].itemId,
        locationId: tempItemLocation[i].locationId,
        isActive: Status,
      };
      tempItems.push(obj);

      this.setState((state) => {
        const ItemsLocations = state.ItemLocationGridData.map((item, i) => {
          item.isActive = Status;
          return item;
        });

        return {
          ItemsLocations,
        };
      });
    }
    this.setState({
      ItemsListUpdated: tempItems,
      //   ItemsLocations:tempItemLocation
    });
    console.log(JSON.stringify(tempItems));
  }

  cmbInventory_onChange = (e) => {
    this.setState({
      InventoryIds: e,
    });
  };

  grdItemLocation_onUpdateRow = (params) => {
    let tempItems = [];
    if (!this.state.flagSelectAll) tempItems = this.state.ItemsListUpdated;
    let flagPush = true;
    for (let i = 0; i < tempItems.length; i++){
      if ( 
        tempItems[i].itemId === params.data.itemId &&
        tempItems[i].locationId === params.data.locationId
      ) {
        tempItems[i].isActive = params.data.isActive;
        flagPush = false;
      }
    }
    if (flagPush) {
      let obj = {
        itemId: params.data.itemId,
        locationId: params.data.locationId,
        isActive: params.data.isActive,
      };
      tempItems.push(obj);
      alert(JSON.stringify(tempItems))
    }
    this.setState({ ItemsListUpdated: tempItems, flagSelectAll: false });
  };

  rdoDeActiveAllItemLocation_onChange = async () => {
    let result = confirm(
      "<i>آیا از غیرفعال کردن تمام کالاها و فروشگاه های انتخاب شده، اطمینان دارید؟؟</i>",
      ""
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        this.setState({
          DeActiveAll: true,
          ActiveAll: false,
          flagSelectAll: true,
        });
        this.fn_ActiveDeactiveAll(false);
      } else {
        this.setState({ DeActiveAll: false });
      }
    });
  };

  rdoActiveAllItemLocation_onChange = () => {
    if (
      this.state.ItemLocationGridData != null &&
      this.state.ItemLocationGridData != []
    ) {
      let result = confirm(
        "<i>آیا از فعال کردن تمام کالاها و فروشگاه های انتخاب شده، اطمینان دارید؟؟</i>",
        ""
      );
      result.then((dialogResult) => {
        if (dialogResult) {
          this.setState({
            DeActiveAll: false,
            ActiveAll: true,
            flagSelectAll: true,
          });
          this.fn_ActiveDeactiveAll(true);
        } else {
          this.setState({ ActiveAll: false });
        }
      });
    } else alert("کالایی برای انتخاب وجود ندارد");
  };

  // grdItemLocation_onClickRow = (e) => {
  //   this.setState({
  //     ItemId: e.data.ItemId,
  //     LocationIds: e.data.locationIds,
  //     LocationGroupIds: e.data.LocationGroupIds,
  //     SupplierId: e.data.supplierId,
  //   });
  // };

  btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(this.state.OrderInventoryGridData, "OrderInventory");
  };

  render() {
    locale("fa-IR");
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
        {this.state.stateWait && (
          <Row className="text-center">
            <Col style={{ textAlign: "center", marginTop: "10px" }}>
              <Wait />
            </Col>
          </Row>
        )}
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label>کالا فروشگاه</Label>
            </Row>
            <Row>
              <Col xs={3}>
                <Label className="standardLabelFont">گروه فروشگاه</Label>
                <TagBox
                  dataSource={this.state.LocationList}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="گروه فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbLocationList_onChange}
                />
              </Col>
              <Col xs={3}>
                <Label className="standardLabelFont">فروشگاه</Label>
                <TagBox
                  dataSource={this.state.Location}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbLocation_onChange}
                />
              </Col>
              <Col xs={3}>
                <Label className="standardLabelFont">انبار</Label>
                <TagBox
                  dataSource={this.state.InventoryList}
                  searchEnabled={true}
                  displayExpr="inventoryName"
                  placeholder="انبار"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbInventory_onChange}
                />
              </Col>
              <Row className="standardPadding">
                <Col xs="auto">
                  <Label className="standardLabelFont">تامین کننده</Label>
                  <SelectBox
                    dataSource={this.state.SupplierList}
                    displayExpr="label"
                    placeholder="تامین کننده"
                    valueExpr="id"
                    searchEnabled={true}
                    rtlEnabled={true}
                    onValueChange={this.cmbSupplier_onChange}
                    value={this.state.SupplierId}
                  />
                  <Label
                    id="errSupplier"
                    className="standardLabelFont errMessage"
                  />
                </Col>

                <Col xs="auto">
                  <Label className="standardLabelFont">گروه کالا</Label>
                  <SelectBox
                    dataSource={this.state.ItemGroupList}
                    displayExpr="label"
                    placeholder="گروه کالا"
                    valueExpr="id"
                    searchEnabled={true}
                    rtlEnabled={true}
                    onValueChange={this.cmbItemGroup_onChange}
                    value={this.state.ItemGroupId}
                  />
                  <Label
                    id="errItemGroup"
                    className="standardLabelFont errMessage"
                  />
                </Col>
                <Col xs="auto">
                  <Label className="standardLabelFont">کالا</Label>
                  <SelectBox
                    dataSource={this.state.ItemList}
                    displayExpr="label"
                    placeholder="کالا"
                    valueExpr="id"
                    searchEnabled={true}
                    rtlEnabled={true}
                    onValueChange={this.cmbItem_onChange}
                    value={this.state.ItemId}
                  />
                  <Label
                    id="errItem"
                    className="standardLabelFont errMessage"
                  />
                </Col>
              </Row>
            </Row>
            <Row className="standardSpaceTop">
                <Col xs="auto">
                  <Button
                    icon={SearchIcon}
                    text="اعمال فیلتر"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnSearch_onClick}
                  />
                </Col>
            </Row>
          </Row>
        </Card>

        <p></p>
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label className="title"></Label>
            </Row>
            <Row style={{ padding: "10px", direction: "rtl" }}>
              <Col xs="auto">
                <Input
                  type="radio"
                  value={this.state.ActiveAll}
                  onClick={this.rdoActiveAllItemLocation_onChange}
                  name="Active"
                  checked={this.state.ActiveAll}
                />
                <Label>زدن گروهی تیک فعال برای کالاهای فیلتر شده</Label>
              </Col>
            </Row>
            <Row style={{ padding: "10px", direction: "rtl" }}>
              <Col xs="auto">
                <Input
                  type="radio"
                  value={this.state.DeActiveAll}
                  onClick={this.rdoDeActiveAllItemLocation_onChange}
                  name="Active"
                  checked={this.state.DeActiveAll}
                />
                <Label>زدن گروهی تیک غیرفعال برای کالاهای فیلتر شده</Label>
              </Col>
            </Row>
          </Row>
          <Row className="standardPadding">
            <Row>
              <Label className="title">لیست کالا فروشگاه</Label>
            </Row>
            <Col xs="auto" className="standardPadding">
              <DataGrid
                dataSource={this.state.ItemLocationGridData}
                defaultColumns={DataGridItemLocationColumns}
                showBorders={true}
                onRowUpdated={this.grdItemLocation_onUpdateRow}
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
                <Selection
                  mode="multiple"
                  selectAllMode={ALL_MOD}
                  showCheckBoxesMode={CHECK_BOXES_MOD}
                />
                <Editing mode="cell" allowUpdating={true} />
                <FilterRow visible={true} />
                <FilterPanel visible={true} />
              </DataGrid>
            </Col>
            <Row style={{ paddingRight: "10px", paddingBottom: "10px" }}>
              {this.state.stateDisable_btnUpdate && (
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
              )}
            </Row>
            <Row style={{ direction: "ltr" }}>
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

export default connect(mapStateToProps)(ItemLocation);
