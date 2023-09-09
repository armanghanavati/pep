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
import RadioGroup from "devextreme-react/radio-group";
import SelectBox from "devextreme-react/select-box";
import TagBox from "devextreme-react/tag-box";
import { Button } from "devextreme-react/button";
import { CheckBox } from "devextreme-react/check-box";
import { confirm } from "devextreme/ui/dialog";
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
  ALL_MOD,
  CHECK_BOXES_MOD,
} from "../../config/config";
import {
  itemLocationList,
  updateItemLocation,
} from "../../redux/reducers/itemLocation/itemLocation-actions";
import { DataGridItemLocationColumns } from "./ItemLocation-config";
import { userLocationList } from "../../redux/reducers/user/user-actions";
import { location } from "../../redux/reducers/location/location-actions";
import { itemGroupListCombo } from "../../redux/reducers/itemGroup/itemGroup-actions";
import { itemListComboBySupplierId } from "../../redux/reducers/item/item-action";
import { inventoryListByLocationId } from "../../redux/reducers/inventory/inventory-actions";
import {
  supplierListComboByCompanyId,
  supplierOrderInventoryComboList,
} from "../../redux/reducers/supplier/supplier-action";
import {
  Gfn_BuildValueComboMulti,
  Gfn_BuildValueComboSelectAll,
} from "../../utiliy/GlobalMethods";
import { json } from "react-router";
import UpdateIcon from "../../assets/images/icon/update.png";

class OrderStoreDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LocationGroupIds: null,
      LocationIds: null,
      SupplierIds: null,
      ItemGroupIds: null,
      ItemIds: null,
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
    const IDS = e.toString().split(",");
    var data = {
      locationId: e,
    };
    const TEMP_INVENTORY = await inventoryListByLocationId(
      data,
      this.props.User.token
    );
    let tempInventory = [];
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
    var temp = [];
    temp.push(e);
    var data = await Gfn_BuildValueComboMulti(e);
    this.setState({
      SupplierIds: temp,
      ItemList: await itemListComboBySupplierId(data, this.props.User.token),
    });
  };

  cmbItemGroup_onChange = async (e) => {
    var temp = [];
    temp.push(e);
    this.setState({
      ItemGroupIds: temp,
    });
  };
  cmbItem_onChange = async (e) => {
    var temp = [];
    temp.push(e);
    this.setState({
      ItemIds: temp,
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
      this.btnFilter_onClick();
    } else alert("کالا(ها) را انتخاب نمائید.");
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  btnFilter_onClick = async () => {
    var data = {
      locationIds: this.state.LocationIds,
      itemIds: this.state.ItemIds,
      supplierIds: this.state.SupplierIds,
      itemGroupIds: this.state.ItemGroupIds,
      inventoryIds: this.state.InventoryIds,
    };
    this.setState({
      ItemLocationGridData: await itemLocationList(data, this.props.User.token),
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

  grdItemLocation_onClickRow = (params) => {
    let tempItems = [];
    if (!this.state.flagSelectAll) tempItems = this.state.ItemsListUpdated;
    let flagPush = true;
    for (let i = 0; i < tempItems.length; i++)
      if (
        tempItems[i].ItemId === params.data.itemId &&
        tempItems[i].LocationId === params.data.locationId
      ) {
        tempItems[i].isActive = params.data.isActive;
        flagPush = false;
        break;
      }
    if (flagPush) {
      let obj = {
        itemId: params.data.itemId,
        locationId: params.data.locationId,
        isActive: params.data.isActive,
      };
      tempItems.push(obj);
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

  grdItemLocation_onClickRow = (e) => {
    this.setState({
      ItemIds: e.data.ItemIds,
      LocationIds: e.data.locationIds,
      LocationGroupIds: e.data.LocationGroupIds,
      SupplierIds: e.data.supplierIds,
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
              <Label>کالا فروشگاه</Label>
            </Row>
            <Row className="standardPadding">
              <Col xs="auto">
                <Label className="standardLabelFont">نام گروه فروشگاه</Label>
                <TagBox
                  dataSource={this.state.LocationList}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="نام گروه فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbLocationList_onChange}
                  value={this.state.LocationGroupIds}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نام فروشگاه</Label>
                <TagBox
                  dataSource={this.state.Location}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="نام فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbLocation_onChange}
                  value={this.state.LocationIds}
                />
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نام انبار</Label>
                <TagBox
                  dataSource={this.state.InventoryList}
                  searchEnabled={true}
                  displayExpr="inventoryName"
                  placeholder="نام انبار"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbInventory_onChange}
                  value={this.state.InventoryIds}
                />
              </Col>
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
                  value={this.state.SupplierIds}
                />
                <Label
                  id="errLocationId"
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
                  value={this.state.ItemGroupIds}
                />
                <Label
                  id="errLocationId"
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
                  value={this.state.ItemIds}
                />
                <Label
                  id="errLocationId"
                  className="standardLabelFont errMessage"
                />
              </Col>
            </Row>
            <Row className="standardSpaceTop">
              <Row>
                <>
                  <Col xs="auto">
                    <Button
                      icon={UpdateIcon}
                      text="اعمال فیلترها"
                      type="success"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnFilter_onClick}
                    />
                  </Col>
                </>
              </Row>
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
            <Row>
              <Col xs="auto" className="standardPadding">
                <DataGrid
                  dataSource={this.state.ItemLocationGridData}
                  defaultColumns={DataGridItemLocationColumns}
                  showBorders={true}
                  onRowUpdated={this.grdItemLocation_onClickRow}
                  onRowClick={this.grdItemLocation_onClickRow}
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
              </Row>
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

export default connect(mapStateToProps)(OrderStoreDate);
