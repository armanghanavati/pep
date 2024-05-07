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
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";

import Wait from "../common/Wait";

import { DataGridOrderPointInventoryNewGroupColumns } from "./OrderInventory-config";

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

import { activeSupplierComboList } from "../../redux/reducers/supplier/supplier-action";
import { itemListRemainBySupplierId } from "../../redux/reducers/item/item-action";
import { insertNewDataGroupOrderPointInventory } from "../../redux/reducers/OrderPointInventory/orderPointInventory-actions";
import { locationListOrderInventoryComboNew } from "../../redux/reducers/location/location-actions";

import SaveIcon from '../../assets/images/icon/save.png'

class OrderInventoryNewGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cmbLocationGroups:null,
      cmbSuppliers: null,
      cmbSupplierValue: null,
      cmbInventory:null,
      cmbInventoryvalue:null,
      cmbLocation: null,
      cmbLocationValue: null,
      ItemsGridData: null,
      NewDataGroup: [],
      stateWait: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  async componentDidMount() {
    this.fn_CheckRequireState();
  }

  fn_CheckRequireState = async () => {
    this.setState({      
      cmbInventory:this.props.Inventory.inventoryCombo,
      cmbLocationGroups: await locationListOrderInventoryComboNew(this.props.Company.currentCompanyId,this.props.User.token),
    });
  };

  cmbLocationGroup_onChange = async (e) => {
    const TEMP_LocationGroup = this.props.Location.locationPermission;
    let tempLocation = [];
    for (let j = 0; j < TEMP_LocationGroup.length; j++)
      if (e == TEMP_LocationGroup[j].id)
        tempLocation.push(TEMP_LocationGroup[j]);
    this.setState({
      cmbLocation: tempLocation,
    });
  };

  cmbLocation_onChange = async (e) => {
    this.setState({ cmbLocationValue: e, cmbSupplierValue: null });
  };

  cmbInventory_onChange=async(e)=>{
    this.setState({
      cmbInventoryvalue:e,
      cmbSuppliers: await activeSupplierComboList(this.props.User.token),
    })
  }

  cmbSupplier_onChange = async (e) => {
    this.OpenCloseWait();
    const OBJ = {
      SupplierId: e,
      LocationId: this.state.cmbLocationValue,
    };
    this.setState({
      cmbSupplierValue: e,
      ItemsGridData: await itemListRemainBySupplierId(
        OBJ,
        this.props.User.token
      ),
    });
    this.OpenCloseWait();
  };

  grdOrderPointInventoryNewGroup_onRowUpdating = (params) => {
    let NewOrder = this.state.NewDataGroup;
    let flagPush = true;
    if (
      parseInt(params.newData.order) % params.oldData.qtyPerPack !== 0 ||
      parseInt(params.newData.order) <= 0
    ) {
      alert("تعداد سفارش باید ضریبی از واحد بسته بندی باشد.");
      params.cancel = true;
      flagPush = false;
    }
    if (parseInt(params.newData.order) > params.oldData.mojoodiSetad) {
      alert("تعداد سفارش بیشتر از موجودی ستاد می باشد.");
      params.cancel = true;
      flagPush = false;
    }
    for (let i = 0; i < NewOrder.length; i++)
      if (params.oldData.id == NewOrder[i].ItemId && flagPush) {
        NewOrder[i].NumberOrder = parseInt(params.newData.order);
        flagPush = false;
      }
    if (flagPush) {
      let temp = {
        LocationId: this.state.cmbLocationValue,
        InventoryId: this .state.cmbInventoryvalue,
        SupplierId: this.state.cmbSupplierValue,
        ProductId: params.oldData.id,
        NumberOrder: parseInt(params.newData.order),
        UserId: parseInt(this.props.User.userId),
      };
      NewOrder.push(temp);
    }
    this.setState({ NewDataGroup: NewOrder });
  };


  btnSaveGroup_onClick=async()=>{
    this.OpenCloseWait();     
    let data = {
        values: JSON.stringify(this.state.NewDataGroup)
    }
    const RTN=await insertNewDataGroupOrderPointInventory(data,this.props.User.token)
    
    this.OpenCloseWait();
    this.setState({        
      ToastProps: {
        isToastVisible: true,        
        Message: RTN.MSG,
        Type: "info" ,
      },
    });    
  }

  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }
  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  render() {
    return (
      <div style={{ direction: "rtl" }}>
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
        <Row>
          <Col>
            <Label className="standardLabelFont">گروه فروشگاه</Label>
            <SelectBox
              dataSource={this.state.cmbLocationGroups}
              displayExpr="label"
              placeholder="گروه فروشگاه"
              valueExpr="id"
              searchEnabled={true}
              rtlEnabled={true}
              onValueChange={this.cmbLocationGroup_onChange}
              className="fontStyle"
            />
          </Col>
          <Col>
            <Label className="standardLabelFont">فروشگاه</Label>
            <SelectBox
              dataSource={this.state.cmbLocation}
              displayExpr="label"
              placeholder="فروشگاه"
              valueExpr="id"
              searchEnabled={true}
              rtlEnabled={true}
              value={this.state.cmbLocationValue}
              onValueChange={this.cmbLocation_onChange}
              className="fontStyle"
            />
            <Label id="errLocation" className="standardLabelFont errMessage" />
          </Col>
          <Col>
              <Label className="standardLabelFont">انبار</Label>
              <SelectBox
              dataSource={this.state.cmbInventory}
              searchEnabled={true}
              displayExpr="label"
              placeholder="انبار"
              valueExpr="id"
              rtlEnabled={true}
              onValueChange={this.cmbInventory_onChange}
              className="fontStyle"
              />
              <Label id="errInventory" className="standardLabelFont errMessage" />
          </Col>
          <Col>
            <Label className="standardLabelFont">تامین کننده</Label>
            <SelectBox
              dataSource={this.state.cmbSuppliers}
              displayExpr="label"
              placeholder="تامین کننده"
              valueExpr="id"
              searchEnabled={true}
              rtlEnabled={true}
              value={this.state.cmbSupplierValue}
              onValueChange={this.cmbSupplier_onChange}
              className="fontStyle"
            />
            <Label id="errSupplier" className="standardLabelFont errMessage" />
          </Col>
        </Row>
        <Row className="standardSpaceTop">
          <Col xs="auto">
            <DataGrid
              id="grdOrderPointInventory"
              dataSource={this.state.ItemsGridData}
              defaultColumns={DataGridOrderPointInventoryNewGroupColumns}
              keyExpr="id"
              columnAutoWidth={true}
              allowColumnReordering={true}
              showBorders={true}
              rtlEnabled={true}
              allowColumnResizing={true}
              columnResizingMode="widget"
              onRowUpdating={this.grdOrderPointInventoryNewGroup_onRowUpdating}
              className="fontStyle"
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
                // showPageSizeSelector={true}
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
              {/* <FilterPanel visible={true} />                   */}
              <HeaderFilter visible={true} />
            </DataGrid>
          </Col>
        </Row>
        <Row>
          <Col xs="auto">
            <Button
              icon={SaveIcon}
              text="ذخیره"
              type="success"
              stylingMode="contained"
              rtlEnabled={true}
              onClick={this.btnSaveGroup_onClick}
              className="fontStyle"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Location: state.locations,
  Company: state.companies,
  Inventory: state.inventories, 
});

export default connect(mapStateToProps)(OrderInventoryNewGroup);
