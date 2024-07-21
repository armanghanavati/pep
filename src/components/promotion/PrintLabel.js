import React, { lazy } from "react";
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

import { locationActions } from "../../redux/reducers/location/location-slice";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { DataGridPromotionColumns } from "./PrintLabel-config";
import {
    itemListCombo, itemListComboByItemGroupId, itemListComboByItemGroupIds, itemListComboByItemGroupWithAll, itemPromotionList, promotionNameList
} from "../../redux/reducers/item/item-action";
import { supplierOrderInventoryComboList } from "../../redux/reducers/supplier/supplier-action";
import { locationListOrderInventoryCombo } from "../../redux/reducers/location/location-actions";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { itemGroupListCombo } from "../../redux/reducers/itemGroup/itemGroup-actions";
import {
    Gfn_BuildValueComboMulti,
    Gfn_ConvertComboForAll,
    Gfn_BuildValueComboSelectAll,
    Gfn_ExportToExcel,
    Gfn_DT2StringSql,
} from "../../utiliy/GlobalMethods";
import { Template } from "devextreme-react";

import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import PrintIcon from "../../assets/images/icon/print.png";
import { printTypeList } from "../../redux/reducers/printType/printType-actions";

const dateLabel = { 'aria-label': 'Date' };

class PrintLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateWait: false,
            cmbItemGroup: null,
            cmbItemGroupValue: null,
            cmbItem: null,
            cmbItemValue: null,
            promotionGridData: null,
            stateEnable_show: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            FromDate: new Date(),
            ToDate: new Date(),
            cmbPromotion: null,
            cmbPromotionValue: null,
            promotionNameList: null,
            cmbPrintType: null,
            cmbPrintTypeValue: null,
            PromotionSelected: [],
        };
    }

    async componentDidMount() {
        await this.fn_CheckRequireState();
        this.fn_itemGroupList();
        this.fn_promotionNameList();
        this.fn_printTypeList();
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

    fn_itemGroupList = async () => {
        this.setState({
            cmbItemGroup: await itemGroupListCombo(this.props.User.token),
        });
    };

    fn_promotionNameList = async () => {
        this.setState({
            cmbPromotion: await promotionNameList(this.props.User.token),
        });
    };

    fn_printTypeList = async () => {
        this.setState({
            cmbPrintType: await printTypeList(this.props.User.token)
        })
    }

    cmbItemGroup_onChange = async (e) => {
        this.setState({
            cmbItemGroupValue: e,
            cmbItem: await itemListComboByItemGroupIds(e, this.props.User.token),
        })
    };

    cmbItem_onChange = async (e) => {
        this.setState({
            cmbItemValue: e
        });
    };
    cmbPromotion_onChange = async (e) => {
        this.setState({
            cmbPromotionValue: e
        });
    }
    cmbPrintType_onChange = async (e) => {
        this.setState({
            cmbPrintTypeValue: e
        })
    }
    btnSearch_onClick = async () => {
        this.OpenCloseWait();
        var data = {
            itemIds: this.state.cmbItemValue,
            itemGroupIds: this.state.cmbItemGroupValue,
            promotionIds: this.state.cmbPromotionValue,
            userId: this.props.User.userId
        }
        this.setState({
            promotionGridData: await itemPromotionList(
                data,
                this.props.User.token
            ),
        });
        this.OpenCloseWait();
    };

    btnExportExcel_onClick = () => {
        Gfn_ExportToExcel(this.state.promotionGridData, "Promotion")
    }

    btnItemPromotionReport_onClick = () => {
        if (this.state.cmbPrintTypeValue == "1")
            window.open("https://pepreports.minoomart.ir/itemPromotionReport/itemPromotion?itemId=" + (this.state.PromotionSelected.length > 0 ?  this.state.PromotionSelected : this.state.cmbItemValue) + "&itemGroupId=" + this.state.cmbItemGroupValue + "&promotionId=" + this.state.cmbPromotionValue + "&userId=" + this.props.User.userId + "&type=null", "_blank");
        else if (this.state.cmbPrintTypeValue == "2")
            window.open("https://pepreports.minoomart.ir/itemPromotionReport/itemPromotion?itemId=" + (this.state.PromotionSelected.length > 0 ?  this.state.PromotionSelected : this.state.cmbItemValue) + "&itemGroupId=" + this.state.cmbItemGroupValue + "&promotionId=" + this.state.cmbPromotionValue + "&userId=" + this.props.User.userId + "&type=A4", "_blank");
        else if (this.state.cmbPrintTypeValue == "3")
            window.open("https://pepreports.minoomart.ir/itemPromotionReport/itemPromotion?itemId=" + (this.state.PromotionSelected.length > 0 ?  this.state.PromotionSelected : this.state.cmbItemValue) + "&itemGroupId=" + this.state.cmbItemGroupValue + "&promotionId=" + this.state.cmbPromotionValue + "&userId=" + this.props.User.userId + "&type=A6", "_blank");
        //window.open("http://localhost:7086/itemPromotionReport/itemPromotion?itemId=" + this.state.cmbItemValue + "&promotionId=" + this.state.cmbPromotionValue + "&userId=" + this.props.User.userId + "&type=A4", "_blank");
        //window.open("https://pepreports.minoomart.ir/itemPromotionReport/itemPromotion?itemId=" + this.state.cmbItemValue + "&promotionId=" + this.state.cmbPromotionValue + "&userId=" + this.props.User.userId + "&type=A4", "_blank");
        this.setState({
            PromotionSelected:[]
        })
    }

    DatePickerFrom_onChange = (params) => {
        // alert(params) 
        this.setState({ FromDate: params, FromDateapi: Gfn_DT2StringSql(params) })
    }

    DatePickerTo_onChange = (params) => {
        this.setState({ ToDate: params, ToDateapi: Gfn_DT2StringSql(params) })
    }

    grdPromotion_onSelectionChanged = ({ selectedRowKeys, selectedRowsData }) => {
        console.log(JSON.stringify(selectedRowsData))
        let temp = []
        for (let i = 0; i < selectedRowsData.length; i++) {
            temp.push(selectedRowsData[i].itemId)
        }
        this.setState({ PromotionSelected: temp })
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
                            <Label>گزارش قیمت</Label>
                        </Row>
                        <Row>
                            <Col>
                                <Label className="standardLabelFont">گروه کالا</Label>
                                <TagBox
                                    dataSource={this.state.cmbItemGroup}
                                    searchEnabled={true}
                                    displayExpr="label"
                                    placeholder="گروه کالا"
                                    valueExpr="id"
                                    rtlEnabled={true}
                                    onValueChange={this.cmbItemGroup_onChange}
                                    className="fontStyle"
                                />
                            </Col>
                            <Col>
                                <Label className="standardLabelFont">کالا</Label>
                                <TagBox
                                    dataSource={this.state.cmbItem}
                                    searchEnabled={true}
                                    displayExpr="label"
                                    placeholder="کالا"
                                    valueExpr="id"
                                    rtlEnabled={true}
                                    onValueChange={this.cmbItem_onChange}
                                    className="fontStyle"
                                />
                            </Col>
                            <Col>
                                <Label className="standardLabelFont">تخفیف</Label>
                                <TagBox
                                    dataSource={this.state.cmbPromotion}
                                    searchEnabled={true}
                                    displayExpr="label"
                                    placeholder="تخفیف"
                                    valueExpr="id"
                                    rtlEnabled={true}
                                    onValueChange={this.cmbPromotion_onChange}
                                    className="fontStyle"
                                />
                            </Col>
                        </Row>

                        {/* <Row className="standardSpaceTop">
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
                        </Row> */}
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
                            <Label className="title">لیست گزارشات قیمت</Label>
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
                                    id="grdPromotion"
                                    dataSource={this.state.promotionGridData}
                                    defaultColumns={DataGridPromotionColumns}
                                    keyExpr="id"
                                    columnAutoWidth={true}
                                    allowColumnReordering={true}
                                    showBorders={true}
                                    rtlEnabled={true}
                                    allowColumnResizing={true}
                                    columnResizingMode="widget"
                                    className="fontStyle"
                                    onSelectionChanged={
                                        this.grdPromotion_onSelectionChanged
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
                    </Row>
                    <Row className="standardPadding">
                        <Col xs="auto">
                            <SelectBox
                                dataSource={this.state.cmbPrintType}
                                displayExpr="name"
                                placeholder="نوع چاپ"
                                valueExpr="id"
                                searchEnabled={true}
                                rtlEnabled={true}
                                onValueChange={this.cmbPrintType_onChange}
                                value={this.state.cmbPrintTypeValue}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button
                                icon={PrintIcon}
                                text="چاپ"
                                type="default"
                                stylingMode="contained"
                                rtlEnabled={true}
                                onClick={this.btnItemPromotionReport_onClick}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    User: state.users,
    Company: state.companies
});

export default connect(mapStateToProps)(PrintLabel);
