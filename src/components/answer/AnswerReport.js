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
import SelectBox from "devextreme-react/select-box";
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
import { logsOrderPointSupplierActions } from "../../redux/reducers/logsOrderPointSupplier/logsOrderPointSupplier-slice";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { logsOPSByOPSid } from "../../redux/reducers/logsOrderPointSupplier/logsOrderPointSupplier-actions";

import {
  Gfn_ExportToExcel,
  Gfn_DT2StringSql,
  Gfn_ConvertComboForAll,
} from "../../utiliy/GlobalMethods";
import { Template } from "devextreme-react";

import { DataGridAnswerColumns } from "./AnswerReport-config";
import { userLocationList, userLocationListCombo } from "../../redux/reducers/user/user-actions";
import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import { answerDetailReport } from "../../redux/reducers/answerDetail/answerDetail-actions";
import { allQuestionType, questionTypeList } from "../../redux/reducers/question/questionType-actions";

const dateLabel = { 'aria-label': 'Date' };
class AnswerReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateWait: false,
      cmbLocation: null,
      cmbLocationValue: null,
      AnswerGridData: null,
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
      cmbQuestionType:null,
      cmbQuestionTypeValue:null
    };
  }

  async componentDidMount() {
    await this.fn_CheckRequireState();
    await this.fn_locationList();
    await this.fn_questionTypeList();
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
  
  fn_questionTypeList=async()=>{
    this.setState({
      cmbQuestionType: await allQuestionType(this.props.User.token)
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

  cmbQuestionType_onChange=async(e)=>{
    this.setState({
      cmbQuestionTypeValue:e
    })
  }

  btnSearch_onClick = async () => {
    this.OpenCloseWait();
    var object = {
      startDate: this.state.FromDate,
      endDate: this.state.ToDate,
      LocationIds: this.state.cmbLocationValue,
      questionTypeId:this.state.cmbQuestionTypeValue
    }
    this.setState({
      AnswerGridData: await answerDetailReport(
        object,
        this.props.User.token
      ),
    });
    this.OpenCloseWait();
  };

  btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(this.state.AnswerGridData, "answerReport")
  }

  DatePickerFrom_onChange = (params) => {
    this.setState({ FromDate: params, FromDateapi: Gfn_DT2StringSql(params) })
  }

  DatePickerTo_onChange = (params) => {
    this.setState({ ToDate: params, ToDateapi: Gfn_DT2StringSql(params) })
  }


  grdAnswerReport_onCellDblClick = async (e) => {
    // const LogsOfOPS = await logsOPSByOPSid(e.data.id, this.props.User.token);
    // this.props.dispatch(
    //   logsOrderPointSupplierActions.setLogsOrderPointSupplierByOPSid({
    //     LogsOfOPS,
    //   })
    // );
    // this.setState({ stateModal_LogsOfOPS: true })
  };

  ModalOrderSupplierLogs_onClickAway = () => {
    this.setState({ stateModal_LogsOfOPS: false });
  };

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
              <Label>گزارش بازرسی</Label>
            </Row>
            <Row>
              <Col xs={3}>
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
              <Col xs={3}>
                <Label className="standardLabelFont">نوع بازرسی</Label>
                <SelectBox
                  dataSource={this.state.cmbQuestionType}
                  displayExpr="name"
                  placeholder="نوع بازرسی"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbQuestionType_onChange}
                  value={this.state.cmbQuestionTypeValue}
                  className="fontStyle"
                />
                <Row>
                  <Label
                    id="errQuestionType"
                    className="standardLabelFont errMessage"
                  />
                </Row>
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
              <Label className="title">لیست بازرسی</Label>
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
                  id="grdOrderPointInventory"
                  dataSource={this.state.AnswerGridData}
                  defaultColumns={DataGridAnswerColumns}
                  keyExpr="id"
                  columnAutoWidth={true}
                  allowColumnReordering={true}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  columnResizingMode="widget"
                  onCellDblClick={this.grdAnswerReport_onCellDblClick}
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
        {this.state.stateModal_LogsOfOPS && (
          <Row className="text-center">
            <Col>
              <Modal
                style={{ direction: "rtl" }}
                isOpen={this.state.stateModal_LogsOfOPS}
                toggle={this.ModalOrderSupplierLogs_onClickAway}
                centered={true}
                size="lg"
              >
                <ModalHeader toggle={this.ModalOrderSupplierLogs_onClickAway}>
                  لیست تغییرات بازرسی
                </ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      overflowY: "scroll",
                      maxHeight: "450px",
                    }}
                  >
                    {/* <OrderAnswerLogs /> */}
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
  LogsOrderPointInventory: state.logsOrderPointInventories,
});

export default connect(mapStateToProps)(AnswerReport);
