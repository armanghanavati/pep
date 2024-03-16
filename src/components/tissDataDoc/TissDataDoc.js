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
import AdapterJalali from "@date-io/date-fns-jalali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
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
    Gfn_ConvertComboForAll,
    Gfn_BuildValueComboMulti,
    Gfn_ExportToExcel,
    Gfn_DT2StringSql,
} from "../../utiliy/GlobalMethods";

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

import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { tissDataDocList } from "../../redux/reducers/tissDataDoc/tissDataDoc-action";
import { companyActions } from "../../redux/reducers/company/company-slice";

import { DataGridTissDataDocColumns } from './TissDataDoc-config';
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import CancelIcon from "../../assets/images/icon/cancel.png";
import MinusImage from "../../assets/images/icon/minus.png";
import SearchIcon from "../../assets/images/icon/search.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";


class TissDataDoc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            FromDate: new Date(),
            ToDate: new Date(),
            TissDataDocGridData: null,
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


    OpenCloseWait() {
        this.setState({ stateWait: !this.state.stateWait });
    }

    componentDidMount = async () => {
        this.fn_CheckRequireState();
        await this.fn_GetPermissions();
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
    };

    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "tissDataDoc_Form.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "tissDataDoc_Form.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "tissDataDoc_Form.show":
                        this.setState({ stateDisable_show: true });
                        break;
                }
            }
    };


    btnSearch_onClick = async () => {
        this.OpenCloseWait();
        const OBJ = {
            fromDate: this.state.FromDate,
            toDate: this.state.ToDate
        }
        alert(JSON.stringify(OBJ))
        this.setState({TissDataDocGridData:await tissDataDocList(OBJ, this.props.User.token)})        
        this.OpenCloseWait();
    }

    TissDataDocDataGrd_onUpdateRow = (params) => {
        // alert(JSON.stringify(params.data))
        let obj = {
            itemId: params.data.id,
            sstid: params.data.sstid,
        };

        this.setState({ ItemUpdated: obj });
    };

    btnUpdate_onClick = async () => {

        // this.setState({
        //     ToastProps: {
        //         isToastVisible: true,
        //         Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
        //         Type: RESULT > 0 ? "success" : "error",
        //     },
        // });
    }

    DatePickerFromDate_onChange = (params) => {
        this.setState({ FromDate: params })
    }

    DatePickerToDate_onChange = (params) => {
        this.setState({ ToDate: params })
    }

    btnExportExcel_onClick = () => {
        Gfn_ExportToExcel(this.state.TissDataDocGridData, "TissDataDoc")
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
                    <Row className="standardPadding">
                        <Row>
                            <Col xs="auto">
                                <LocalizationProvider dateAdapter={AdapterJalali}>
                                    <DatePicker
                                        label="از تاریخ"
                                        value={this.state.FromDate}
                                        onChange={this.DatePickerFromDate_onChange}
                                        renderInput={(params) => <TextField {...params} style={{ color: 'red' }} />}
                                        className='fontStyle'
                                    />
                                </LocalizationProvider>
                            </Col>
                            <Col xs="auto">
                                <LocalizationProvider dateAdapter={AdapterJalali}>
                                    <DatePicker
                                        label="تا تاریخ"
                                        value={this.state.ToDate}
                                        onChange={this.DatePickerToDate_onChange}
                                        renderInput={(params) => <TextField {...params} style={{ color: 'red' }} />}
                                        className='fontStyle'
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

                        <Row className="standardPadding">
                            <Label className="title">سندهای مربوط به تیس</Label>
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
                        <Row className="standardPadding">
                            <Col xs="auto" className="standardPadding">
                                <DataGrid
                                    dataSource={this.state.TissDataDocGridData}
                                    defaultColumns={DataGridTissDataDocColumns}
                                    showBorders={true}
                                    rtlEnabled={true}
                                    allowColumnResizing={true}
                                    height={DataGridDefaultHeight}
                                    onRowUpdated={this.TissDataDocDataGrd_onUpdateRow}                                    
                                    keyExpr="id"
                                    columnAutoWidth={true}
                                    allowColumnReordering={true}                                                                       
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

                        {this.state.stateDisable_btnUpdate && (
                            <Row className="standardPadding">
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
                            </Row>
                        )}
                    </Row>
                </Card>
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    User: state.users,
    Company: state.companies,
});

export default connect(mapStateToProps)(TissDataDoc);
