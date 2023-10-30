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
    addUser,
    updateUser,
    deleteUser,
    userList,
    roleAsignToUser,
} from "../../redux/reducers/user/user-actions";
import { pepObjectList } from "../../redux/reducers/pepObject/pepObject-actions";
import { permissionList } from "../../redux/reducers/permission/permission-actions";
import { userActions } from "../../redux/reducers/user/user-slice";
import { DataGridRoleColumns } from "../role/Role-config";
import { DataGridSupplierLocationContactColumns } from "../supplierLocationContact/SupplierLocationContact-config";
import {
    addSupplierLocationContact,
    deleteSupplierLocationContact,
    supplierLocationContactList,
} from "../../redux/reducers/supplierLocationContact/SupplierLocationContact-actions";
import { supplierList } from "../../redux/reducers/supplier/supplier-action";
import { contactList } from "../../redux/reducers/contact/contact-actions";
import { locationList } from "../../redux/reducers/location/location-actions";
import { roleList } from "../../redux/reducers/role/role-actions";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

class SupplierLocationContact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cmbSupplierValue: null,
            cmbSupplier: null,
            cmbContactValue: null,
            cmbContact: null,
            cmbLocationValue: null,
            cmbLocation: null,
            RowSelected: null,
            SupplierLocationContactGridData: null,
            stateUpdateDelete: true,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_btndelete: false,
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
        this.fn_updateGrid();
        this.fn_supplierList();
        this.fn_locationList();
        this.fn_contactList();
    }

    fn_updateGrid = async () => {
        if (this.state.stateDisable_show)
            this.setState({
                SupplierLocationContactGridData: await supplierLocationContactList(
                    this.props.User.token
                ),
            });
    };


    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "supplierLocationContact.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "supplierLocationContact.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "supplierLocationContact.show":
                        this.setState({ stateDisable_show: true });
                        break;
                    case "supplierLocationContact.delete":
                        this.setState({ stateDisable_btndelete: true });
                        break;
                }
            }
    };

    fn_supplierList = async () => {
        this.setState({
            cmbSupplier: await supplierList(this.props.User.token)
        })
    }

    fn_locationList = async () => {
        this.setState({
            cmbLocation: await locationList(this.props.Company.currentCompanyId, this.props.User.token)
        })
    }

    fn_contactList = async () => {
        this.setState({
            cmbContact: await contactList(this.props.User.token)
        })
    }

    grdSupplierLocationContact_onClickRow = async (e) => {
        this.setState({
            cmbSupplierValue: e.data.supplierId,
            cmbLocationValue: e.data.locationId,
            cmbContactValue: e.data.contactId,
            stateUpdateDelete: true,
            RowSelected: e.data,
        });
    };

    btnNew_onClick = async () => {
        this.setState({
            cmbSupplierValue: null,
            cmbLocationValue: null,
            cmbContactValue: null,
            stateUpdateDelete: false,
        });
    };

    fn_CheckValidation = () => {
        let errMsg = "";
        let flag = true;
        document.getElementById("errSupplier").innerHTML = "";
        document.getElementById("errLocation").innerHTML = "";
        document.getElementById("errContact").innerHTML = "";
        if (this.state.cmbSupplierValue == null) {
            document.getElementById("errSupplier").innerHTML = "تامین کننده را انتخاب نمائید";
            flag = false;
        }
        if (this.state.cmbLocationValue == null) {
            document.getElementById("errLocation").innerHTML = "فروشگاه را انتخاب نمائید";
            flag = false;
        }
        if (this.state.cmbContactValue == null) {
            document.getElementById("errContact").innerHTML = "راه های ارتباطی را انتخاب نمائید";
            flag = false;
        }

        return flag;
    };

    btnAdd_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                supplierId: this.state.cmbSupplierValue,
                locationId: this.state.cmbLocationValue,
                contactId: this.state.cmbContactValue,
            };
            const RESULT = await addSupplierLocationContact(
                data,
                this.props.User.token
            );
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

    onHidingToast = () => {
        this.setState({ ToastProps: { isToastVisible: false } });
    };

    btnDelete_onClick = async () => {
        const MSG = await deleteSupplierLocationContact(
            this.state.cmbSupplierValue,
            this.state.cmbLocationValue,
            this.state.cmbContactValue,
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

    cmbSupplier_onChange = (e) => {
        this.setState({
            cmbSupplierValue: e,
        });
    };

    cmbLocation_onChange = (e) => {
        this.setState({
            cmbLocationValue: e,
        });
    };

    cmbContact_onChange = (e) => {
        this.setState({
            cmbContactValue: e,
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
                            <Label>را ه های ارتباطی</Label>
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
                                <Label className="standardLabelFont">تامین کننده</Label>
                                <SelectBox
                                    dataSource={this.state.cmbSupplier}
                                    displayExpr="supplierName"
                                    placeholder="تامین کننده"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbSupplier_onChange}
                                    value={this.state.cmbSupplierValue}
                                />
                                <Row>
                                    <Label
                                        id="errSupplier"
                                        className="standardLabelFont errMessage"
                                    />
                                </Row>
                            </Col>
                            <Col xs="auto">
                                <Label className="standardLabelFont">فروشگاه</Label>
                                <SelectBox
                                    dataSource={this.state.cmbLocation}
                                    displayExpr="locationName"
                                    placeholder="فروشگاه"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbLocation_onChange}
                                    value={this.state.cmbLocationValue}
                                />
                                <Row>
                                    <Label
                                        id="errLocation"
                                        className="standardLabelFont errMessage"
                                    />
                                </Row>
                            </Col>
                            <Col xs="auto">
                                <Label className="standardLabelFont">راه ارتباط</Label>
                                <SelectBox
                                    dataSource={this.state.cmbContact}
                                    displayExpr="value"
                                    placeholder="راه ارتباط"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbContact_onChange}
                                    value={this.state.cmbContactValue}
                                />
                                <Row>
                                    <Label
                                        id="errContact"
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
                                    {this.state.stateDisable_btndelete && (
                                        <>
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
                                    id="ErrorUpdateUser"
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
                            <Label className="title"> لیست تامین کنندگان و راه های ارتباط</Label>
                        </Row>
                        <Row>
                            <Col xs="auto" className="standardMarginRight">
                                <DataGrid
                                    dataSource={this.state.SupplierLocationContactGridData}
                                    defaultColumns={DataGridSupplierLocationContactColumns}
                                    showBorders={true}
                                    rtlEnabled={true}
                                    allowColumnResizing={true}
                                    onRowClick={this.grdSupplierLocationContact_onClickRow}
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

export default connect(mapStateToProps)(SupplierLocationContact);
