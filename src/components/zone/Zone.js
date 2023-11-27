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
import classnames from "classnames";
import TextBox from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
import SelectBox from "devextreme-react/select-box";
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
} from "devextreme-react/data-grid";
import {
    DataGridPageSizes,
    DataGridDefaultPageSize,
    DataGridDefaultHeight,
    ToastTime,
    ToastWidth,
} from "../../config/config";
import {
zoneList,
addZone,
updateZone,
deleteZone
} from "../../redux/reducers/zone/zone-actions";
import { DataGridZoneColumns } from "./Zone-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";


class Zone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            txtZoneNameValue: null,
            RowSelected: null,
            ZoneGridData: null,
            stateUpdateDelete: true,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_show: false,
            stateDisable_btnDelete: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            ZoneId: null
        };
    }
    async componentDidMount() {
        await this.fn_GetPermissions();
        await this.fn_CheckRequireState();
        this.fn_updateGrid();
    }

    fn_updateGrid = async () => {
        if (this.state.stateDisable_show)
            this.setState({
                ZoneGridData: await zoneList(this.props.User.token),
            });
    };

    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "zone.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "zone.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "zone.show":
                        this.setState({ stateDisable_show: true });
                        break;
                    case "zone.delete":
                        this.setState({ stateDisable_btnDelete: true });
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

    grdZone_onClickRow = (e) => {
        this.setState({
            txtZoneNameValue: e.data.name,
            ZoneId:e.data.id,
            stateUpdateDelete: true,
            RowSelected: e.data,
        });
    };

    btnNew_onClick = () => {
        this.setState({
            txtZoneNameValue: null,
            stateUpdateDelete: false,
        });
    };

    fn_CheckValidation = () => {
        let errMsg = "";
        let flag = true;
        document.getElementById("errZoneName").innerHTML = "";

        if (this.state.txtZoneNameValue == null) {
            document.getElementById("errZoneName").innerHTML =
                "نام حوزه را وارد نمائید";
            flag = false;
        }

        return flag;
    };
    btnAdd_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                name: this.state.txtZoneNameValue
            };
            const RESULT = await addZone(data, this.props.User.token);
            this.setState({
                ToastProps: {
                    isToastVisible: true,
                    Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت به دلیل تکراری بودن کد",
                    Type: RESULT != null ? "success" : "error",
                },
            });
            this.fn_updateGrid();
        }
    };

    txtZoneName_onChange = (e) => {
        this.setState({ txtZoneNameValue: e.value });
    };

    btnUpdate_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                id: this.state.ZoneId,
                name: this.state.txtZoneNameValue
            };

            const RESULT = await updateZone(data, this.props.User.token);
            this.setState({
                ToastProps: {
                    isToastVisible: true,
                    Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
                    Type: RESULT > 0 ? "success" : "error",
                },
            });
            this.fn_updateGrid();
        }
    };

    onHidingToast = () => {
        this.setState({ ToastProps: { isToastVisible: false } });
    };

    btnDelete_onClick = async () => {
        const MSG = await deleteZone(
            this.state.RowSelected.id,
            this.props.User.token
        );
        this.setState({
            ToastProps: {
                isToastVisible: true,
                Message: MSG,
                Type: "success",
            },
        });
        this.fn_updateGrid();
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
                <Card className="shadow bg-white border pointer">
                    <Row className="standardPadding">
                        <Row>
                            <Label>شرکت</Label>
                        </Row>
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
                                    />
                                </Col>
                            </Row>
                        )}
                        <Row className="standardPadding">
                            <Col>
                                <Label className="standardLabelFont">حوزه</Label>
                                <TextBox
                                    value={this.state.txtZoneNameValue}
                                    showClearButton={true}
                                    placeholder="حوزه"
                                    rtlEnabled={true}
                                    valueChangeEvent="keyup"
                                    onValueChanged={this.txtZoneName_onChange}
                                />
                                <Row>
                                    <Label
                                        id="errZoneName"
                                        className="standardLabelFont errMessage"
                                    />
                                </Row>
                            </Col>
                        </Row>
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
                                        />
                                    </Col>
                                )}
                            </Row>
                        ) : (
                            <Row className="standardSpaceTop">
                                <Row>
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
                                    {this.state.stateDisable_btnDelete && (
                                        <Col xs="auto">
                                            <Button
                                                icon={DeleteIcon}
                                                text="حذف"
                                                type="danger"
                                                stylingMode="contained"
                                                rtlEnabled={true}
                                                onClick={this.btnDelete_onClick}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            </Row>
                        )}
                        <Row>
                            <Col>
                                <p
                                    id="ErrorUpdateZone"
                                    style={{ textAlign: "right", color: "red" }}
                                ></p>
                            </Col>
                        </Row>
                    </Row>
                </Card>
                <p></p>
                <Card className="shadow bg-white border pointer">
                    <Row className="standardPadding">
                        <Row>
                            <Label className="title">لیست حوزه ها</Label>
                        </Row>
                        <Row>
                            <Col xs="auto" className="standardMarginRight">
                                <DataGrid
                                    dataSource={this.state.ZoneGridData}
                                    defaultColumns={DataGridZoneColumns}
                                    showBorders={true}
                                    rtlEnabled={true}
                                    allowColumnResizing={true}
                                    onRowClick={this.grdZone_onClickRow}
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
                                    <FilterRow visible={true} />
                                    <FilterPanel visible={true} />
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

export default connect(mapStateToProps)(Zone);
