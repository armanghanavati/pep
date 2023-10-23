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
    RowDragging,
} from "devextreme-react/data-grid";
import {
    DataGridPageSizes,
    DataGridDefaultPageSize,
    DataGridDefaultHeight,
    ToastTime,
    ToastWidth,
} from "../../config/config";
import {
    ticketSubjectUserList,
    addTicketSubjectUser,
    updateTicketSubjectUser,
    deleteTicketSubjectUser
} from "../../redux/reducers/ticketSubjectUser/ticketSubjectUser-actions";
import { userList} from "../../redux/reducers/user/user-actions";
import { fetchTicketSubjectData, ticketSubjectWithGroupList} from "../../redux/reducers/ticketSubject/ticketSubject-actions";
import { DataGridTicketSubjectUserColumns } from "./TicketSubjectUser-config";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
class PepObject extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cmbUserNameValue: null,
            cmbTicketSubjectValue: null,
            cmbUser: null,
            cmbTicketSubject: null,
            chkIsSmsReceiver: null,
            RowSelected: null,
            TicketSubjectUserGridData: null,
            stateUpdateDelete: true,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_show: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
        };
    }
    async componentDidMount() {
        await this.fn_GetPermissions();
        this.fn_userList();
        this.fn_ticketSubjectList();
        this.fn_updateGrid();
    }

    fn_updateGrid = async () => {
        this.setState({
            TicketSubjectUserGridData: await ticketSubjectUserList(this.props.User.token),
        });
    };

    fn_userList = async () => {
        this.setState({
            cmbUser: await userList(this.props.User.token)
        })
    }

    fn_ticketSubjectList = async () => {
        this.setState({
            cmbTicketSubject: await ticketSubjectWithGroupList(this.props.User.token)
        })
    }

    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "ticketSubjectUser.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "ticketSubjectUser.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "ticketSubjectUser.show":
                        this.setState({ stateDisable_show: true });
                        break;
                }
            }
    };

    grdTicketSubjectUser_onClickRow = (e) => {
        this.setState({
            cmbUserNameValue: e.data.userId,
            cmbTicketSubjectValue: e.data.ticketSubjectId,
            chkIsSmsReceiver: e.data.isSmsReceiver,
            stateUpdateDelete: true,
            RowSelected: e.data,
        });
    };

    btnNew_onClick = async () => {
        this.setState({
            cmbUserNameValue: null,
            cmbTicketSubjectValue: null,
            chkIsSmsReceiver: null,
            stateUpdateDelete: false,
        });
    };

    fn_CheckValidation = () => {
        let errMsg = "";
        let flag = true;
        document.getElementById("errUserName").innerHTML = "";
        if (this.state.cmbUserNameValue == null) {
            document.getElementById("errUsertName").innerHTML =
                "نام کاربر را وارد نمائید";
            flag = false;
        }
        document.getElementById("errTicketSubject").innerHTML = "";
        if (this.state.cmbTicketSubjectValue == null) {
            document.getElementById("errTicketSubject").innerHTML =
                "موضوع را وارد نمائید";
            flag = false;
        }
        return flag;
    };
    btnAdd_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                userId: this.state.cmbUserNameValue,
                ticketSubjectId: this.state.cmbTicketSubjectValue,
                isSmsReceiver: this.state.chkIsSmsReceiver
            };
            //alert(JSON.stringify(data))
            const RESULT = await addTicketSubjectUser(data, this.props.User.token);
            this.setState({
                ToastProps: {
                    isToastVisible: true,
                    Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت",
                    Type: RESULT != null ? "success" : "error",
                },
            });
            this.fn_updateGrid();
        }
    };

    cmbUser_onChange = (e) => {
        this.setState({ cmbUserNameValue: e });
    };

    cmbTicketSubject_onChange = (e) => {
        this.setState({ cmbTicketSubjectValue: e });
    };

    btnUpdate_onClick = async () => {
        if (this.state.RowSelected == null) {
            this.setState({
                ToastProps: {
                    isToastVisible: true,
                    Message: "خطا ردیف انتخاب گردد",
                    Type: "error",
                },
            });
            return;
        }

        if (this.fn_CheckValidation()) {
            const data = {
                userId: this.state.cmbUserNameValue,
                ticketSubjectId: this.state.cmbTicketSubjectValue,
                oldTicketSubjectId:this.state.RowSelected.ticketSubjectId,
                isSmsReceiver: this.state.chkIsSmsReceiver,
            };
            console.log("ticket subject user for update" + JSON.stringify(data));
            const RESULT = await updateTicketSubjectUser(data, this.props.User.token);
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
        const MSG = await deleteTicketSubjectUser(
            this.state.cmbUserNameValue,
            this.state.cmbTicketSubjectValue,
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

    chkIsSmsReceiver_onChange = (e) => {
        this.setState({
            chkIsSmsReceiver: e.value,
        });
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
                            <Label>تخصیص موضوع به کاربر</Label>
                        </Row>
                        {this.state.stateDisable_btnAdd && (
                            <Row>
                                <Col>
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
                                <Label className="standardLabelFont">نام کاربری</Label>
                                <SelectBox
                                    dataSource={this.state.cmbUser}
                                    displayExpr="userName"
                                    placeholder="انتخاب کاربر"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbUser_onChange}
                                    value={this.state.cmbUserNameValue}
                                />
                                <Row>
                                    <Label
                                        id="errUserName"
                                        className="standardLabelFont errMessage"
                                    />
                                </Row>
                            </Col>
                            <Col xs="auto">
                                <Label className="standardLabelFont">عنوان</Label>
                                <SelectBox
                                    dataSource={this.state.cmbTicketSubject}
                                    displayExpr="subject"
                                    placeholder="انتخاب موضوع"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbTicketSubject_onChange}
                                    value={this.state.cmbTicketSubjectValue}
                                />
                                <Row>
                                    <Label
                                        id="errTicketSubject"
                                        className="standardLabelFont errMessage"
                                    />
                                </Row>
                            </Col>
                            <Row>
                                <Col>
                                    <CheckBox
                                        value={this.state.chkIsSmsReceiver}
                                        text="دریافت اس ام اس"
                                        rtlEnabled={true}
                                        onValueChanged={this.chkIsSmsReceiver_onChange}
                                    />
                                    <Row>
                                        <Label
                                            id="errUserIsSmsReceiver"
                                            className="standardLabelFont errMessage"
                                        />
                                    </Row>
                                </Col>
                            </Row>
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
                                    id="ErrorUpdateTicetkSubjectUser"
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
                            <Label className="title">لیست کاربران </Label>
                        </Row>
                        <Row>
                            <Col xs="auto" className="standardMarginRight">
                                <DataGrid
                                    dataSource={this.state.TicketSubjectUserGridData}
                                    defaultColumns={DataGridTicketSubjectUserColumns}
                                    showBorders={true}
                                    rtlEnabled={true}
                                    allowColumnResizing={true}
                                    onRowClick={this.grdTicketSubjectUser_onClickRow}
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

export default connect(mapStateToProps)(PepObject);
