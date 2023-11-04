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
import Select from "react-select";
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
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import {
  itemLocationList,
  updateItemLocation,
} from "../../redux/reducers/itemLocation/itemLocation-actions";
import { userLocationList } from "../../redux/reducers/user/user-actions";
import { itemListComboBySupplierId } from "../../redux/reducers/item/item-action";
import { inventoryComboListByCompanyId } from "../../redux/reducers/inventory/inventory-actions";
import { updateItemSupplier } from "../../redux/reducers/itemSupplier/itemSupplier-actions";
import {
  supplierListComboByCompanyId,
  supplierOrderInventoryComboList,
} from "../../redux/reducers/supplier/supplier-action";
import { itemGroupListCombo } from "../../redux/reducers/itemGroup/itemGroup-actions";
import { inventoryListByLocationId } from "../../redux/reducers/inventory/inventory-actions";
import { DataGridItemSupplierColumns } from "./ItemSupplier-config";

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
import { itemSupplierList } from "../../redux/reducers/itemSupplier/itemSupplier-actions";

const dateLabel = { "aria-label": "Date" };

class ItemSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ItemsSuppliers: null,
      Suppliers: [],
      SupplierValue: [],
      ItemGroups: [],
      ItemGroupValue: [],
      ValueOfItemGroup: null,
      ValueOfSupplier: null,
      ItemListUpdated: [],
      DeActiveAll: false,
      ActiveAll: false,
      stateShowChkDeactive: false,
      SupplierList: null,
      ItemGroupList: null,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      RowSelected: null,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: true,
      stateDisable_show: false,
      ItemSupplierGridData: null,
      ItemId: null,
      SupplierId: null,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_supplierList();
    this.fn_itemGroupList();
  }
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

  cmbSupplier_onChange = (e) => {
    this.setState({
      SupplierId: e
    })
  };

  cmbItemGroup_onChange = (e) => {
    this.setState({
      ItemId: e
    })
  };


  btnSearch_onClick = async () => {
    this.setState({
      ItemSupplierGridData: await itemSupplierList(this.state.ItemId, this.state.SupplierId, this.props.User.token)
    })
  };

  btnUpdate_onClick = async () => {
    if (this.state.ItemListUpdated.length > 0) {
      const data = this.state.ItemListUpdated;
      const RESULT = await updateItemSupplier(data, this.props.User.token);
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

  itemsSupplierDataGrd_onUpdateRow = (params) => {
    // alert(JSON.stringify(params.newData))
    //alert(JSON.stringify(params.data))
    let tempItems = this.state.ItemListUpdated;
    let flagPush = true;
    for (let i = 0; i < tempItems.length; i++)
      if (tempItems[i].id === params.data.id) {
        tempItems[i].IsActive = params.data.isActive;
        tempItems[i].UnitWeight = params.data.unitWeight;
        tempItems[i].QtyPerPack = params.data.qtyPerPack;
        tempItems[i].QtyPerPack2 = params.data.qtyPerPack2;
        tempItems[i].MaxOrderWeight=params.data.maxOrderWeight;
        tempItems[i].MaxOrderRiali=params.data.maxOrderRiali;
        tempItems[i].MinOrderWeight=params.data.minOrderWeight;
        tempItems[i].MinOrderRiali=params.data.minOrderRiali;
        tempItems[i].SupplierId=this.state.SupplierId;
        flagPush = false;
        break;
      }
    if (flagPush) {
      let obj = {
        Id: params.data.id,
        IsActive: params.data.isActive,
        UnitWeight: params.data.unitWeight,
        QtyPerPack: params.data.qtyPerPack,
        QtyPerPack2: params.data.qtyPerPack2,
        MaxOrderRiali: params.data.maxOrderRiali,
        MaxOrderWeight:params.data.maxOrderWeight,
        MinOrderRiali:params.data.minOrderRiali,
        MinOrderWeight:params.data.minOrderWeight,
        SupplierId:this.state.SupplierId,
      };
      tempItems.push(obj);
    }

    this.setState({ ItemListUpdated: tempItems, flagSelectAll: false });
  };

  fn_EditAcDeItems(Status) {
    var tempItemSupplier = this.state.ItemSupplierGridData;
    this.setState({
      ItemListUpdated: [],
    });
    let tempItems = [];
    let obj = null;
    if (tempItemSupplier == null) {
      tempItemSupplier = [];
    }
    for (let i = 0; i < tempItemSupplier.length; i++) {
      obj = {
        id: tempItemSupplier[i].id,
        isActive: Status,
        unitWeight:tempItemSupplier[i].unitWeight,
        qtyPerPack:tempItemSupplier[i].qtyPerPack,
        qtyPerPack2:tempItemSupplier[i].qtyPerPack2
      };
      tempItems.push(obj);

      this.setState((state) => {
        const ItemSuppliers = state.ItemSupplierGridData.map((item, i) => {
          item.isActive = Status;
          item.qtyPerPack=tempItemSupplier[i].qtyPerPack;
          item.qtyPerPack2=tempItemSupplier[i].qtyPerPack2;
          item.unitWeight=tempItemSupplier[i].unitWeight;
          return item;
        });

        return {
          ItemSuppliers,
        };
      });
    }
    this.setState({
      ItemListUpdated: tempItems,
      //   ItemsLocations:tempItemLocation
    });
    console.log(JSON.stringify(tempItems));
  }

  rdoDeActiveAllItemSupplier_onChange = async () => {
    let result = confirm(
      "<i>آیا از غیرفعال کردن تمام کالاهای انتخاب شده، اطمینان دارید؟؟</i>",
      ""
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        this.setState({
          DeActiveAll: true,
          ActiveAll: false,
          flagSelectAll: true,
        });
        this.fn_EditAcDeItems(false);
      } else {
        this.setState({ DeActiveAll: false });
      }
    });
  };
  rdoActiveAllItemSupplier_onChange = () => {
    if (
      this.state.ItemSupplierGridData != null &&
      this.state.ItemSupplierGridData != []
    ) {
      let result = confirm(
        "<i>آیا از فعال کردن تمام کالاهای انتخاب شده، اطمینان دارید؟؟</i>",
        ""
      );
      result.then((dialogResult) => {
        if (dialogResult) {
          this.setState({
            DeActiveAll: false,
            ActiveAll: true,
            flagSelectAll: true,
          });
          this.fn_EditAcDeItems(true);
        } else {
          this.setState({ ActiveAll: false });
        }
      });
    } else alert("کالایی برای انتخاب وجود ندارد");
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
              <Label>تامین کننده کالا</Label>
            </Row>
            <Row>
              <Col xs={3}>
                <Label className="standardLabelFont">تامین کننده</Label>
                <SelectBox
                  dataSource={this.state.SupplierList}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="تامین کننده"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbSupplier_onChange}
                  value={this.state.SupplierId}
                />
                <Label
                  id="errSupplier"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col xs={3}>
                <Label className="standardLabelFont">گروه کالا</Label>
                <SelectBox
                  dataSource={this.state.ItemGroupList}
                  displayExpr="label"
                  placeholder="گروه کالا"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbItemGroup_onChange}
                  value={this.state.ItemId}
                />
                <Label
                  id="errItemGroup"
                  className="standardLabelFont errMessage"
                />
              </Col>
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
                  onClick={this.rdoActiveAllItemSupplier_onChange}
                  name="Active"
                  checked={this.state.ActiveAll}
                />
                <Label>فعال کردن تمام کالاهای تامین کننده</Label>
              </Col>
            </Row>
            <Row style={{ padding: "10px", direction: "rtl" }}>
              <Col xs="auto">
                <Input
                  type="radio"
                  value={this.state.DeActiveAll}
                  onClick={this.rdoDeActiveAllItemSupplier_onChange}
                  name="DeActive"
                  checked={this.state.DeActiveAll}
                />
                <Label>غیرفعال کردن تمام کالاهای تامین کننده</Label>
              </Col>
            </Row>
          </Row>
          <Row className="standardPadding">
            <Row>
              <Label className="title">لیست تامین کننده کالا</Label>
            </Row>

            <Row>
              <Col xs="auto" className="standardPadding">
                <DataGrid
                  dataSource={this.state.ItemSupplierGridData}
                  defaultColumns={DataGridItemSupplierColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowUpdated={this.itemsSupplierDataGrd_onUpdateRow}
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
                  <Editing mode="cell" allowUpdating={true} />
                  <FilterRow visible={true} />
                  <FilterPanel visible={true} />
                </DataGrid>
              </Col>
            </Row>
          </Row>
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
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(ItemSupplier);
