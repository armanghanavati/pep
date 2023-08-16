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
} from "devextreme-react/data-grid";
import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  DataGridDefaultHeight,
  ToastTime,
  ToastWidth,
} from "../../config/config";

import { 
    itemListCombo 
} from "../../redux/reducers/item/item-action";
import { itemActions } from "../../redux/reducers/item/item-slice";

import SearchIcon from '../../assets/images/icon/search.png'

const products = [
  {
    id: 1,
    locationName: "HD Video Player",
    Price: 330,
    Current_Inventory: 225,
    Backorder: 0,
    Manufacturing: 10,
    Category: "Video Players",
    ImageSrc: "images/products/1.png",
  },
  {
    id: 2,
    locationName: "SuperHD Video Player",
    Price: 400,
    Current_Inventory: 150,
    Backorder: 0,
    Manufacturing: 25,
    Category: "Video Players",
    ImageSrc: "images/products/2.png",
  },
];

class OrderInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Locations: null,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  async componentDidMount(){
    await this.fn_CheckRequireState();
  }

  fn_CheckRequireState=async()=>{
    if(this.props.Item.itemCombo==null){
        let itemCombo=await itemListCombo(this.props.User.token);
        this.props.dispatch(            
            itemActions.setItemCombo({
                itemCombo                    
            }),                
        );          
    }        
  }

  cmbRetailStoreGroup_onChange = (e) => {
    alert(e);
  };

  cmbItem_onChange=(e)=>{
    alert(e)
  }

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
              <Label>سفارش از انبار</Label>
            </Row>
            <Row>
              <Col>
                <Label className="standardLabelFont">گروه فروشگاه</Label>
                <TagBox
                  //   dataSource={this.props.Location.locationPermission}
                  dataSource={products}
                  searchEnabled={true}
                  displayExpr="locationName"
                  placeholder="گروه فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbRetailStoreGroup_onChange}
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">فروشگاه</Label>
                <TagBox
                  dataSource={this.state.Locations}
                  searchEnabled={true}
                  displayExpr="locationName"
                  placeholder="فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbRetailStore_onChange}
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">تامین کننده</Label>
                <TagBox
                  dataSource={this.props.Supplier.activeSuppliers}
                  searchEnabled={true}
                  displayExpr="supplierName"
                  placeholder="تامین کننده"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbSupplier_onChange}
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">کالا</Label>
                <TagBox
                  dataSource={this.props.Item.itemCombo}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="کالا"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbItem_onChange}
                />
              </Col>
            </Row>
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
          </Row>
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label className="title">لیست سفارشات از انبار</Label>
            </Row>
            <Row>
              <Col xs="auto" className="standardMarginRight">
                {/* <DataGrid
                  dataSource={this.state.SupplierGridData}
                  defaultColumns={DataGridSupplierColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowClick={this.grdSupplier_onClickRow}
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
                </DataGrid> */}
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
  Item : state.items,
});

export default connect(mapStateToProps)(OrderInventory);
