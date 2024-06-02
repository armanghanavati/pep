import React, { Suspense } from "react";
import { connect } from "react-redux";
import DataSource from "devextreme/data/data_source";
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
import TagBox from "devextreme-react/tag-box";
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

import { itemActions } from "../../redux/reducers/item/item-slice";
import { locationActions } from "../../redux/reducers/location/location-slice";
import { companyActions } from "../../redux/reducers/company/company-slice";

import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { locationListOrderInventoryCombo } from "../../redux/reducers/location/location-actions";
import { supplierComboListByCompanyId } from "../../redux/reducers/supplier/supplier-action";
import { itemListComboBySupplierId } from "../../redux/reducers/item/item-action";
import { orderPointListByLSI, orderPointUpdate } from "../../redux/reducers/orderPoint/orderPoint-actions";

import {
  Gfn_BuildValueComboMulti,
  Gfn_ConvertComboForAll,
  Gfn_BuildValueComboSelectAll,
  Gfn_ExportToExcel,
} from "../../utiliy/GlobalMethods";

import { DataGridOrderPointColumns } from "./OrderPoint-config";
import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import UpdateIcon from "../../assets/images/icon/update.png";

class OrderPoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateWait: false,
      cmbLocationGroupValue: null,
      cmbLocation: null,
      cmbLocationValue: null,
      cmbSupplier: null,
      cmbSupplierValue: null,
      cmbItems: null,
      cmItemsOrg: null,
      cmbItemsValue: null,
      stateEnable_btnAdd: false,
      stateEnable_btnUpdate: false,
      stateEnable_show: false,
      OrderPointGridData: null,
      OrderPointEdited: [],
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    // alert('CompanyId='+this.props.Company.currentCompanyId)
  }

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "order_point.update":
            this.setState({ stateEnable_btnUpdate: true });
            break;
          case "order_point.insert":
            this.setState({ stateEnable_btnAdd: true });
            break;
          case "order_point.show":
            this.setState({ stateEnable_show: true });
            break;
        }
      }
  };

  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }

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

    const locationPermission = await locationListOrderInventoryCombo(
      this.props.Company.currentCompanyId,
      this.props.User.token
    );

    this.props.dispatch(
      locationActions.setLocationPermission({
        locationPermission,
      })
    );

    this.setState({
      cmbSupplier: await supplierComboListByCompanyId(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  cmbRetailStoreGroup_onChange = async (e) => {
    const IDS = e.toString().split(",");
    const TEMP_LocationGroup = this.props.Location.locationPermission;
    if (IDS.includes("0"))
      this.setState({
        cmbLocation: TEMP_LocationGroup,
        cmbLocationGroupValue: 0,
      });
    else {
      let tempLocation = [];
      for (let i = 0; i < IDS.length; i++)
        for (let j = 0; j < TEMP_LocationGroup.length; j++)
          if (IDS[i] == TEMP_LocationGroup[j].id)
            tempLocation.push(TEMP_LocationGroup[j]);
      this.setState({
        cmbLocation: tempLocation,
        cmbLocationGroupValue: await Gfn_BuildValueComboMulti(e),
      });
    }
  };

  cmbRetailStore_onChange = async (e) => {
    let data = await Gfn_ConvertComboForAll(e, this.state.cmbLocation);
    this.setState({ cmbLocationValue: await Gfn_BuildValueComboMulti(data) });
  };

  cmbSupplier_onChange = async (e) => {
    let data = await Gfn_ConvertComboForAll(e, this.state.cmbSupplier);
    const TEMP_cmbSupplier = await Gfn_BuildValueComboMulti(data);

    this.setState({
      cmbSupplierValue: TEMP_cmbSupplier,
      // cmbItems: TEMP_cmbSupplier == null? null: await itemListComboBySupplierId(TEMP_cmbSupplier,this.props.User.token),
    });
    const ITEMS =
      TEMP_cmbSupplier == null
        ? null
        : await itemListComboBySupplierId(
          TEMP_cmbSupplier,
          this.props.User.token
        );
    const LAZY = new DataSource({
      store: ITEMS,
      paginate: true,
      pageSize: 10,
    });
    this.setState({
      cmbItems: LAZY,
      cmbItemsOrg: ITEMS,
    });
  };

  cmbItem_onChange = async (e) => {
    let data = await Gfn_ConvertComboForAll(e, this.state.cmbItemsOrg);
    this.setState({
      cmbItemsValue: await Gfn_BuildValueComboMulti(data),
    });
  };

  btnSearch_onClick = async () => {
    let flagSend = true;

    document.getElementById("errLocation").innerHTML = "";
    document.getElementById("errItem").innerHTML = "";
    document.getElementById("errSupplier").innerHTML = "";
    if (
      this.state.cmbLocationValue === null ||
      this.state.cmbLocationValue == ""
    ) {
      const msg = "فروشگاه را انتخاب نمائید.";
      document.getElementById("errLocation").innerHTML = msg;
      flagSend = false;
    }

    if (this.state.cmbItemsValue === null || this.state.cmbItemsValue == "") {
      const msg = "کالا را انتخاب نمائید.";
      document.getElementById("errItem").innerHTML = msg;
      flagSend = false;
    }

    if (
      this.state.cmbSupplierValue === null ||
      this.state.cmbSupplierValue == ""
    ) {
      const msg = "تامین کننده را انتخاب نمائید.";
      document.getElementById("errSupplier").innerHTML = msg;
      flagSend = false;
    }

    if (flagSend) {
      this.OpenCloseWait();
      const OBJ = {
        locationIds: this.state.cmbLocationValue,
        supplierIds: this.state.cmbSupplierValue,
        itemIds: this.state.cmbItemsValue,
        inventoryId: this.state.cmbInventoryvalue,
      };
      //   alert(JSON.stringify(OBJ))
      this.setState({
        OrderPointGridData: await orderPointListByLSI(
          OBJ,
          this.props.User.token
        ),
      });

      this.OpenCloseWait();
    }
  };

  grdOrderPoint_onRowUpdated = (params) => {
    if (this.state.stateEnable_btnUpdate)
      this.api_UpdateOrderPoint(params.data.id, params.data.maxMojoodiRooz, params.data.minMojoodiRooz, params.data.ledTime)
    else
      alert('کاربر گرامی شما دسترسی ویرایش ندارید. لطفا با ادمین تماس بگیرید.')

  }

  async api_UpdateOrderPoint(orderPintId, maxMojoodiRooz, minMojoodiRooz, ledTime) {
    this.OpenCloseWait();
    let data = {
      orderPointId: orderPintId,
      maxMojoodiRooz: maxMojoodiRooz,
      minMojoodiRooz: minMojoodiRooz,
      ledTime: ledTime
    }
    const RTN = await orderPointUpdate(data, this.props.User.token);
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: RTN == 1 ? ",ویرایش با موفقیت انجام گردید." : "خطا در ویرایش",
        Type: RTN == 1 ? "success" : "error",
      },
    });
    this.OpenCloseWait();
  }

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(this.state.OrderPointGridData, "OrderPoint");
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
              <Label>سفارش از انبار</Label>
            </Row>
            <Row>
              <Col>
                <Label className="standardLabelFont">گروه فروشگاه</Label>
                <TagBox
                  dataSource={this.props.Location.locationPermission}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="گروه فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbRetailStoreGroup_onChange}
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">فروشگاه</Label>
                <TagBox
                  dataSource={this.state.cmbLocation}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbRetailStore_onChange}
                />
                <Label
                  id="errLocation"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">تامین کننده</Label>
                <TagBox
                  dataSource={this.state.cmbSupplier}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="تامین کننده"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbSupplier_onChange}
                />
                <Label
                  id="errSupplier"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">کالا</Label>
                <Suspense fallback={<div>Loading</div>}>
                  <TagBox
                    dataSource={this.state.cmbItems}
                    searchEnabled={true}
                    displayExpr="label"
                    placeholder="کالا"
                    valueExpr="id"
                    rtlEnabled={true}
                    onValueChange={this.cmbItem_onChange}
                  />
                </Suspense>
                <Label id="errItem" className="standardLabelFont errMessage" />
              </Col>
            </Row>
            {this.state.stateEnable_show && (
              <Row className="standardSpaceTop">
                <Col xs="auto">
                  <Button
                    icon={SearchIcon}
                    text="جستجو"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnSearch_onClick}
                  />
                </Col>
              </Row>
            )}
          </Row>
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label className="title">لیست نقطه سفارشات</Label>
            </Row>
            <Row style={{ direction: 'ltr' }}>
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
            <Row className="standardSpaceTop">
              <Col xs="auto" className="standardMarginRight">
                <DataGrid
                  id="grdOrderPoint"
                  dataSource={this.state.OrderPointGridData}
                  defaultColumns={DataGridOrderPointColumns}
                  keyExpr="id"
                  columnAutoWidth={true}
                  allowColumnReordering={true}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  columnResizingMode="widget"
                  onRowUpdated={this.grdOrderPoint_onRowUpdated}
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
                  {this.state.stateShowRoute && (
                    <Selection
                      mode="multiple"
                      selectAllMode={ALL_MOD}
                      showCheckBoxesMode={CHECK_BOXES_MOD}
                    />
                  )}
                  <Editing mode="cell" allowUpdating={true} />
                  <FilterRow visible={true} />
                  <HeaderFilter visible={true} />
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
  Location: state.locations,
  Supplier: state.suppliers,
  Item: state.items,
  Company: state.companies,
});

export default connect(mapStateToProps)(OrderPoint);
