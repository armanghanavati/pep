import React from 'react';
import { connect } from "react-redux";
import {
    Row,
    Col,
    Card,
    Label,
    TabContent, TabPane, Nav, NavItem, NavLink,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import classnames from 'classnames';
import TextBox from 'devextreme-react/text-box';
import TextArea from 'devextreme-react/text-area';
import SelectBox from 'devextreme-react/select-box';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import { Toast } from 'devextreme-react/toast';
import { Tooltip } from 'devextreme-react/tooltip';
import DataGrid, {
    Column, Editing, Paging, Lookup, Scrolling,
    FilterRow,
    HeaderFilter,
    FilterPanel,
    Pager,
} from 'devextreme-react/data-grid';
import Wait from "../common/Wait";
import {
    DataGridPageSizes, DataGridDefaultPageSize
    , DataGridDefaultHeight
    , ToastTime
    , ToastWidth
} from '../../config/config';
import { DataGridSnpOrderColumns } from './SnpOrder-config';
import {
    snpOrderAccept,
    snpOrderDeclineReasonList,
    snpOrderDetailList,
    snpOrderList,
    snpOrderReject
} from '../../redux/reducers/snapp/snpOrder-actions';
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import DoneIcon from '../../assets/images/icon/done.png';
import RejectIcon from '../../assets/images/icon/reject.png'
import SendTimerIcon from '../../assets/images/icon/sandtimer.png'
import RegisterCommentIcon from '../../assets/images/icon/register_comment.png'

const notesLabel = { 'aria-label': 'Notes' };

class SnpOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cmbDeclineReasonValue: null,
            cmbDeclineReason: null,
            AllSnpOrders: null,
            grdSnpOrders: null,
            activeTab: null,
            SnpOrderDetail: [],
            stateModalSnpOrderDetail: false,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_show: false,
            SnpOrderId: null,
            TicketData: null,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            stateWait: false,
            SnpOrderData: null,
        }
    }

    async componentDidMount() {
        await this.fn_GetPermissions();
        await this.fn_CheckRequireState();
        const rtnAllSnpOrders = await this.fn_LoadAllSnpOrders();
        this.tabOrders_onChange("1", rtnAllSnpOrders)
    }

    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "snpOrder.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "snpOrder.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "snpOrder.show":
                        this.setState({ stateDisable_show: true });
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

    OpenCloseWait() {
        this.setState({ stateWait: !this.state.stateWait });
    }

    fn_showNotifyMessage = (msg, typeNotify) => {
        notify(
            {
                message: msg,
                width: 230,
                position: {
                    at: "bottom",
                    my: "bottom",
                    of: "#container"
                }
            },
            typeNotify,
            1000
        );
    }

    fn_LoadAllSnpOrders = async () => {
        this.OpenCloseWait();
        const rtn = await snpOrderList(this.props.User.userId, this.props.User.token);
        this.setState({
            AllSnpOrders: rtn
        })
        this.OpenCloseWait();
        return rtn;
    }

    cmbDeclineReason_onChange = (e) => {
        this.setState({ cmbDeclineReasonValue: e })
    }

    grdSnpOrder_onClick = async (e) => {
        const snpOrderDetail = await snpOrderDetailList(e.data.id, this.props.User.token);
        this.setState({
            stateModalSnpOrderDetail: true,
            SnpOrderDetail: snpOrderDetail == null ? [] : snpOrderDetail,
            SnpOrderId: e.data.id,
            SnpOrderData: e.data,
            cmbDeclineReason: await snpOrderDeclineReasonList(e.data.vendorCode, this.props.User.token)
        });
    }

    fn_UpdateGrids = async (AllSnpOrders, tab) => {
        const tempAllSnpOrders = AllSnpOrders;
        let tempSnpOrders = [];
        for (let i = 0; i < tempAllSnpOrders.length; i++)
            if (tab == 1 && (tempAllSnpOrders[i].statusId == "1" || tempAllSnpOrders[i].statusId == "3" || tempAllSnpOrders[i].statusId == "4" || tempAllSnpOrders[i].statusId == "5"))
                tempSnpOrders.push(tempAllSnpOrders[i]);
            else if (tempAllSnpOrders[i].statusId == tab)
                tempSnpOrders.push(tempAllSnpOrders[i]);
        this.setState({ grdSnpOrders: tempSnpOrders })
    }

    tabOrders_onChange = async (tab, AllSnpOrders) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
        if (AllSnpOrders != null && this.state.stateDisable_show)
            await this.fn_UpdateGrids(AllSnpOrders, tab)
    }

    ModalSnpOrderDetail_onClickAway = () => {
        this.setState({ stateModalSnpOrderDetail: false })
    }

    btnAccept_onClick = async () => {
        const obj = {
            orderId: this.state.SnpOrderId,
            orderCode: this.state.SnpOrderData.code,
            vendorCode: this.state.SnpOrderData.vendorCode,
            packingPrice: 0,
            delta: 0,
            deliveryTime: 0,
            riderPickupTime: 0
        }
        var result = await snpOrderAccept(obj, this.props.User.token);
        this.setState({
            ToastProps: {
                isToastVisible: true,
                Message: result > 0 ? "درخواست تایید شد" : "خطا",
                Type: result > 0 ? "info" : "error",
            }
        })

        await this.fn_LoadAllSnpOrders();
        this.setState({
            cmbDeclineReasonValue: null
        })
    }

    btnReject_onClick = async () => {
        document.getElementById("errDeclineReason").innerHTML = "";
        if (this.state.cmbDeclineReasonValue == null) {
            document.getElementById("errDeclineReason").innerHTML =
                "دلیل رد درخواست باید انتخاب شود";
            return;
        }
        var elementTitle;
        this.state.cmbDeclineReason.map((element, index) => {
            if (element.id == this.state.cmbDeclineReasonValue) {
                elementTitle = element.title
            }
        }
        );

        const obj = {
            orderId: this.state.SnpOrderId,
            orderCode: this.state.SnpOrderData.code,
            reasonId: this.state.cmbDeclineReasonValue,
            comment: elementTitle,
            vendorCode: this.state.SnpOrderData.vendorCode
        }
        var result = await snpOrderReject(obj, this.props.User.token);
        this.setState({
            ToastProps: {
                isToastVisible: true,
                Message: result > 0 ? "وضعیت درخواست به رد شده تغییر یافت" : "خطا",
                Type: result > 0 ? "success" : "error",
            }
        })
        const rtnAllSnpOrder = await this.fn_LoadAllSnpOrders();
        this.tabOrders_onChange('6', rtnAllSnpOrder)
    }

    onHidingToast = () => {
        this.setState({ ToastProps: { isToastVisible: false } })
    }

    render() {
        return (
            <div className='standardMargin'>
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
                <Row className="text-center">
                    <Col>
                        <Modal style={{ direction: 'rtl' }}
                            isOpen={this.state.stateModalSnpOrderDetail}
                            toggle={this.ModalSnpOrderDetail_onClickAway}
                            centered={true}
                            size="lg"
                            className="fontStyle"
                        >
                            <ModalHeader>
                                جزییات درخواست
                            </ModalHeader>
                            <ModalBody>
                                {this.state.TicketData != null && (
                                    <>
                                        <Row className="standardPadding">
                                            <Col>شماره تیکت : {this.state.TicketData.id}</Col>
                                            <Col>تاریخ ثبت : {this.state.TicketData.persianDate}</Col>
                                        </Row>
                                        <div className="line"></div>
                                        <Row className="standardPadding">
                                            <Col>نام درخواست دهنده: {this.state.FullName}</Col>
                                            <Col>نام کاربری : {this.state.TicketData.userNameInserted}</Col>
                                            <Col>شماره همراه: {this.state.Mobile}</Col>
                                        </Row>
                                        <div className="line"></div>
                                        <Row className="standardPadding">
                                            <Col>موضوع : {this.state.TicketData.ticketSubjectDesc}</Col>
                                            <Col>وضعیت : {this.state.TicketData.ticketStatusDesc}</Col>
                                            <Col>اولویت : {this.state.TicketData.ticketPriorityDesc}</Col>
                                        </Row>
                                        <Row className="standardPadding">
                                            <Col xs='auto'>عنوان : {this.state.TicketData.title}</Col>
                                        </Row>
                                        <div className="line"></div>
                                        <Row className="standardPadding">
                                            <Col>
                                                توضیحات :<p style={{ textAlign: 'justify' }}>{this.state.TicketData.desc}</p>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                                <Row className="standardPadding" style={{ overflowY: 'scroll', maxHeight: '450px', background: '#ffcdcd' }}>
                                    {this.state.SnpOrderDetail.map((item, key) =>

                                        <Card className="shadow bg-white border pointer">
                                            <Row className="standardPadding">
                                                <Col xs='auto'>کالا: {item.itemName}</Col>
                                            </Row>
                                            <Row className="standardPadding">
                                                <Col xs="auto">تعداد: {item.quantity}</Col>
                                                <Col xs='auto'> تخفیف: {item.discount}</Col>
                                            </Row>
                                            <Row className="standardPadding">
                                                <Col xs="auto">قیمت: {item.price}</Col>
                                                <Col xs='auto'> کد باندل: {item.bundlecode == null && "-"}</Col>
                                            </Row>
                                        </Card>
                                    )}
                                </Row>
                                <Row className="standardPadding">
                                    <Col>
                                        {this.state.activeTab == "1" ? (
                                            <>
                                                <Label className="standardLabelFont">دلیل رد درخواست</Label>
                                                <SelectBox
                                                    dataSource={this.state.cmbDeclineReason}
                                                    displayExpr="title"
                                                    placeholder="دلیل رد درخواست"
                                                    valueExpr="id"
                                                    searchEnabled={true}
                                                    rtlEnabled={true}
                                                    onValueChange={this.cmbDeclineReason_onChange}
                                                    value={this.state.cmbDeclineReasonValue}
                                                    className="fontStyle"
                                                />
                                                <Label id="errDeclineReason" className="standardLabelFont errMessage" />
                                            </>
                                        ) : <><p>{this.state.SnpOrderData != null && this.state.activeTab != "8" && "دلیل رد درخواست: " + this.state.SnpOrderData.declineReason}</p></>}
                                    </Col>
                                </Row>

                                <Row className="standardPadding">
                                    {this.state.activeTab == "1" && this.state.stateDisable_btnUpdate ? (
                                        <>
                                            <Col xs="auto">
                                                <Button
                                                    icon={RegisterCommentIcon}
                                                    text="تایید درخواست"
                                                    type="default"
                                                    stylingMode="contained"
                                                    rtlEnabled={true}
                                                    onClick={this.btnAccept_onClick}
                                                    className="fontStyle"
                                                />
                                            </Col>

                                            <Col xs="auto">
                                                <Button
                                                    icon={RejectIcon}
                                                    text="رد کردن"
                                                    type="danger"
                                                    stylingMode="contained"
                                                    rtlEnabled={true}
                                                    onClick={this.btnReject_onClick}
                                                    className="fontStyle"
                                                />
                                            </Col>
                                        </>
                                    ) : ""}
                                </Row>
                            </ModalBody>
                        </Modal>
                    </Col>
                </Row>
                <Card className="shadow bg-white border pointer">
                    <Row className="standardPadding">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === "1" })}
                                    onClick={() => { this.tabOrders_onChange("1", this.state.AllSnpOrders); }}
                                >
                                    ثبت شده
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === "8" })}
                                    onClick={() => { this.tabOrders_onChange("8", this.state.AllSnpOrders); }}
                                >
                                    تایید شده
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === "6" })}
                                    onClick={() => { this.tabOrders_onChange("6", this.state.AllSnpOrders); }}
                                >
                                    رد شده
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row className="standardPadding">
                                    <DataGrid
                                        dataSource={this.state.grdSnpOrders}
                                        defaultColumns={DataGridSnpOrderColumns}
                                        showBorders={true}
                                        rtlEnabled={true}
                                        allowColumnResizing={true}
                                        onRowClick={this.grdSnpOrder_onClick}
                                        height={DataGridDefaultHeight}
                                        className="fontStyle"
                                    >
                                        <Scrolling rowRenderingMode="virtual"
                                            showScrollbar="always"
                                            columnRenderingMode="virtual"
                                        />
                                        <Editing
                                            mode="cell"
                                            allowUpdating={true}
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
                                        <HeaderFilter visible={true} />
                                    </DataGrid>
                                </Row>
                            </TabPane>
                            <TabPane tabId="8">
                                <Row className="standardPadding">
                                    <DataGrid
                                        dataSource={this.state.grdSnpOrders}
                                        defaultColumns={DataGridSnpOrderColumns}
                                        showBorders={true}
                                        rtlEnabled={true}
                                        allowColumnResizing={true}
                                        onRowClick={this.grdSnpOrder_onClick}
                                        height={DataGridDefaultHeight}
                                        className="fontStyle"
                                    >
                                        <Scrolling rowRenderingMode="virtual"
                                            showScrollbar="always"
                                            columnRenderingMode="virtual"
                                        />
                                        <Editing
                                            mode="cell"
                                            allowUpdating={true}
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
                                        <HeaderFilter visible={true} />
                                    </DataGrid>
                                </Row>
                            </TabPane>
                            <TabPane tabId="6">
                                <Row className="standardPadding">
                                    <DataGrid
                                        dataSource={this.state.grdSnpOrders}
                                        defaultColumns={DataGridSnpOrderColumns}
                                        showBorders={true}
                                        rtlEnabled={true}
                                        allowColumnResizing={true}
                                        onRowClick={this.grdSnpOrder_onClick}
                                        height={DataGridDefaultHeight}
                                        className="fontStyle"
                                    >
                                        <Scrolling rowRenderingMode="virtual"
                                            showScrollbar="always"
                                            columnRenderingMode="virtual"
                                        />
                                        <Editing
                                            mode="cell"
                                            allowUpdating={true}
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
                                        <HeaderFilter visible={true} />
                                    </DataGrid>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </Row>
                </Card>
            </div >
        )
    }
}

const mapStateToProps = (state) => ({
    User: state.users,
    Company: state.companies
});

export default connect(mapStateToProps)(SnpOrder);