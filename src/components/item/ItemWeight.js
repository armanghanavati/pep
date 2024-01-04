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

import { DataGridItemColumns } from "./Item-config";

import { companyActions } from "../../redux/reducers/company/company-slice";
import { companyListCombo } from "../../redux/reducers/company/company-actions";

import { itemSupplierList } from "../../redux/reducers/itemSupplier/itemSupplier-actions";
import { supplierListComboByCompanyId } from "../../redux/reducers/supplier/supplier-action";
import { itemGroupListCombo } from "../../redux/reducers/itemGroup/itemGroup-actions";

import { updateItemWeightPack } from "../../redux/reducers/item/item-action";

import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import UpdateIcon from "../../assets/images/icon/update.png";

const dateLabel = { "aria-label": "Date" };

class ItemWeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ItemsGridData: null,
      cmbSupplirs: [],
      cmbSupplierValue: null,
      cmbItemGroups: [],
      cmbItemGroupValue: null,
      ItemListUpdated: [],
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: true,
      stateDisable_show: false,
      stateWait: false,
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
    this.fn_supplierList();
    this.fn_itemGroupList();
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

  fn_supplierList = async () => {
    this.setState({
      cmbSupplirs: await supplierListComboByCompanyId(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };
  fn_itemGroupList = async () => {
    this.setState({
      cmbItemGroups: await itemGroupListCombo(this.props.User.token),
    });
  };

  cmbSupplier_onChange = (e) => {
    this.setState({
      cmbSupplierValue: e,
    });
  };

  cmbItemGroup_onChange = (e) => {
    this.setState({
      cmbItemGroupValue: e,
    });
  };

  btnSearch_onClick = async () => {
    this.OpenCloseWait();
    this.setState({
      ItemsGridData: await itemSupplierList(
        this.state.cmbItemGroupValue,
        this.state.cmbSupplierValue,
        this.props.User.token
      ),
    });
    this.OpenCloseWait();
  };

  ItemsDataGrd_onUpdateRow = (params) => {
    let tempItems = this.state.ItemListUpdated;
    let flagPush = true;
    // console.log(JSON.stringify(params.data));
    for (let i = 0; i < tempItems.length; i++)
      if (tempItems[i].Id === params.data.id) {
        tempItems[i].WeightOfCartonPack = params.data.weightOfCartonPack;
        tempItems[i].WeightOfSelefonPack = params.data.weightOfSelefonPack;
        flagPush = false;
        break;
      }
    if (flagPush) {
      let obj = {
        Id: params.data.id,
        WeightOfCartonPack: params.data.weightOfCartonPack,
        WeightOfSelefonPack: params.data.weightOfSelefonPack,
      };
      tempItems.push(obj);
    }
    // console.log(JSON.stringify(tempItems));
    this.setState({ ItemListUpdated: tempItems, flagSelectAll: false });
  };

  
  btnUpdate_onClick = async () => {
    
    if (this.state.ItemListUpdated.length > 0) {
        this.OpenCloseWait();
      const data = this.state.ItemListUpdated;
      const RESULT = await updateItemWeightPack(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
          Type: RESULT > 0 ? "success" : "error",
        },
      });
    //   this.btnSearch_onClick();
      this.OpenCloseWait();
    } else alert("کالا(ها) را انتخاب نمائید.");
  };

  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }
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
              <Label>وزن بسته بندی کالاها</Label>
            </Row>
            <Row>
              <Col xs={3}>
                <Label className="standardLabelFont">تامین کننده</Label>
                <SelectBox
                  dataSource={this.state.cmbSupplirs}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="تامین کننده"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbSupplier_onChange}
                  value={this.state.cmbSupplierValue}
                />
                <Label
                  id="errSupplier"
                  className="standardLabelFont errMessage"
                />
              </Col>
              <Col xs={3}>
                <Label className="standardLabelFont">گروه کالا</Label>
                <SelectBox
                  dataSource={this.state.cmbItemGroups}
                  displayExpr="label"
                  placeholder="گروه کالا"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbItemGroup_onChange}
                  value={this.state.cmbItemGroupValue}
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
              <Label className="title">لیست کالاها</Label>
            </Row>            

            <Row>
              <Col xs="auto" className="standardPadding">
                <DataGrid
                  dataSource={this.state.ItemsGridData}
                  defaultColumns={DataGridItemColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowUpdated={this.ItemsDataGrd_onUpdateRow}
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
  
  export default connect(mapStateToProps)(ItemWeight);
