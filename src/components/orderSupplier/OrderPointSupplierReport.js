import React from "react";
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
import { locale } from "devextreme/localization";
import SelectBox from "devextreme-react/select-box";
import TagBox from "devextreme-react/tag-box";
import { Button } from "devextreme-react/button";
import DateBox from 'devextreme-react/date-box';
import { CheckBox } from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";
import { Tooltip } from "devextreme-react/tooltip";
import AdapterJalali from '@date-io/date-fns-jalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
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
  Export
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
  itemListComboBySupplierId,
} from "../../redux/reducers/item/item-action";
import { supplierOrderInventoryComboList } from "../../redux/reducers/supplier/supplier-action";
import { locationListOrderInventoryCombo } from "../../redux/reducers/location/location-actions";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import {
  orderSupplierReport,
} from "../../redux/reducers/orderPointSupplier/orderPointSupplier-actions";
import {
  logsOPITodayListByUserId,
  logsOPIByOPIid,
} from "../../redux/reducers/logsOrderPointInventory/logsOrderPointInventory-actions";

import {
  Gfn_BuildValueComboMulti,
  Gfn_ConvertComboForAll,
  Gfn_BuildValueComboSelectAll,
  Gfn_ExportToExcel,
  Gfn_DT2StringSql,
} from "../../utiliy/GlobalMethods";
import { Template } from "devextreme-react";

import { DataGridOrderPointSupplierColumns } from "./OrderSupplier-config";

import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import UpdateIcon from "../../assets/images/icon/update.png";

const dateLabel = { 'aria-label': 'Date' };

class OrderPointSupplierReport extends React.Component {
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
      cmbItemsValue: null,
      OrderPointSupplierGridData: null,                  
      stateEnable_show: false,      
      FromDate: new Date(),
        ToDate: new Date(),
        FromDateapi: "",
        ToDateapi: "",
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  async componentDidMount() {    
    await this.fn_CheckRequireState();
    // alert('CompanyId='+this.props.Company.currentCompanyId)
  }
  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }

  fn_CheckRequireState = async () => {
    if(this.props.Company.currentCompanyId==null){
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
        locationPermission      
      })
    );

    this.setState({      
      cmbSupplier: await supplierOrderInventoryComboList(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  cmbRetailStoreGroup_onChange = async (e) => {
    const IDS = e.toString().split(",");    
    const TEMP_LocationGroup = this.props.Location.locationPermission;
    if(IDS.includes('0'))
      this.setState({
        cmbLocation:  TEMP_LocationGroup,
        cmbLocationGroupValue: 0,
      });
    else{
      let tempLocation = [];
      for (let i = 0; i < IDS.length; i++)
        for (let j = 0; j < TEMP_LocationGroup.length; j++)
          if (IDS[i] == TEMP_LocationGroup[j].id)
            tempLocation.push(TEMP_LocationGroup[j]);
      this.setState({
        cmbLocation:  tempLocation,
        cmbLocationGroupValue: await Gfn_BuildValueComboMulti(e),
      });
    }
  };

  cmbRetailStore_onChange = async (e) => {
    let data=await Gfn_ConvertComboForAll(e,this.state.cmbLocation)  
    this.setState({ cmbLocationValue: await Gfn_BuildValueComboMulti(data) });
  };

  cmbSupplier_onChange = async (e) => {    
    let data=await Gfn_ConvertComboForAll(e,this.state.cmbSupplier)  
    const TEMP_cmbSupplier = await Gfn_BuildValueComboMulti(data)
    this.setState({
      cmbSupplierValue: TEMP_cmbSupplier,
      // cmbItems: TEMP_cmbSupplier == null? null: await itemListComboBySupplierId(TEMP_cmbSupplier,this.props.User.token),      
    });
    const ITEMS=TEMP_cmbSupplier == null? null: await itemListComboBySupplierId(TEMP_cmbSupplier,this.props.User.token);
    const LAZY=new DataSource({
      store: ITEMS,
      paginate:true,
      pageSize:10
    })
    this.setState({
      cmbItems:LAZY,
      cmbItemsOrg:ITEMS
    })

  };

  cmbItem_onChange = async (e) => {   
    let data=await Gfn_ConvertComboForAll(e,this.state.cmbItemsOrg)
    this.setState({ cmbItemsValue: await Gfn_BuildValueComboMulti(data)});
  };

  btnSearch_onClick = async () => {
    this.OpenCloseWait();    
    const OBJ = {
      locationIds: this.state.cmbLocationValue,
      supplierIds: this.state.cmbSupplierValue,
      itemIds: this.state.cmbItemsValue,
      fromDate: this.state.FromDate,
      toDate: this.state.ToDate
    };   
    console.log(JSON.stringify(OBJ)) 
    this.setState({
      OrderPointSupplierGridData: await orderSupplierReport(
        OBJ,
        this.props.User.token
      ),
    });
    this.OpenCloseWait();
  };  

  
  // grdOrderPointSupplier_onCellDblClick = async (e) => {
  //   const LogsOfOPI = await logsOPIByOPIid(e.data.id, this.props.User.token);
  //   this.props.dispatch(
  //     logsOrderPointInventoryActions.setLogsOrderPointInventoryByOPIid({
  //       LogsOfOPI,
  //     })
  //   );
  // };
  
  btnExportExcel_onClick=()=>{
    Gfn_ExportToExcel(this.state.OrderPointSupplierGridData,"OrderPointSupplier")
  }
  
  DatePickerFrom_onChange =(params)=>{   
    // alert(params) 
    this.setState({ FromDate: params, FromDateapi: Gfn_DT2StringSql(params) })
  }

  DatePickerTo_onChange = (params) => {        
    this.setState({ ToDate: params, ToDateapi: Gfn_DT2StringSql(params) })
}

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
              <Label>گزارش سفارش از تامین کننده</Label>
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
              </Col>
              <Col>
                <Label className="standardLabelFont">کالا</Label>
                <TagBox
                  dataSource={this.state.cmbItems}
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
                    <LocalizationProvider dateAdapter={AdapterJalali}>
                        <DesktopDatePicker 
                            label="از تاریخ"                                      
                            value={this.state.FromDate}
                            onChange={this.DatePickerFrom_onChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Col>
                <Col xs="auto">
                    <LocalizationProvider dateAdapter={AdapterJalali}>
                        <DesktopDatePicker 
                            label="تا تاریخ"                                    
                            value={this.state.ToDate}
                            onChange={this.DatePickerTo_onChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
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
              <Label className="title">لیست سفارشات از تامین کننده</Label>
            </Row>            
            <Row style={{direction:'ltr'}}>
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
                  id="grdOrderPointInventory"
                  dataSource={this.state.OrderPointSupplierGridData}
                  defaultColumns={DataGridOrderPointSupplierColumns}
                  keyExpr="id"
                  columnAutoWidth={true}
                  allowColumnReordering={true}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  columnResizingMode="widget"
                  onCellDblClick={this.grdOrderPointSupplier_onCellDblClick}  
             
                  //   onSelectionChanged={
                  //     this.grdOrderPointInventory_onSelectionChanged
                  //   }
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
  OrderPointInventory: state.orderPointInventories,
  LogsOrderPointInventory: state.logsOrderPointInventories,
});

export default connect(mapStateToProps)(OrderPointSupplierReport);
