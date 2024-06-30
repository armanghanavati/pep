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
} from "reactstrap";
import { Button } from "devextreme-react/button";
// import Slider from '@material-ui/core/Slider';
import { Slider } from "@mui/material";

import { Toast } from "devextreme-react/toast";
import { locale } from "devextreme/localization";

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

import TagBox from "devextreme-react/tag-box";
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

import {
    Gfn_BuildValueComboMulti,
    Gfn_ConvertComboForAll,
    Gfn_BuildValueComboSelectAll,
    Gfn_ExportToExcel,
    Gfn_DT2StringSql,
} from "../../utiliy/GlobalMethods";

import { DataGridItemReportColumns } from "./Item-config";

import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import UpdateIcon from "../../assets/images/icon/update.png";

import RangeSlider from "../common/RangeSlider";
import Wait from "../common/Wait";

class ItemReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateUpdateDelete: true,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_show: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            ConsumerPriceRangeValue: [0, 1000000],
        }
    }

    // ConsumerPriceRangeSliderHandleChange = (e,newValue) => {
    //     this.setState({
    //         ConsumerPriceRangeValue: newValue
    //     })
    // }

    handleChange = (event, newValue) => {
        this.setState({
            ConsumerPriceRangeValue: newValue
        })

    };

    btnSearch_onClick = () => {
        alert(JSON.stringify(this.state.ConsumerPriceRangeValue))
    }

    render() {
        const marks = [
            {
                value: 0,
                label: '0تومان',
            },
            {
                value: 100,
                label: 'تومان',
            },
        ];
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
                            <Col>
                                <Label className="standardLabelFont">گروه فروشگاه</Label>
                                <TagBox
                                    dataSource={this.state.LocationList}
                                    searchEnabled={true}
                                    displayExpr="label"
                                    placeholder="گروه فروشگاه"
                                    valueExpr="id"
                                    rtlEnabled={true}
                                    onValueChange={this.cmbLocationList_onChange}
                                    className="fontStyle"
                                />
                            </Col>
                            <Col>
                                <Label className="standardLabelFont">فروشگاه</Label>
                                <TagBox
                                    dataSource={this.state.Location}
                                    searchEnabled={true}
                                    displayExpr="label"
                                    placeholder="فروشگاه"
                                    valueExpr="id"
                                    rtlEnabled={true}
                                    onValueChange={this.cmbLocation_onChange}
                                    className="fontStyle"
                                />
                            </Col>
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
                                    value={this.state.cmbItemGroupValue}
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
                                    value={this.state.cmbItemValue}
                                    className="fontStyle"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Slider
                                    value={this.state.ConsumerPriceRangeValue}
                                    onChange={this.handleChange}
                                    valueLabelDisplay="auto"                                                                     
                                    // marks={marks} 
                                    max={1000000}                                        
                                />
                            </Col>

                            {/* <Col>
                                <RangeSlider
                                    isCurrency
                                    name="consumerPrice"
                                    label="قیمت مصرف کننده:"
                                    valueLabelDisplay="auto"
                                    onChange={(e) =>
                                        handleChangeInputs("consumerPrice", e.target.value)
                                    }
                                    value={[0, 1000000]}
                                    min={0}
                                    max={1000000}
                                />
                            </Col>
                            <Col>
                                <RangeSlider
                                    label="درصد تخفیف:"
                                    name="discountPercent"
                                    valueLabelDisplay="auto"
                                    getAriaLabel={() => "Temperature range"}
                                    // onChange={(e) =>
                                    //     handleChangeInputs("discountPercent", e.target.value)
                                    // }
                                    // value={inputFields.discountPercent || [0, 100]}
                                    value={[0, 100]}
                                    min={0}
                                    max={100}
                                />
                            </Col> */}
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
                            <Label className="title">لیست کالاها</Label>
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
                                    dataSource={this.state.OrderInventoryGridData}
                                    defaultColumns={DataGridItemReportColumns}
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
    Company: state.companies,
});

export default connect(mapStateToProps)(ItemReport);