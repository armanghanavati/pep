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
    updateTicketSubject,
    addTicketSubject,
    fetchTicketSubjectData,
    deleteTicketSubject,
    ticketSubjectWithGroupList,
    ticketSubjectParentList,
} from "../../redux/reducers/ticketSubject/ticketSubject-actions";
import { DataGridTicketSubjectColumns } from "./TicketSubject-config";
import { Gfn_ExportToExcel } from "../../utiliy/GlobalMethods";

import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";

class TicketSubject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            txtCodeValue: null,
            txtSubjectValue: null,
            cmbTicketSubjectGroupValue: null,
            cmbTicketSubjectGroup: null,
            RowSelected: null,
            TicketSubjectGridData: null,
            stateUpdateDelete: true,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_show: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            stateDisable_txtCode: false,
        };
    }
    async componentDidMount() {
        await this.fn_GetPermissions();
        await this.fn_ticketSubjectList();
        this.fn_updateGrid();
    }

    fn_updateGrid = async () => {
        if (this.state.stateDisable_show)
            this.setState({
                TicketSubjectGridData: await ticketSubjectWithGroupList(this.props.User.token),
            });
    };

    fn_ticketSubjectList = async () => {
        this.setState({
            cmbTicketSubjectGroup: await ticketSubjectParentList(this.props.User.token),
        })
    }
    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "ticketSubject.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "ticketSubject.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "ticketSubject.show":
                        this.setState({ stateDisable_show: true });
                        break;
                }
            }
    };

    grdTicketSubject_onClickRow = (e) => {
        this.setState({
            txtCodeValue: e.data.code,
            txtSubjectValue: e.data.subject,
            cmbTicketSubjectGroupValue: e.data.parentId,
            stateUpdateDelete: true,
            RowSelected: e.data,
            stateDisable_txtCode: true,
        });
    };

    btnNew_onClick = () => {
        this.setState({
            txtCodeValue: null,
            txtSubjectValue: null,
            cmbTicketSubjectGroupValue: null,
            stateUpdateDelete: false,
            stateDisable_txtCode: false,
        });
    };

    fn_CheckValidation = () => {
        let errMsg = "";
        let flag = true;
        document.getElementById("errCode").innerHTML = "";
        if (this.state.txtCodeValue == null) {
            document.getElementById("errCode").innerHTML =
                "کد را وارد نمائید";
            flag = false;
        }
        document.getElementById("errSubject").innerHTML = "";
        if (this.state.txtSubjectValue == null) {
            document.getElementById("errSubject").innerHTML =
                "موضوع را وارد نمائید";
            flag = false;
        }
        return flag;
    };
    btnAdd_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                code: this.state.txtCodeValue,
                subject: this.state.txtSubjectValue,
                parentId: this.state.cmbTicketSubjectGroupValue,
            };
            const RESULT = await addTicketSubject(data, this.props.User.token);
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
    txtCode_onChange = (e) => {
        this.setState({ txtCodeValue: e.value });
    };
    txtSubject_onChange = (e) => {
        this.setState({ txtSubjectValue: e.value });
    };

    cmbTicketSubjectGroup_onChange = async (e) => {
        this.setState({ cmbTicketSubjectGroupValue: e });
    }

    btnUpdate_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                id: this.state.RowSelected.id,
                subject: this.state.txtSubjectValue,
                parentId: this.state.cmbTicketSubjectGroupValue,
            };
            const RESULT = await updateTicketSubject(data, this.props.User.token);
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
        const MSG = await deleteTicketSubject(
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

    btnExportExcel_onClick = () => {
        Gfn_ExportToExcel(this.state.TicketSubjectGridData, "TicketSubject");
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
                            <Label>موضوعات تیکت</Label>
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
                            <Col xs="auto">
                                <Label className="standardLabelFont">کد</Label>
                                <TextBox
                                    value={this.state.txtCodeValue}
                                    showClearButton={true}
                                    placeholder="کد"
                                    rtlEnabled={true}
                                    valueChangeEvent="keyup"
                                    onValueChanged={this.txtCode_onChange}
                                    disabled={this.state.stateDisable_txtCode}
                                />
                                <Row>
                                    <Label
                                        id="errCode"
                                        className="standardLabelFont errMessage"
                                    />
                                </Row>
                            </Col>
                            <Col xs="auto">
                                <Label className="standardLabelFont">موضوع</Label>
                                <TextBox
                                    value={this.state.txtSubjectValue}
                                    showClearButton={true}
                                    placeholder="موضوع"
                                    rtlEnabled={true}
                                    valueChangeEvent="keyup"
                                    onValueChanged={this.txtSubject_onChange}
                                />
                                <Row>
                                    <Label
                                        id="errSubject"
                                        className="standardLabelFont errMessage"
                                    />
                                </Row>
                            </Col>
                            <Col xs="auto">
                                <Label className="standardLabelFont">گروه موضوع</Label>
                                <SelectBox
                                    dataSource={this.state.cmbTicketSubjectGroup}
                                    searchEnabled={true}
                                    displayExpr="subject"
                                    placeholder="گروه موضوع"
                                    valueExpr="id"
                                    rtlEnabled={true}
                                    onValueChange={this.cmbTicketSubjectGroup_onChange}
                                    value={this.state.cmbTicketSubjectGroupValue}
                                />
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
                                        <>
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
                                        </>
                                    )}
                                </Row>
                            </Row>
                        )}
                        <Row>
                            <Col>
                                <p
                                    id="ErrorUpdateSubject"
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
                            <Label className="title">لیست موضوعات تیکت</Label>
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
                        <Row className="standardSpaceTop">
                            <Col xs="auto" className="standardMarginRight">
                                <DataGrid
                                    dataSource={this.state.TicketSubjectGridData}
                                    defaultColumns={DataGridTicketSubjectColumns}
                                    showBorders={true}
                                    rtlEnabled={true}
                                    allowColumnResizing={true}
                                    onRowClick={this.grdTicketSubject_onClickRow}
                                    height={DataGridDefaultHeight}
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
});

export default connect(mapStateToProps)(TicketSubject);
