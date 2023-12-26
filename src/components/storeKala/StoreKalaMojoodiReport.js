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

import {
    itemListCombo, itemListComboByItemGroupId,
} from "../../redux/reducers/item/item-action";
import { supplierOrderInventoryComboList } from "../../redux/reducers/supplier/supplier-action";
import { locationListOrderInventoryCombo } from "../../redux/reducers/location/location-actions";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import {
    orderPintInventoryListByLSI,
    orderPointInventoryReport,
} from "../../redux/reducers/OrderPointInventory/orderPointInventory-actions";
import {
    logsOPITodayListByUserId,
    logsOPIByOPIid,
} from "../../redux/reducers/logsOrderPointInventory/logsOrderPointInventory-actions";

import { supplierComboListByCompanyId } from "../../redux/reducers/supplier/supplier-action";

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
import UpdateIcon from "../../assets/images/icon/update.png";
import { userLocationList, userLocationListCombo } from "../../redux/reducers/user/user-actions";
import { storeKalamojoodiList } from "../../redux/reducers/storeKala/storekala-actions";
import { DataGridStoreKalaMojoodiReportColumns } from "./StoreKalaMojoodiReport-config";
import { itemLocationList } from "../../redux/reducers/itemLocation/itemLocation-actions";
import { itemGroupListCombo } from "../../redux/reducers/itemGroup/itemGroup-actions";

const dateLabel = { 'aria-label': 'Date' };

class StoreKalaMojoodiReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateWait: false,
            cmbLocation: null,
            cmbLocationValue: null,
            cmbItemGroup: null,
            cmbItemGroupValue: null,
            cmbItem: null,
            cmbItemValue: null,
            storeKalaMojoodiGridData: null,
            stateEnable_show: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
        };
    }

    async componentDidMount() {
        await this.fn_CheckRequireState();
        this.fn_locationList();
        this.fn_itemGroupList();
        // alert('CompanyId='+this.props.Company.currentCompanyId)
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
            cmbLocation: await userLocationList(this.props.User.userId, this.props.Company.currentCompanyId, this.props.User.token)
        })
    }

    fn_itemGroupList = async () => {
        this.setState({
            cmbItemGroup: await itemGroupListCombo(this.props.User.token),
        });
    };

    cmbLocation_onChange = async (e) => {
        this.setState({
            cmbLocationValue: e,
        })
    };

    cmbItemGroup_onChange = async (e) => {
        var object = {
            ItemGroupId: e,
            LocationId: this.state.cmbLocationValue
        }
        const ITEMS = await itemListComboByItemGroupId(object, this.props.User.token)
        const LAZY = new DataSource({
            store: ITEMS,
            paginate: true,
            pageSize: 10
        })
        this.setState({
            cmbItemGroupValue: e,
            cmbItem: LAZY
        })
    };

    cmbItem_onChange = async (e) => {
        this.setState({
            cmbItemValue: e
        })
    };

    btnSearch_onClick = async () => {
        this.OpenCloseWait();
        this.setState({
            storeKalaMojoodiGridData: await storeKalamojoodiList(
                this.state.cmbLocationValue,
                this.state.cmbItemValue,
                this.props.User.token
            ),
        });

        this.OpenCloseWait();
    };

    btnExportExcel_onClick = () => {
        Gfn_ExportToExcel(this.state.OrderInventoryGridData, "StoreKalaMojoodi")
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
                            <Label>گزارش  موجودی کالا در فروشگاه</Label>
                        </Row>
                        <Row>

                            <Col>
                                <Label className="standardLabelFont">فروشگاه</Label>
                                <SelectBox
                                    dataSource={this.state.cmbLocation}
                                    displayExpr="label"
                                    placeholder="فروشگاه"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbLocation_onChange}
                                    className="fontStyle"
                                />
                            </Col>
                            <Col>
                                <Label className="standardLabelFont">گروه کالا</Label>
                                <SelectBox
                                    dataSource={this.state.cmbItemGroup}
                                    displayExpr="label"
                                    placeholder="گروه کالا"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbItemGroup_onChange}
                                    value={this.state.cmbItemGroupValue}
                                    className="fontStyle"
                                />
                                <Label
                                    id="errItemGroup"
                                    className="standardLabelFont errMessage"
                                />
                            </Col>
                            <Col>
                                <Label className="standardLabelFont">کالا</Label>
                                <SelectBox
                                    dataSource={this.state.cmbItem}
                                    displayExpr="label"
                                    placeholder="کالا"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbItem_onChange}
                                    value={this.state.cmbItemValue}
                                    className="fontStyle"
                                />
                                <Label
                                    id="errItem"
                                    className="standardLabelFont errMessage"
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
                            <Label className="title">لیست موجودی کالا</Label>
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
                                    dataSource={this.state.storeKalaMojoodiGridData}
                                    defaultColumns={DataGridStoreKalaMojoodiReportColumns}
                                    keyExpr="id"
                                    columnAutoWidth={true}
                                    allowColumnReordering={true}
                                    showBorders={true}
                                    rtlEnabled={true}
                                    allowColumnResizing={true}
                                    columnResizingMode="widget"
                                    className="fontStyle"
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
    Company: state.companies
});

export default connect(mapStateToProps)(StoreKalaMojoodiReport);
