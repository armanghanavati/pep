import React from "react";
import { Toast } from "devextreme-react/toast";
import { connect } from "react-redux";
import { Button } from "devextreme-react/button";
import TagBox from "devextreme-react/tag-box";
import { confirm } from "devextreme/ui/dialog";
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

import {
  Gfn_BuildValueComboMulti,
  Gfn_ConvertComboForAll,
  Gfn_BuildValueComboSelectAll,
  Gfn_ExportToExcel,
} from "../../utiliy/GlobalMethods";
import { DataGridOrderPointSupplierColumns } from "./OrderSupplier-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { locationListOrderInventoryCombo } from "../../redux/reducers/location/location-actions";
import { locationActions } from "../../redux/reducers/location/location-slice";
import { supplierOrderSupplierComboList } from "../../redux/reducers/supplier/supplier-action";
import { transferOrderPointSupplierToKyan } from "../../redux/reducers/orderPointSupplier/orderPointSupplier-actions";
import { orderPointSupplierListByLocationSupplier } from "../../redux/reducers/orderPointSupplier/orderPointSupplier-actions";

import Wait from "../common/Wait";
import SearchIcon from "../../assets/images/icon/search.png";

import ConfirmIcon from "../../assets/images/icon/confirm.png";

class OrderSupplierConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cmbLocationGroups: [],
      cmbLocationGroupValue: [],
      cmbLocations: [],
      cmbLocationValue: [],
      cmbSupplier: null,      
      cmbSupplierValue: null,
      stateWait: false,
      OrderSupplierGridData: [],
      OrderSelected: [],
      stateEnable_btnUpdate: false,
      stateEnable_btnConfirm: false,
      stateEnable_btnReject: false,
      stateEnable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_CheckRequireState();
  }

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "order_supplier_confirm.update":
            this.setState({ stateEnable_btnUpdate: true });
            break;
          case "order_supplier_confirm.show":
            this.setState({ stateEnable_show: true });
            break;
          case "order_supplier_confirm.confirm":
            this.setState({ stateEnable_btnConfirm: true });
            break;
          case "order_supplier_confirm.reject":
            this.setState({ stateEnable_btnReject: true });
            break;
        }
      }
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
        cmbSupplier: await supplierOrderSupplierComboList(
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
    let data=await Gfn_ConvertComboForAll(e,this.state.cmbSupplier)  
    const TEMP_cmbSupplier = await Gfn_BuildValueComboMulti(data)
    
    this.setState({
      cmbSupplierValue: TEMP_cmbSupplier,      
    });    
  };

  btnSearch_onClick = async () => {
    let flagSend = true;
    document.getElementById("errLocation").innerHTML = "";
    document.getElementById("errSupplier").innerHTML = "";  
    if (
      this.state.cmbLocationValue === null ||
      this.state.cmbLocationValue == ""
    ) {
      const msg = "فروشگاه را انتخاب نمائید.";
      document.getElementById("errLocation").innerHTML = msg;
      flagSend = false;
    }
    if (this.state.cmbSupplierValue === null  || this.state.cmbSupplierValue == "") {
        const msg= "تامین کننده را انتخاب نمائید.";
        document.getElementById("errSupplier").innerHTML = msg; 
        flagSend = false;
      }

    if (flagSend) {
      this.OpenCloseWait();
      const OBJ = {
        locationIds: this.state.cmbLocationValue,
        supplierIds: this.state.cmbSupplierValue,
        itemIds: null,
        inventoryId: 0,
      };
      // alert(JSON.stringify(OBJ))
      this.setState({
        OrderSupplierGridData: await orderPointSupplierListByLocationSupplier(
          OBJ,
          this.props.User.token
        ),
      });

      this.OpenCloseWait();
    }
  };

  grdOrderPointSupplier_onSelectionChanged = ({
    selectedRowKeys,
    selectedRowsData,
  }) => {
    console.log(JSON.stringify(selectedRowsData));
    let temp = [];
    for (let i = 0; i < selectedRowsData.length; i++) {
      let obj = { value: selectedRowsData[i].id };
      temp.push(obj);
    }
    this.setState({ OrderSelected: temp });
  };

  btnConfirm_onClick = async () => {
    // alert(JSON.stringify(this.state.OrderSelected))
    if (this.state.OrderSelected.length > 0) {
      let result = confirm(
        "<i>از انتقال سفارشات  فروشگاه، تامین کننده مورد نظر،اطمینان دارید؟</i>",
        "Confirm changes"
      );
      result.then(async(dialogResult) => {
        if (dialogResult) {
          this.OpenCloseWait();
          let data = {
            values: JSON.stringify(this.state.OrderSelected),
          };
          let RTN = false;
          RTN = await transferOrderPointSupplierToKyan(
            data,
            this.props.User.token
          );
          this.setState({
            ToastProps: {
              isToastVisible: true,
              Message:RTN ? "انتقال با موفقیت انجام شد." : "عدم انتقال",
              Type:RTN ? "success" : "error",
            },
          });
          this.OpenCloseWait();
        }
      });
    } else alert("سفارشی انتخاب نشده است.");
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
              <Label>انتقال سفارشات تامین کننده به کیان</Label>
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
                <Label id="errSupplier" className="standardLabelFont errMessage" />
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
              <Label className="title">تائید سفارشات تامین کننده</Label>
            </Row>
            <Row className="standardSpaceTop">
              <Col xs="auto" className="standardMarginRight">
                <DataGrid
                  id="grdOrderPointInventory"
                  dataSource={this.state.OrderSupplierGridData}
                  defaultColumns={DataGridOrderPointSupplierColumns}
                  keyExpr="id"
                  columnAutoWidth={true}
                  allowColumnReordering={true}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  columnResizingMode="widget"
                  onSelectionChanged={
                    this.grdOrderPointSupplier_onSelectionChanged
                  }
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
                  <HeaderFilter visible={true} />
                </DataGrid>
              </Col>
            </Row>
            <Row className="standardSpaceTop">
              {this.state.stateEnable_btnConfirm && (
                <Col xs="auto" className="standardMarginRight">
                  <Button
                    icon={ConfirmIcon}
                    text="تائید نهایی سفارشات"
                    type="success"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnConfirm_onClick}
                  />
                </Col>
              )}
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
  Company: state.companies,
});

export default connect(mapStateToProps)(OrderSupplierConfirm);
