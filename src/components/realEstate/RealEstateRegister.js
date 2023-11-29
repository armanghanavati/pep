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
  Gfn_NumberDetect,
  Gfn_convertENunicode,
} from "../../utiliy/GlobalMethods";

import { addrsRealEstate } from "../../redux/reducers/rsRealEstate/rsRealEstate-actions";

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
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import CancelIcon from "../../assets/images/icon/cancel.png";
import MinusImage from "../../assets/images/icon/minus.png";
import { masterDataRealEstateList } from "../../redux/reducers/rsMasterDataRealEstate/rsMasterDataRealEstate-action";
import { cityList } from "../../redux/reducers/city/city-actions";
import { stateList } from "../../redux/reducers/state/state-actions";

class RealEstate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MasterDataRealEstate: null,
      cmbCities: null,
      cmbCityValue: null,
      cmbStates: null,
      cmbStateValue: null,
      txtFullAddressValue: null,
      txtLatValue: null,
      txtLongValue: null,
      txtAreaValue: null,
      txtRoofStatusDescValue: null,
      txtFloorStatusDescValue: null,
      txtWallStatusDescValue: null,
      txtLightStatusDescValue: null,
      txtDoorStatusDescValue: null,
      txtElectricityStatusDescValue: null,
      txtWcStatusValue: null,
      txtFrontStatusDescValue: null,
      txtFrontNumberValue: null,
      txtStreetWidthValue: null,
      cmbParkings: null,
      cmbParkingValue: null,
      txtCoolingStatusValue: null,
      txtHeatingStatusValue: null,
      txtPedestrianNumberValue: null,
      txtForcastOfHouseholdNumberValue: null,
      cmbNearEstate: null,
      cmbNearEstateValue: null,
      cmbRivalEstate: null,
      cmbRivalEstateValue: null,
      cmbPanelStatus: null,
      cmbPanelStatusValue: null,
      txtDocumentStatusValue: null,
      txtMortgageOfYearValue: null,
      txtRentOfMonthValue: null,
      txtAdvantagesDescValue: null,
      txtDisadvantagesDescValue: null,
      txtSupplementaryDescValue: null,
      chkIsBalcony: false,
      chkIsInventory: false,
      chkIsBasement: false,
      chkIsDoorRollup: false,
      chkWaterStatus: false,
      chkGasStatus: false,
      txtDistanceValue: null,
      arrRivalEstate: [],
      arrNearEstate: [],
      stateModal_NearEstate: false,
      stateModal_RivalEstate: false,
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      stateDisable_btnDelete: false,
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

  componentDidMount = async () => {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();    
  };

  fn_CheckRequireState = async () => {
    const MASTER_DATA = await masterDataRealEstateList(this.props.User.token);
    // alert(JSON.stringify(MASTER_DATA))
    let tempParking = [];
    let tempPanelStatus = [];
    let tempOtherEstate = [];
    let tempRivalEstate = [];
    MASTER_DATA.forEach((element) => {
      if (element.fieldName == "Parking") {
        const MATER_OBJ = {
          id: element.id,
          fieldName: element.fieldName,
          label: element.data,
        };
        tempParking.push(MATER_OBJ);
      } else if (element.fieldName == "PanelStatus") {
        const MATER_OBJ = {
          id: element.id,
          fieldName: element.fieldName,
          label: element.data,
        };
        tempPanelStatus.push(MATER_OBJ);
      } else if (element.fieldName == "OtherEstate") {
        const MATER_OBJ = {
          id: element.id,
          fieldName: element.fieldName,
          label: element.data,
        };
        tempOtherEstate.push(MATER_OBJ);
      } else if (element.fieldName == "RivalEstate") {
        const MATER_OBJ = {
          id: element.id,
          fieldName: element.fieldName,
          label: element.data,
        };
        tempRivalEstate.push(MATER_OBJ);
      }
    });

    this.setState({
      MasterDataRealEstate: MASTER_DATA,
      cmbStates: await stateList(this.props.User.token),
      cmbParkings: tempParking,
      cmbPanelStatus: tempPanelStatus,
      cmbNearEstates: tempOtherEstate,
      cmbRivalEstate: tempRivalEstate,
    });
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "real_estates.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "real_estates.delete":
            this.setState({ stateDisable_btnDelete: true });
            break;
          case "real_estates.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "real_estates.show":
            this.setState({ stateDisable_show: true });
            break;
        }
      }
  };

  cmbStates_onChange = async (e) => {
    this.setState({
      cmbStateValue: e,
      cmbCities: await cityList(e, this.props.User.token),
    });
  };

  cmbCities_onChange = async (e) => {
    this.setState({ cmbCityValue: e });
  };

  txtFullAddress_onChanege = (e) => {
    this.setState({ txtFullAddressValue: e.value });
  };

  txtLat_onChanege = (e) => {
    this.setState({ txtLatValue: e.value });
  };

  txtLong_onChanege = (e) => {
    this.setState({ txtLongValue: e.value });
  };

  txtArea_onChanege = (e) => {
    this.setState({ txtAreaValue: e.value });
  };

  txtFloorStatusDesc_onChanege = (e) => {
    this.setState({ txtFloorStatusDescValue: e.value });
  };

  txtRoofStatusDesc_onChanege = (e) => {
    this.setState({ txtRoofStatusDescValue: e.value });
  };

  txtWallStatusDesc_onChanege = (e) => {
    this.setState({ txtWallStatusDescValue: e.value });
  };

  txtLightStatusDesc_onChanege = (e) => {
    this.setState({ txtLightStatusDescValue: e.value });
  };

  txtDoorStatusDesc_onChanege = (e) => {
    this.setState({ txtDoorStatusDescValue: e.value });
  };

  txtElectricityStatusDesc_onChanege = (e) => {
    this.setState({ txtElectricityStatusDescValue: e.value });
  };

  txtWcStatus_onChanege = (e) => {
    this.setState({ txtWcStatusValue: e.value });
  };

  txtFrontStatusDesc_onChanege = (e) => {
    this.setState({ txtFrontStatusDescValue: e.value });
  };

  txtFrontNumber_onChanege = async (e) => {  
    let str = e.value;  
    if (await Gfn_NumberDetect(str)) {
      str = Gfn_convertENunicode(str);
      this.setState({ txtFrontNumberValue: str });    
    }    
  };

  txtStreetWidth_onChanege = (e) => {
    this.setState({ txtStreetWidthValue: e.value });    
  };

  txtCoolingStatus_onChanege = (e) => {
    this.setState({ txtCoolingStatusValue: e.value });
  };

  txtHeatingStatus_onChanege = (e) => {
    this.setState({ txtHeatingStatusValue: e.value });
  };

  txtPedestrianNumber_onChanege = async (e) => {
    let str = e.value;
    if (await Gfn_NumberDetect(str)) {
      str = Gfn_convertENunicode(str);
      this.setState({ txtPedestrianNumberValue: str });    
    }    
  };

  txtForcastOfHouseholdNumber_onChanege = async (e) => {    
    let str = e.value;
    if (await Gfn_NumberDetect(str)) {
      str = Gfn_convertENunicode(str);
      this.setState({ txtForcastOfHouseholdNumberValue: str });    
    }    
  };

  txtDocumentStatus_onChanege = (e) => {
    this.setState({ txtDocumentStatusValue: e.value });
  };

  txtMortgageOfYear_onChanege = async (e) => {
    
    let str = e.value;
    if (await Gfn_NumberDetect(str)) {
      str = Gfn_convertENunicode(str);
      this.setState({ txtMortgageOfYearValue: str });
    }    
  };

  txtRentOfMonth_onChanege = async(e) => {
    let str = e.value;
    if (await Gfn_NumberDetect(str)) {
      str = Gfn_convertENunicode(str);
      this.setState({ txtRentOfMonthValue: str });      
    }    
  };

  txtAdvantagesDesc_onChanege = (e) => {
    this.setState({ txtAdvantagesDescValue: e.value });
  };

  txtDisadvantagesDesc_onChanege = (e) => {
    this.setState({ txtDisadvantagesDescValue: e.value });
  };

  txtSupplementaryDesc_onChanege = (e) => {
    this.setState({ txtSupplementaryDescValue: e.value });
  };

  chkIsBalcony_onChange = () => {
    this.setState({ chkIsBalcony: !this.state.chkIsBalcony });
  };
  chkIsInventory_onChange = () => {
    this.setState({ chkIsInventory: !this.state.chkIsInventory });
  };
  chkIsBasement_onChange = () => {
    this.setState({ chkIsBasement: !this.state.chkIsBasement });
  };
  chkIsDoorRollup_onChange = () => {
    this.setState({ chkIsDoorRollup: !this.state.chkIsDoorRollup });
  };
  chkWaterStatus_onChange = () => {
    this.setState({ chkWaterStatus: !this.state.chkWaterStatus });
  };
  chkGasStatus_onChange = () => {
    this.setState({ chkGasStatus: !this.state.chkGasStatus });
  };

  cmbPanelStatus_onChange=(e)=>{
    this.setState({cmbPanelStatusValue:e})
  }

  cmbParkingStaus_onChange=(e)=>{
    this.setState({cmbParkingValue:e})
  }


  btnAdd_onClick=async()=>{
    let objAdd={
      cityId:this.state.cmbCityValue,
      fullAddress:this.state.txtFullAddressValue,
      lat:parseFloat(this.state.txtLatValue),
      long:parseFloat(this.state.txtLongValue),
      area:parseFloat(this.state.txtAreaValue),
      isbalcony:this.state.chkIsBalcony,
      isInventory:this.state.chkIsInventory,
      isBasement:this.state.chkIsBasement,
      frontStatusDesc:this.state.txtFrontStatusDescValue,
      frontNumber:parseInt(this.state.txtFrontNumberValue),
      streetWidth:parseFloat(this.state.txtStreetWidthValue),
      floorStatusDesc:this.state.txtFloorStatusDescValue,
      wallStatusDesc:this.state.txtWallStatusDescValue,
      roofStatusDesc:this.state.txtRoofStatusDescValue,
      lightStatusDesc:this.state.txtLightStatusDescValue,
      doorStatusDesc:this.state.txtDoorStatusDescValue,
      isDoorRollUp:this.state.chkIsDoorRollup,
      electricityStatusDesc:this.state.txtElectricityStatusDescValue,
      waterDesc:this.state.chkWaterStatus,
      gasStatus:this.state.chkGasStatus,
      wcStatus:this.state.txtWcStatusValue,
      coolingStatus:this.state.txtCoolingStatusValue,
      heatingStatus:this.state.txtHeatingStatusValue,
      parkingStatusId:this.state.cmbParkingValue.id,
      pedestrianNumber:parseInt(this.state.txtPedestrianNumberValue),
      forcastOfHouseholdNumber:parseInt(this.state.txtForcastOfHouseholdNumberValue),
      panelStatusId:this.state.cmbPanelStatusValue.id,
      documentStatus:this.state.txtDocumentStatusValue,
      mortgageOfYear:parseInt(this.state.txtMortgageOfYearValue),
      rentOfMonth:parseInt(this.state.txtRentOfMonthValue),
      disadvantagesDesc:this.state.txtDisadvantagesDescValue,
      advantagesDesc:this.state.txtAdvantagesDescValue,
      supplementaryDesc:this.state.txtSupplementaryDescValue,
    }

    console.log(JSON.stringify(objAdd));
    alert(await addrsRealEstate(objAdd,this.props.User.token))
  }

  cmbRivalEstate_onChange = (e) => {
    // alert(JSON.stringify(e))
    this.setState({
      cmbRivalEstateValue: e,
    });
  };

  cmbNearEstate_onChange = (e) => {
    // alert(JSON.stringify(e))
    this.setState({
      cmbNearEstateValue: e,
    });
  };

  txtRivalDistance_onChanege = async (e) => {
    let str = e.value;
    if (await Gfn_NumberDetect(str)) {
      str = Gfn_convertENunicode(str);
      this.setState({ txtRivalEstateDistanceValue: str });
    }
  };

  txtNearEstateDistance_onChanege = async (e) => {
    let str = e.value;
    if (await Gfn_NumberDetect(str)) {
      str = Gfn_convertENunicode(str);
      this.setState({ txtNearEstateDistanceValue: str });
    }
  };

  btnRegisterRivalEstate_onClick = () => {
    let tempRivalEstate = this.state.arrRivalEstate;
    let obj = {
      MasterDataId: this.state.cmbRivalEstateValue.id,
      MasterDataName: this.state.cmbRivalEstateValue.label,
      MasterDataDistance: this.state.txtRivalEstateDistanceValue,
    };
    tempRivalEstate.push(obj);
    this.setState({ arrRivalEstate: tempRivalEstate });
  };
  btnRegisterNearEstate_onClick = () => {
    let tempNearEstate = this.state.arrNearEstate;
    let obj = {
      MasterDataId: this.state.cmbNearEstateValue.id,
      MasterDataName: this.state.cmbNearEstateValue.label,
      MasterDataDistance: this.state.txtNearEstateDistanceValue,
    };
    tempNearEstate.push(obj);
    this.setState({ arrNearEstate: tempNearEstate });
  };

  ModalInputNearEstate_onClickAway = () => {
    this.setState({ stateModal_NearEstate: false });
  };
  ModalInputRivalEstate_onClickAway = () => {
    this.setState({ stateModal_RivalEstate: false });
  };

  btnNearEstate_onClick = () => {
    this.setState({
      stateModal_NearEstate: true,
    });
  };

  btnRivalEstate_onClick = () => {
    this.setState({
      stateModal_RivalEstate: true,
    });
  };

  imgMinusRivalEstate_onClick(params) {
    let tempArrRivalEstate = this.state.arrRivalEstate;
    for (let i = 0; i < tempArrRivalEstate.length; i++)
      if (tempArrRivalEstate[i].MasterDataId == params) {
        tempArrRivalEstate.splice(i, 1);
        break;
      }
    this.setState({ arrRivalEstate: tempArrRivalEstate });
  }

  imgMinusNearEstate_onClick(params) {
    let tempArrNearEstate = this.state.arrNearEstate;
    for (let i = 0; i < tempArrNearEstate.length; i++)
      if (tempArrNearEstate[i].MasterDataId == params) {
        tempArrNearEstate.splice(i, 1);
        break;
      }
    this.setState({ arrNearEstate: tempArrNearEstate });
  }

  btnNew_onClick = () => {
    this.setState({      
      stateUpdateDelete: false,      
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
        {this.state.stateWait && (
          <Row className="text-center">
            <Col style={{ textAlign: "center", marginTop: "10px" }}>
              <Wait />
            </Col>
          </Row>
        )}
        <Card className="shadow bg-white border pointer">
          <div className="standardPadding">
            {this.state.stateDisable_btnAdd && (
              <Row>
                <Col xs="auto">
                  <Button
                    icon={PlusNewIcon}
                    text="جدید"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnNew_onClick}
                    className="fontStyle"
                  />
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Label className="standardLabelFont">استان</Label>
                <SelectBox
                  dataSource={this.state.cmbStates}
                  searchEnabled={true}
                  displayExpr="name"
                  placeholder="استان"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbStates_onChange}
                  className="fontStyle"
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
                  displayExpr="name"
                  placeholder="شهر"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbCities_onChange}
                  className="fontStyle"
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
                  value={this.state.txtFullAddressValue}
                  showClearButton={true}
                  // placeholder="آدرس کامل"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtFullAddress_onChanege}
                  className="fontStyle"
                />
                <Label
                  id="errFullAddress"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">طول جغرافیایی</Label>
                <TextBox
                  value={this.state.txtLongValue}
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
                  value={this.state.txtLatValue}
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
                  value={this.state.txtAreaValue}
                  showClearButton={true}
                  // placeholder="مساحت"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtArea_onChanege}
                />
                <Label id="errArea" className="standardLabelFont errMessage" />
              </Col>
            </Row>
            {/* <div className="line"></div> */}
            <Row>
              <Col>
                <Label className="standardLabelFont">وضعیت سقف</Label>
                <TextBox
                  value={this.state.txtFloorStatusDescValue}
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
                  value={this.state.txtRoofStatusDescValue}
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
                  value={this.state.txtWallStatusDescValue}
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
                  value={this.state.txtLightStatusDescValue}
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
                  value={this.state.txtDoorStatusDescValue}
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
                  value={this.state.txtElectricityStatusDescValue}
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
            {/* <div className="line"></div> */}
            <Row>
              <Col>
                <Label className="standardLabelFont">وضعیت سرویس بهداشتی</Label>
                <TextBox
                  value={this.state.txtWcStatusValue}
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
                  value={this.state.txtFrontStatusDescValue}
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
                  value={this.state.txtFrontNumberValue}
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
                  value={this.state.txtStreetWidthValue}
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
            </Row>
            {/* <div className="line"></div> */}
            <Row>
              <Col>
                <Label className="standardLabelFont">وضعیت سرمایش</Label>
                <TextBox
                  value={this.state.txtCoolingStatusValue}
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
                  value={this.state.txtHeatingStatusValue}
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
                  value={this.state.txtPedestrianNumberValue}
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
                <Label className="standardLabelFont">
                  پیش بینی تعداد خانوار ساکن
                </Label>
                <TextBox
                  value={this.state.txtForcastOfHouseholdNumberValue}
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
            </Row>
            <Row>
              <Col>
                <Label className="standardLabelFont">ملک های همجوار</Label>
                <Col xs="auto">
                  <Button
                    icon={PlusNewIcon}
                    text="ملک های همجوار"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnNearEstate_onClick}
                    className="fontStyle"
                  />
                </Col>
                <Label
                  id="errParking"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">فروشگاه های رقیب</Label>
                {/* <SelectBox
                  items={this.state.cmbRivalEstate}
                  value={this.state.cmbRivalEstateValue}
                  displayExpr="label"
                  placeholder="فروشگاه های رقیب"                  
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbRivalEstate_onChange}
                  className="fontStyle"
                />            */}
                <Col xs="auto">
                  <Button
                    icon={PlusNewIcon}
                    text="فروشگاه های رقیب"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnRivalEstate_onClick}
                    className="fontStyle"
                  />
                </Col>
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
                  displayExpr="label"
                  placeholder="وضعیت تابلو خور "                  
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbPanelStatus_onChange}
                  className="fontStyle"
                />
                <Label
                  id="errParking"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">وضعیت جای پارک</Label>
                <SelectBox
                  dataSource={this.state.cmbParkings}
                  value={this.state.cmbParkingValue}
                  displayExpr="label"
                  placeholder="وضعیت جای پارک"                  
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbParkingStaus_onChange}
                />
                <Label
                  id="errParking"
                  className="standardLabelFont errMessage"
                />
              </Col>
            </Row>
            {/* <div className="line"></div> */}
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
            {/* <div className="line"></div> */}
            <Row>
              <Col>
                <CheckBox
                  value={this.state.chkIsBalcony}
                  text="دارای بالکن"
                  rtlEnabled={true}
                  onValueChanged={this.chkIsBalcony_onChange}
                  className="fontStyle"
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
                  className="fontStyle"
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
                  className="fontStyle"
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
                  className="fontStyle"
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
                  className="fontStyle"
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
                  className="fontStyle"
                />
                <Label
                  id="errGasStatus"
                  className="standardLabelFont errMessage"
                />
              </Col>
            </Row>
            <Row className="standardSpaceTop">
              {!this.state.stateUpdateDelete ? (
                <Row>
                  {this.state.stateDisable_btnAdd && (
                    <Col xs="auto">
                      <Button
                        icon={SaveIcon}
                        text="ثبت"
                        type="success"
                        stylingMode="contained"
                        rtlEnabled={true}
                        onClick={this.btnAdd_onClick}
                        className="fontStyle"
                      />
                    </Col>
                  )}
                </Row>
              ) : (
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
                            className="fontStyle"
                          />
                        </Col>
                        <Col xs="auto">
                          <Button
                            icon={DeleteIcon}
                            text="حذف"
                            type="danger"
                            stylingMode="contained"
                            rtlEnabled={true}
                            onClick={this.btnDelete_onClick}
                            className="fontStyle"
                          />
                        </Col>
                      </>
                    )}
                  </Row>
                </Row>
              )}
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
        {this.state.stateModal_NearEstate && (
          <Row className="text-center">
            <Col>
              <Modal
                style={{ direction: "rtl" }}
                isOpen={this.state.stateModal_NearEstate}
                // toggle={this.ModalInputMasterData_onClickAway}
                centered={true}
                size="lg"
                className="fontStyle"
              >
                <ModalHeader>ملک های همجوار</ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      overflowY: "scroll",
                      maxHeight: "450px",
                    }}
                  >
                    <Row>
                      <Col>
                        <Label className="standardLabelFont">نوع ملک</Label>
                        <SelectBox
                          dataSource={this.state.cmbNearEstates}
                          value={this.state.cmbNearEstateValue}
                          displayExpr="label"
                          placeholder="ملک های همجوار"
                          // valueExpr="id"
                          searchEnabled={true}
                          rtlEnabled={true}
                          onValueChange={this.cmbNearEstate_onChange}
                          className="fontStyle"
                        />
                      </Col>
                      <Col>
                        <Label className="standardLabelFont">
                          فاصله تا ملک مورد نظر
                        </Label>
                        <TextBox
                          // defaultValue={this.state.txtDistanceValue}
                          showClearButton={true}
                          rtlEnabled={true}
                          valueChangeEvent="keyup"
                          onValueChanged={this.txtNearEstateDistance_onChanege}
                          className="fontStyle"
                          value={this.state.txtNearEstateDistanceValue}
                        />
                        <Label
                          id="errFullAddress"
                          className="standardLabelFont errMessage"
                        />
                      </Col>
                    </Row>
                    <Row>
                      {this.state.arrNearEstate.map((item, key) => (
                        <p>
                          <img
                            src={MinusImage}
                            style={{
                              width: "30px",
                              margin: "auto",
                              cursor: "pointer",
                            }}
                            onClick={this.imgMinusNearEstate_onClick.bind(
                              this,
                              item.MasterDataId
                            )}
                          />{" "}
                          {item.MasterDataName} فاصله {item.MasterDataDistance}{" "}
                          متر
                        </p>
                      ))}
                    </Row>
                    <Row>
                      <Col xs="auto">
                        <Button
                          icon={SaveIcon}
                          text="ذخیره"
                          type="default"
                          stylingMode="contained"
                          rtlEnabled={true}
                          onClick={this.btnRegisterNearEstate_onClick}
                          className="fontStyle"
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          icon={CancelIcon}
                          text="بستن"
                          type="danger"
                          stylingMode="contained"
                          rtlEnabled={true}
                          onClick={this.ModalInputNearEstate_onClickAway}
                          className="fontStyle"
                        />
                      </Col>
                    </Row>
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}

        {this.state.stateModal_RivalEstate && (
          <Row className="text-center">
            <Col>
              <Modal
                style={{ direction: "rtl" }}
                isOpen={this.state.stateModal_RivalEstate}
                // toggle={this.ModalInputMasterData_onClickAway}
                centered={true}
                size="lg"
                className="fontStyle"
              >
                <ModalHeader>فروشگاه ها ی رقیب</ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      overflowY: "scroll",
                      maxHeight: "450px",
                    }}
                  >
                    <Row>
                      <Col>
                        <Label className="standardLabelFont">نوع ملک</Label>
                        <SelectBox
                          dataSource={this.state.cmbRivalEstate}
                          value={this.state.cmbRivalEstateValue}
                          displayExpr="label"
                          placeholder="فروشگاه های رقیب"
                          // valueExpr="id"
                          searchEnabled={true}
                          rtlEnabled={true}
                          onValueChange={this.cmbRivalEstate_onChange}
                          className="fontStyle"
                        />
                      </Col>
                      <Col>
                        <Label className="standardLabelFont">
                          فاصله تا ملک مورد نظر
                        </Label>
                        <TextBox
                          // defaultValue={this.state.txtDistanceValue}
                          showClearButton={true}
                          rtlEnabled={true}
                          valueChangeEvent="keyup"
                          onValueChanged={this.txtRivalDistance_onChanege}
                          className="fontStyle"
                          value={this.state.txtRivalEstateDistanceValue}
                        />
                        <Label
                          id="errFullAddress"
                          className="standardLabelFont errMessage"
                        />
                      </Col>
                    </Row>
                    <Row>
                      {this.state.arrRivalEstate.map((item, key) => (
                        <p>
                          <img
                            src={MinusImage}
                            style={{
                              width: "30px",
                              margin: "auto",
                              cursor: "pointer",
                            }}
                            onClick={this.imgMinusRivalEstate_onClick.bind(
                              this,
                              item.MasterDataId
                            )}
                          />{" "}
                          {item.MasterDataName} فاصله {item.MasterDataDistance}{" "}
                          متر
                        </p>
                      ))}
                    </Row>
                    <Row>
                      <Col xs="auto">
                        <Button
                          icon={SaveIcon}
                          text="ذخیره"
                          type="default"
                          stylingMode="contained"
                          rtlEnabled={true}
                          onClick={this.btnRegisterRivalEstate_onClick}
                          className="fontStyle"
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          icon={CancelIcon}
                          text="بستن"
                          type="danger"
                          stylingMode="contained"
                          rtlEnabled={true}
                          onClick={this.ModalInputRivalEstate_onClickAway}
                          className="fontStyle"
                        />
                      </Col>
                    </Row>
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(RealEstate);
