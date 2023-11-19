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

class RealEstate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cmbCities: null,
      cmbStates: null,      
      txtFullAddressValue: null,
      txtLatValue:null,
      txtLongValue:null,
      txtAreaValue:null,
      txtRoofStatusDescValue:null,
      txtFloorStatusDescValue:null,
      txtWallStatusDescValue:null,
      txtLightStatusDescValue:null,
      txtDoorStatusDescValue:null,
      txtElectricityStatusDescValue:null,
      txtWcStatusValue:null,
      txtFrontStatusDescValue:null,
      txtFrontNumberValue:null,
      txtStreetWidthValue:null,
      cmbParkings:null,
      cmbParkingValue:null,
      txtCoolingStatusValue:null,
      txtHeatingStatusValue:null,
      txtPedestrianNumberValue:null,
      txtForcastOfHouseholdNumberValue:null,
      cmbNearEstate:null,
      cmbNearEstateValue:null,
      cmbPanelStatus:null,
      cmbPanelStatusValue:null,
      txtDocumentStatusValue:null,
      txtMortgageOfYearValue:null,
      txtRentOfMonthValue:null,
      txtAdvantagesDescValue:null,
      txtDisadvantagesDescValue:null,
      txtSupplementaryDescValue:null,
      chkIsBalcony:false,
      chkIsInventory:false,
      chkIsBasement:false,
      chkIsDoorRollup:false,
      chkWaterStatus:false,
      chkGasStatus:false,
      stateWait: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  chkIsBalcony_onChange=()=>{
    this.setState({chkIsBalcony:!this.state.chkIsBalcony})
  }
  chkIsInventory_onChange=()=>{
    this.setState({chkIsInventory:!this.state.chkIsInventory})
  }
  chkIsBasement_onChange=()=>{
    this.setState({chkIsBasement:!this.state.chkIsBasement})
  }
  chkIsDoorRollup_onChange=()=>{
    this.setState({chkIsDoorRollup:!this.state.chkIsDoorRollup})
  }
  chkWaterStatus_onChange=()=>{
    this.setState({chkWaterStatus:!this.state.chkWaterStatus})
  }
  chkGasStatus_onChange=()=>{
    this.setState({chkGasStatus:!this.state.chkGasStatus})
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
        {this.state.stateWait && (
          <Row className="text-center">
            <Col style={{ textAlign: "center", marginTop: "10px" }}>
              <Wait />
            </Col>
          </Row>
        )}
        <Card className="shadow bg-white border pointer">
          <div className="standardPadding">
            <Row>
              <Col>
                <Label className="standardLabelFont">استان</Label>
                <SelectBox
                  dataSource={this.state.cmbStates}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="استان"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbStates_onChange}
                />
                <Label
                  id="errStates"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">شهر</Label>
                <SelectBox
                  dataSource={this.state.cmbCities}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="شهر"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbCities_onChange}
                />
                <Label
                  id="errCities"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont" style={{ width: "500px" }}>
                  آدرس کامل
                </Label>
                <TextBox
                  defaultValue={this.state.txtFullAddressValue}
                  showClearButton={true}
                  // placeholder="آدرس کامل"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtFullAddress_onChanege}
                />
                <Label
                  id="errFullAddress"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">طول جغرافیایی</Label>
                <TextBox
                  defaultValue={this.state.txtLongValue}
                  showClearButton={true}
                  // placeholder="طول جغرافیایی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtLong_onChanege}
                />
                <Label id="errLong" className="standardLabelFont errMessage" />
              </Col>
              <Col>
                <Label className="standardLabelFont">عرض جغرافیایی</Label>
                <TextBox
                  defaultValue={this.state.txtLatValue}
                  showClearButton={true}
                  // placeholder="عرض جغرافیایی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtLat_onChanege}
                />
                <Label id="errLat" className="standardLabelFont errMessage" />
              </Col>
              <Col>
                <Label className="standardLabelFont">مساحت</Label>
                <TextBox
                  defaultValue={this.state.txtAreaValue}
                  showClearButton={true}
                  // placeholder="مساحت"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtArea_onChanege}
                />
                <Label id="errArea" className="standardLabelFont errMessage" />
              </Col>
            </Row>
            <div className="line"></div>            
            <Row>
              <Col>
                <Label className="standardLabelFont">وضعیت سقف</Label>
                <TextBox
                  defaultValue={this.state.txtFloorStatusDescValue}
                  showClearButton={true}
                  // placeholder="وضعیت سقف"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtFloorStatusDesc_onChanege}
                />
                <Label
                  id="errFloorStatusDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">وضعیت کف</Label>
                <TextBox
                  defaultValue={this.state.txtRoofStatusDescValue}
                  showClearButton={true}
                  // placeholder="وضعیت کف"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtRoofStatusDesc_onChanege}
                />
                <Label
                  id="errRoofStatusDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>

              <Col>
                <Label className="standardLabelFont">وضعیت دیوار</Label>
                <TextBox
                  defaultValue={this.state.txtWallStatusDescValue}
                  showClearButton={true}
                  // placeholder="وضعیت دیوار"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtWallStatusDesc_onChanege}
                />
                <Label
                  id="errWallStatusDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">وضعیت روشنایی</Label>
                <TextBox
                  defaultValue={this.state.txtLightStatusDescValue}
                  showClearButton={true}
                  // placeholder="وضعیت روشنایی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtLightStatusDesc_onChanege}
                />
                <Label
                  id="errLightStatusDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">وضعیت درب ورودی</Label>
                <TextBox
                  defaultValue={this.state.txtDoorStatusDescValue}
                  showClearButton={true}
                  // placeholder="وضعیت درب ورودی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtDoorStatusDesc_onChanege}
                />
                <Label
                  id="errDoorStatusDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">وضعیت برق</Label>
                <TextBox
                  defaultValue={this.state.txtElectricityStatusDescValue}
                  showClearButton={true}
                  // placeholder="وضعیت برق"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtElectricityStatusDesc_onChanege}
                />
                <Label
                  id="errElectricityStatusDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
            </Row>
            <div className="line"></div>            
            <Row>
              <Col>
                <Label className="standardLabelFont">وضعیت سرویس بهداشتی</Label>
                <TextBox
                  defaultValue={this.state.txtWcStatusValue}
                  showClearButton={true}
                  // placeholder="وضعیت سرویس بهداشتی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtWcStatus_onChanege}
                />
                <Label
                  id="errWcStatus"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">وضعیت بر ملک</Label>
                <TextBox
                  defaultValue={this.state.txtFrontStatusDescValue}
                  showClearButton={true}
                  // placeholder="وضعیت بر ملک"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtFrontStatusDesc_onChanege}
                />
                <Label
                  id="errFrontStatusDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">تعداد بر ملک</Label>
                <TextBox
                  defaultValue={this.state.txtFrontNumberValue}
                  showClearButton={true}
                  // placeholder="تعداد بر ملک"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtFrontNumber_onChanege}
                />
                <Label
                  id="errFrontNumber"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">عرض خیابان</Label>
                <TextBox
                  defaultValue={this.state.txtStreetWidthValue}
                  showClearButton={true}
                  // placeholder="عرض خیابان"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtStreetWidth_onChanege}
                />
                <Label
                  id="errStreetWidth"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">وضعیت جای پارک</Label>
                <SelectBox
                  dataSource={this.state.cmbParkings}
                  value={this.state.cmbParkingValue}
                  displayExpr="subject"
                  placeholder="وضعیت جای پارک"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbParking_onChange}
                />
                <Label
                  id="errParking"
                  className="standardLabelFont errMessage"
                />
              </Col>
            </Row>
            <div className="line"></div>            
            <Row>
              <Col>
                <Label className="standardLabelFont">وضعیت سرمایش</Label>
                <TextBox
                  defaultValue={this.state.txtCoolingStatusValue}
                  showClearButton={true}
                  // placeholder="وضعیت سرمایش"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtCoolingStatus_onChanege}
                />
                <Label
                  id="errCoolingStatus"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">وضعیت گرمایش</Label>
                <TextBox
                  defaultValue={this.state.txtHeatingStatusValue}
                  showClearButton={true}
                  // placeholder="وضعیت گرمایش"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtHeatingStatus_onChanege}
                />
                <Label
                  id="errHeatingStatus"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">تعداد عابر پیاده</Label>
                <TextBox
                  defaultValue={this.state.txtPedestrianNumberValue}
                  showClearButton={true}
                  // placeholder="تعداد عابر پیاده"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtPedestrianNumber_onChanege}
                />
                <Label
                  id="errPedestrianNumber"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">پیش بینی تعداد خانوار ساکن</Label>
                <TextBox
                  defaultValue={this.state.txtForcastOfHouseholdNumberValue}
                  showClearButton={true}
                  // placeholder="پیش بینی تعداد خانوار ساکن"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtForcastOfHouseholdNumber_onChanege}
                />
                <Label
                  id="errForcastOfHouseholdNumber"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">ملک های همجوار</Label>
                <SelectBox
                  dataSource={this.state.cmbNearEstate}
                  value={this.state.cmbNearEstateValue}
                  displayExpr="subject"
                  placeholder="ملک های همجوار"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbNearEstate_onChange}
                />
                <Label
                  id="errParking"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">وضعیت تابلو خور</Label>
                <SelectBox
                  dataSource={this.state.cmbPanelStatus}
                  value={this.state.cmbPanelStatusValue}
                  displayExpr="subject"
                  placeholder="وضعیت تابلو خور "
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbPanelStatus_onChange}
                />
                <Label
                  id="errParking"
                  className="standardLabelFont errMessage"
                />
              </Col>
            </Row>            
            <div className="line"></div>            
            <Row>
              <Col>
                <Label className="standardLabelFont">وضعیت سند</Label>
                <TextBox
                  defaultValue={this.state.txtDocumentStatusValue}
                  showClearButton={true}
                  // placeholder="وضعیت سند"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtDocumentStatus_onChanege}
                />
                <Label
                  id="errDocumentStatus"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">رهن سالیانه</Label>
                <TextBox
                  defaultValue={this.state.txtMortgageOfYearValue}
                  showClearButton={true}
                  // placeholder="رهن سالیانه"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtMortgageOfYear_onChanege}
                />
                <Label
                  id="errMortgageOfYear"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">اجاره ماهیانه</Label>
                <TextBox
                  defaultValue={this.state.txtRentOfMonthValue}
                  showClearButton={true}
                  // placeholder="اجاره ماهیانه"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtRentOfMonth_onChanege}
                />
                <Label
                  id="errRentOfMonth"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">مزایای ملک</Label>
                <TextBox
                  defaultValue={this.state.txtAdvantagesDescValue}
                  showClearButton={true}
                  // placeholder="مزایای ملک"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtAdvantagesDesc_onChanege}
                />
                <Label
                  id="errAdvantagesDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">معایب ملک</Label>
                <TextBox
                  defaultValue={this.state.txtDisadvantagesDescValue}
                  showClearButton={true}
                  // placeholder="معایب ملک"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtDisadvantagesDesc_onChanege}
                />
                <Label
                  id="errDisadvantagesDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">توضیحات تکمیلی</Label>
                <TextBox
                  defaultValue={this.state.txtSupplementaryDescValue}
                  showClearButton={true}
                  // placeholder="توضیحات تکمیلی"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtSupplementaryDesc_onChanege}
                />
                <Label
                  id="errSupplementaryDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
            </Row>
            <div className="line"></div>            
            <Row>
              <Col>
                <CheckBox
                  value={this.state.chkIsBalcony}
                  text="دارای بالکن"
                  rtlEnabled={true}
                  onValueChanged={this.chkIsBalcony_onChange}
                />
                <Label
                  id="errIsBalcony"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <CheckBox
                  value={this.state.chkIsInventory}
                  text="دارای انباری"
                  rtlEnabled={true}
                  onValueChanged={this.chkIsInventory_onChange}
                />
                <Label
                  id="errIsInventory"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <CheckBox
                  value={this.state.chkIsBasement}
                  text="دارای زیرزمین"
                  rtlEnabled={true}
                  onValueChanged={this.chkIsBasement_onChange}
                />
                <Label
                  id="errIsBasement"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <CheckBox
                  value={this.state.chkIsDoorRollup}
                  text="دارای کرکره برقی"
                  rtlEnabled={true}
                  onValueChanged={this.chkIsDoorRollup_onChange}
                />
                <Label
                  id="errIsDoorRollup"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <CheckBox
                  value={this.state.chkWaterStatus}
                  text="وضعیت آب"
                  rtlEnabled={true}
                  onValueChanged={this.chkWaterStatus_onChange}
                />
                <Label
                  id="errWaterDesc"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <CheckBox
                  value={this.state.chkGasStatus}
                  text="وضعیت گاز"
                  rtlEnabled={true}
                  onValueChanged={this.chkGasStatus_onChange}
                />
                <Label
                  id="errGasStatus"
                  className="standardLabelFont errMessage"
                />
              </Col>
            </Row>
          </div>
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
          <div className="standardPadding">
            <Row>
              <DataGrid
                dataSource={this.state.grdTickets}
                // defaultColumns={DataGridTicketcolumns}
                showBorders={true}
                rtlEnabled={true}
                allowColumnResizing={true}
                onRowClick={this.grdTicket_onClick}
                height={DataGridDefaultHeight}
              >
                <Scrolling
                  rowRenderingMode="virtual"
                  showScrollbar="always"
                  columnRenderingMode="virtual"
                />
                <Editing mode="cell" allowUpdating={true} />
                <Paging defaultPageSize={DataGridDefaultPageSize} />
                <Pager
                  visible={true}
                  allowedPageSizes={DataGridPageSizes}
                  showPageSizeSelector={true}
                  showNavigationButtons={true}
                />
                <FilterRow visible={true} />
                <FilterPanel visible={true} />
                <HeaderFilter visible={true} />
              </DataGrid>
            </Row>
          </div>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(RealEstate);
