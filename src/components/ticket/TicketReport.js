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

import { locale } from "devextreme/localization";
import TagBox from "devextreme-react/tag-box";
import { Button } from "devextreme-react/button";

import { Toast } from "devextreme-react/toast";
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
import { companyActions } from "../../redux/reducers/company/company-slice";
import { companyListCombo } from "../../redux/reducers/company/company-actions";

import {
  Gfn_ExportToExcel,
  Gfn_DT2StringSql,
  Gfn_ConvertComboForAll,
} from "../../utiliy/GlobalMethods";
import { Template } from "devextreme-react";

import { DataGridTicketReportColumns } from "./TicketReport-config";
import { userLocationList, userLocationListCombo } from "../../redux/reducers/user/user-actions";
import { ticketDetailReport } from "../../redux/reducers/ticket/ticket-actions";
import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import UpdateIcon from "../../assets/images/icon/update.png";

class TicketReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateWait: false,
      cmbLocation: null,
      cmbLocationValue: null,
      GridData: null,
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
      LocationIds: null,
    };
  }

  async componentDidMount() {
    await this.fn_CheckRequireState();
    await this.fn_locationList();
  }
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
  }

  fn_locationList = async () => {
    this.setState({
      cmbLocation: await userLocationListCombo(
        this.props.User.userId,
        this.props.Company.currentCompanyId,
        this.props.User.token
      )
    })
  }

  cmbLocation_onChange = async (e) => {
    const IDS = e.toString().split(",");
    if (IDS.includes('0')) {
      const TEMP_LOCATION = await userLocationListCombo(
        this.props.User.userId,
        this.props.Company.currentCompanyId,
        this.props.User.token
      );
      let data = await Gfn_ConvertComboForAll(e, TEMP_LOCATION)
      this.setState({ cmbLocationValue: data });
    }
    else {
      this.setState({
        cmbLocationValue: e,
      })
    }
  };

  btnSearch_onClick = async () => {
    this.OpenCloseWait();
    var object = {
      startDate: this.state.FromDate,
      endDate: this.state.ToDate,
      LocationIds: this.state.cmbLocationValue
    }
    this.setState({
      TicketGridData: await ticketDetailReport(
        object,
        this.props.User.token
      ),
    });
    this.OpenCloseWait();
  };

  btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(this.state.TicketGridData, "ticketReport")
  }

  DatePickerFrom_onChange = (params) => {
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
              <Label>گزارش تیکت</Label>
            </Row>
            <Row>
              <Col xs={4}>
                <Label className="standardLabelFont">فروشگاه</Label>
                <TagBox
                  dataSource={this.state.cmbLocation}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbLocation_onChange}
                  className="fontStyle"
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
                    className="fontStyle"
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
                    className="fontStyle"
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
                  className="fontStyle"
                />
              </Col>
            </Row>

          </Row>
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label className="title">لیست تیکت</Label>
            </Row>
            <Row style={{ direction: 'ltr' }}>
              <Col xs="auto">
                <Button
                  icon={ExportExcelIcon}
                  type="default"
                  stylingMode="contained"
                  rtlEnabled={true}
                  onClick={this.btnExportExcel_onClick}
                  className="fontStyle"
                />
              </Col>
            </Row>
            <Row className="standardSpaceTop">
              <Col xs="auto" className="standardMarginRight">
                <DataGrid
                  id="grdTicket"
                  dataSource={this.state.TicketGridData}
                  defaultColumns={DataGridTicketReportColumns}
                  keyExpr="id"
                  columnAutoWidth={true}
                  allowColumnReordering={true}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  columnResizingMode="widget"
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
                    showPageSizeSelector={true}
                    showNavigationButtons={true}
                  />
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
  Company: state.companies,
});

export default connect(mapStateToProps)(TicketReport);
