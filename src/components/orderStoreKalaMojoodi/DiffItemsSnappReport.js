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
import TagBox from "devextreme-react/tag-box";
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import { Toast } from "devextreme-react/toast";
import { locale } from "devextreme/localization";
import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import UpdateIcon from "../../assets/images/icon/update.png";
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
    Gfn_DT2StringSql,
} from "../../utiliy/GlobalMethods";
import { DataGridDiffItemsSnappReportColumns } from "./orderStoreKalaMojoodi-config";

import Wait from "../common/Wait";
import Table from "../common/Tables/Table";
import { diffStockItemsWithSnapp } from "../../redux/reducers/orderStoreKalaMojoodi/orderStoreKalaMojoodi-actions";
import { locationListForSnapp } from "../../redux/reducers/location/location-actions";

const dateLabel = { 'aria-label': 'Date' };

class DiffItemsSnappReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateWait: false,
            cmbLocations: null,
            cmbLocationValue: null,
            DiffItemsSnappReportGridData: null,
            stateWait: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
        };
    }

    componentDidMount() {
        this.fn_CheckRequireState();
    }

    fn_CheckRequireState = async () => {
        this.setState({
            cmbLocations: await locationListForSnapp(
                this.props.Company.currentCompanyId,
                this.props.User.token
            ),
        });
    };

    cmbLocation_onChange = async (e) => {
        this.setState({ cmbLocationValue: e });
    };

    btnSearch_onClick = async () => {
        this.OpenCloseWait();
        const OBJ = {
            locationId: this.state.cmbLocationValue,
        };
        console.log(JSON.stringify(OBJ))
        this.setState({
            DiffItemsSnappReportGridData: await diffStockItemsWithSnapp(
                OBJ,
                this.props.User.token
            ),
        });
        this.OpenCloseWait();
    };

    OpenCloseWait() {
        this.setState({ stateWait: !this.state.stateWait });
    }
    onHidingToast = () => {
        this.setState({ ToastProps: { isToastVisible: false } });
    };

    btnExportExcel_onClick = () => {
        Gfn_ExportToExcel(this.state.DiffItemsSnappReportGridData, "DifferentStockItemsWithSnapp")
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
                            <Label className="title">فیلترها</Label>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Label className="standardLabelFont">فروشگاه</Label>
                                <SelectBox
                                    dataSource={this.state.cmbLocations}
                                    displayExpr="label"
                                    placeholder="فروشگاه"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    value={this.state.cmbLocationValue}
                                    onValueChange={this.cmbLocation_onChange}
                                    className="fontStyle"
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
                                    className="fontStyle"
                                    onClick={this.btnSearch_onClick}
                                />
                            </Col>
                        </Row>ّ
                    </Row>
                </Card>
                <p></p>
                <Card className="shadow bg-white border pointer">
                    <Row className="standardPadding">
                        <Row>
                            <Label className="title">لیست کالاهای دارای مغایرت با اسنپ</Label>
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
                                <Table
                                    headerFilter
                                    columns={DataGridDiffItemsSnappReportColumns}
                                    allListRF={this.state.DiffItemsSnappReportGridData}
                                />                                
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
    Location: state.locations,
    Company: state.companies,
});

export default connect(mapStateToProps)(DiffItemsSnappReport);