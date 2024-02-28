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
import AdapterJalali from '@date-io/date-fns-jalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import DataGrid, {
    Column, Editing, Paging, Lookup, Scrolling,
    FilterRow,
    HeaderFilter,
    FilterPanel,
    Pager,
} from 'devextreme-react/data-grid';
import Wait from "../common/Wait";
import { Gfn_numberWithCommas, Gfn_DT2StringSql } from '../../utiliy/GlobalMethods';
import {
    DataGridPageSizes, DataGridDefaultPageSize
    , DataGridDefaultHeight
    , ToastTime
    , ToastWidth
} from '../../config/config';
import { DataGridSnpOrderColumns, DataGridSnpOrderDetailsColumns } from './SnpOrder-config';
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
import PrintIcon from '../../assets/images/icon/reject.png'
import SearchIcon from "../../assets/images/icon/search.png";
import RegisterCommentIcon from '../../assets/images/icon/register_comment.png'
import snpOrderReport from './SnpOrderReport';
import { itemList, itemListComboByItemGroupId } from '../../redux/reducers/item/item-action';
import { Point } from 'devextreme-react/chart';

const notesLabel = { 'aria-label': 'Notes' };

class SnpOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cmbDeclineReasonValue: null,
            cmbDeclineReason: null,
            cmbItem: null,
            cmbItemValue: null,
            AllSnpOrders: null,
            grdSnpOrders: null,
            activeTab: null,
            SnpOrderDetail: [],
            stateModalSnpOrderDetail: false,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_show: false,
            SnpOrderId: null,
            snpOrderConsumerName: '',
            SnpSumOfOrder: 0,
            FromDate: new Date(),
            ToDate: new Date(),
            FromDateapi: "",
            ToDateapi: "",
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            stateWait: false,
            SnpOrderData: null,
            OrderStaus: [{ id: 1, desc: 'ثبت شده' }, { id: 8, desc: 'تایید شده' }, { id: 7, desc: 'لغو شده' }],
            flagFirstValueTabs: true,
            LocationId: null,
            ItemList: null,
            Item: null,
            txtCommentValue: null,
            stateShowItem: false,
            stateChangeItem: false,
            nonExistentProducts: [],
            stateModalItem: false,
            suggestedProductBarcodes: null,
            suggestedProducts: [],
            nonExistentProductsToSnap:[]
        }
    }


    async componentDidMount() {
        await this.fn_GetPermissions();
        await this.fn_CheckRequireState();
        const rtnAllSnpOrders = await this.btnSearch_onClick();
    }

    async fn_DeleteFirstOrderStatus(firstTab) {
        let tempOrderStatus = this.state.OrderStaus;
        for (let i = 0; i < tempOrderStatus.length; i++) {
            if (tempOrderStatus[i].id == firstTab)
                tempOrderStatus.splice(i, 1)
        }
        this.setState({ OrderStaus: tempOrderStatus });
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
            AllSnpOrders: rtn,
            cmbDeclineReason: await snpOrderDeclineReasonList("3demnx", this.props.User.token)
        })
        this.OpenCloseWait();
        return rtn;
    }

    cmbDeclineReason_onChange = (e) => {
        this.setState({ cmbDeclineReasonValue: e })
    }

    grdSnpOrder_onDbClick = async (e) => {
        const snpOrderDetail = await snpOrderDetailList(e.data.id, this.props.User.token);
        this.setState({
            stateModalSnpOrderDetail: true,
            SnpOrderDetail: snpOrderDetail == null ? [] : snpOrderDetail,
            SnpOrderId: e.data.id,
            SnpSumOfOrder: e.data.price,
            SnpOrderData: e.data,
            snpOrderConsumerName: e.data.fullName,
            LocationId: e.data.locationId,
            // cmbDeclineReason: await snpOrderDeclineReasonList(e.data.vendorCode, this.props.User.token)
            cmbItemValue: null,
        });
    }

    fn_UpdateGrids = async (AllSnpOrders, tab) => {
        const tempAllSnpOrders = AllSnpOrders;
        let tempSnpOrders = [];
        for (let i = 0; i < tempAllSnpOrders.length; i++)
            if (tab == 1 && (tempAllSnpOrders[i].statusId == "1" || tempAllSnpOrders[i].statusId == "3" || tempAllSnpOrders[i].statusId == "4" || tempAllSnpOrders[i].statusId == "5" || tempAllSnpOrders[i].statusId == "6"))
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
                Message: result == null ? "درخواست تایید شد" : "خطا",
                Type: result == null ? "info" : "error",

            }
        })

        await this.btnSearch_onClick();
    }

    btnReject_onClick = async () => {
        document.getElementById("errDeclineReason").innerHTML = "";
        if (this.state.cmbDeclineReasonValue == null) {
            document.getElementById("errDeclineReason").innerHTML =
                "دلیل رد درخواست باید انتخاب شود";
            return;
        }
        this.state.nonExistentProducts.map((item, key)=>{
            this.state.nonExistentProductsToSnap.push({barcode:item.barcode.barCode, suggestedProductBarcodes:item.suggestedProductBarcodes.map((item, key)=>
                item.barCode
            )})
        })
        const obj = {
            orderId: this.state.SnpOrderId,
            orderCode: this.state.SnpOrderData.code,
            reasonId: this.state.cmbDeclineReasonValue,
            comment: this.state.txtCommentValue,
            vendorCode: this.state.SnpOrderData.vendorCode,
            nonExistentProducts: this.state.nonExistentProductsToSnap
        }
        //alert(JSON.stringify(obj))
        var result = await snpOrderReject(obj, this.props.User.token);
        this.setState({
            ToastProps: {
                isToastVisible: true,
                Message: result == null ? "وضعیت درخواست به رد شده تغییر یافت" : "خطا",
                Type: result == null ? "success" : "error",
            }
        })
        const rtnAllSnpOrder = await this.btnSearch_onClick();
        this.tabOrders_onChange('1', rtnAllSnpOrder)
    }

    btnPrint_onClick = () => {
        window.open("https://pepreports.minoomart.ir/snappreport/snapporder?id=" + this.state.SnpOrderId, '_blank');
    }

    DatePickerFrom_onChange = (params) => {
        this.setState({ FromDate: params, FromDateapi: Gfn_DT2StringSql(params) })
    }

    DatePickerTo_onChange = (params) => {
        this.setState({ ToDate: params, ToDateapi: Gfn_DT2StringSql(params) })
    }

    btnSearch_onClick = async () => {
        this.OpenCloseWait();
        const OBJ = {
            fromDate: this.state.FromDate,
            toDate: this.state.ToDate
        };
        const ORDERS = await snpOrderList(OBJ, this.props.User.token);
        this.setState({
            AllSnpOrders: ORDERS,
            cmbDeclineReason: await snpOrderDeclineReasonList("3demnx", this.props.User.token)
        });
        // const rtnAllSnpOrders = await this.fn_LoadAllSnpOrders();
        const FIRST_TAB = 1
        await this.fn_DeleteFirstOrderStatus(FIRST_TAB);
        this.tabOrders_onChange(FIRST_TAB.toString(), ORDERS)

        this.OpenCloseWait();
    };

    onHidingToast = () => {
        this.setState({ ToastProps: { isToastVisible: false } })
    }

    suggestedItem = async (name, itemGroupId, itemBarcode) => {
        const OBJ = {
            ItemGroupId: itemGroupId,
            LocationId: this.state.LocationId,
        };
        this.setState({
            cmbItem: await itemListComboByItemGroupId(OBJ, this.props.User.token),
            Item: { barCode: itemBarcode, name: name },
            stateShowItem: true
        })
        var array = [...this.state.nonExistentProducts];
        //alert(JSON.stringify(array))
        var index = array.findIndex(p => p.barcode.barCode == itemBarcode)
        
        if (index != -1){
            this.setState({ suggestedProducts: array[index].suggestedProductBarcodes });
        }
        else
            this.setState({
                suggestedProducts: []
            })

        this.setState({
            stateModalItem: true
        })
       
    }

    cmbItem_onChange = async (e) => {
        this.state.cmbItem.map((item, key) => {
            if (item.barCode == e)
                this.state.suggestedProducts.push({ name: item.label, barCode: item.barCode });
        });

        this.setState({
            cmbItemValue: e,
        });
    }

    btnAdd_onClick =  () => {
        var array = [...this.state.nonExistentProducts];
        var index = array.findIndex(p => p.barcode.barCode == this.state.Item.barCode)
        if (index != -1){
            array[index].suggestedProductBarcodes = this.state.suggestedProducts;
           // alert(JSON.stringify(array[index].suggestedProductBarcodes))
            this.setState({
                nonExistentProducts:array
            })
        }
        else
            this.state.nonExistentProducts.push({
                barcode: this.state.Item,
                suggestedProductBarcodes: this.state.suggestedProducts
            })
        this.setState({
            stateModalItem: false
        })
        //alert(JSON.stringify(this.state.nonExistentProducts))
    }

    txtComment_onChanege = (e) => {
        this.setState({
            txtCommentValue: e.value
        })
    }

    removeSuggestedProduct = (barcode) => {
        var array = [...this.state.suggestedProducts];
        var index = array.findIndex(p => p.barCode == barcode)
        if (index != -1) {
            array.splice(index, 1);
            this.setState({ suggestedProducts: array });
        }
    }

    btnCancel_onClick = () => {
        this.setState({
            stateModalItem: false,
        });
    }
    render() {
        var t;
        var itemName;
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
                {/* ------------------------------ */}
                <div id="viewer"></div>
                {/* ------------------------------ */}
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
                                جزییات درخواست مشتری: {this.state.snpOrderConsumerName}
                            </ModalHeader>
                            <ModalBody>
                                <Row className="standardPadding" style={{ overflowY: 'scroll', maxHeight: '450px', background: '#ffcdcd' }}>
                                    <Col>
                                        {this.state.SnpOrderDetail.map((item, key) =>
                                            <Card className="shadow bg-white border pointer" onClick={() => this.suggestedItem(item.itemName, item.itemGroupId, item.barCode)}>
                                                <Row className="standardPadding">

                                                    <Col xs='auto'>کالا: {item.itemName}</Col>

                                                    <Col xs='auto' value={item.barCode}>بارکد: {item.barCode}</Col>
                                                </Row>
                                                <Row className="standardPadding">
                                                    <Col xs="auto">تعداد: {Gfn_numberWithCommas(item.quantity)}</Col>
                                                    <Col xs='auto'> جمع تخفیف: {Gfn_numberWithCommas(item.discount)}</Col>
                                                    <Col xs="auto">قیمت: {Gfn_numberWithCommas(item.price)}</Col>
                                                </Row>
                                            </Card>
                                        )}
                                    </Col>
                                </Row>
                                <Row className="standardPadding" style={{ textAlign: 'left', marginTop: '10px' }}>
                                    <p className='fontStyle'>جمع سفارش : {Gfn_numberWithCommas(this.state.SnpSumOfOrder)}</p>
                                </Row>

                                {this.state.activeTab != 7 && (
                                    <>
                                        <Row>
                                            <Col>
                                                {/* <Label className="standardLabelFont">نیاز به تماس درخواست</Label> */}
                                                <SelectBox
                                                    dataSource={this.state.cmbDeclineReason}
                                                    displayExpr="title"
                                                    placeholder="نیاز به تماس درخواست"
                                                    valueExpr="id"
                                                    searchEnabled={true}
                                                    rtlEnabled={true}
                                                    onValueChange={this.cmbDeclineReason_onChange}
                                                    value={this.state.cmbDeclineReasonValue}
                                                    className="fontStyle"
                                                />
                                                <Label id="errDeclineReason" className="standardLabelFont errMessage" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Label className="standardLabelFont">توضیحات</Label>
                                                <TextBox
                                                    defaultValue={this.state.txtCommentValue}
                                                    showClearButton={true}
                                                    placeholder="توضیحات"
                                                    rtlEnabled={true}
                                                    valueChangeEvent="keyup"
                                                    onValueChanged={this.txtComment_onChanege}
                                                    className="fontStyle"
                                                />
                                                <Label id="errTicketTitle" className="standardLabelFont errMessage" />
                                            </Col>
                                        </Row>
                                    </>
                                )}
                                <p style={{ marginTop: '20px' }}> {(this.state.activeTab == 7 && this.state.SnpOrderData != null) && "دلیل نیاز به تماس:  " + this.state.SnpOrderData.declineReason}</p>
                                <Row>
                                    {this.state.stateDisable_btnUpdate ? (
                                        <>
                                            {this.state.activeTab != 7 && (
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
                                                            text="نیاز به تماس درخواست"
                                                            type="danger"
                                                            stylingMode="contained"
                                                            rtlEnabled={true}
                                                            onClick={this.btnReject_onClick}
                                                            className="fontStyle"
                                                        />
                                                    </Col>
                                                </>
                                            )}
                                            {this.state.activeTab != 7 && (

                                                <Col xs="auto">
                                                    <Button
                                                        //icon={PrintIcon}
                                                        text="چاپ فاکتور"
                                                        type="default"
                                                        stylingMode="contained"
                                                        rtlEnabled={true}
                                                        onClick={this.btnPrint_onClick}
                                                        className="fontStyle"
                                                    />
                                                </Col>

                                            )}
                                        </>
                                    ) : ""}
                                </Row>
                            </ModalBody>
                        </Modal>
                    </Col>
                </Row>
                <Row className="text-center">
                    <Col>
                        <Modal style={{ direction: 'rtl' }}
                            isOpen={this.state.stateModalItem}
                            centered={true}
                            size="lg"
                            className="fontStyle"
                        >
                            <ModalHeader>
                                لیست کالا
                            </ModalHeader>
                            <ModalBody>
                                <Row className="standardPadding">
                                    <Col>
                                        <div id="orderDetail" style={{ textAlign: 'right' }}>
                                        </div>
                                    </Col>
                                    <>
                                        <Row>
                                            <Col>
                                                <SelectBox
                                                    dataSource={this.state.cmbItem}
                                                    displayExpr="label"
                                                    placeholder="انتخاب کالا"
                                                    valueExpr="barCode"
                                                    searchEnabled={true}
                                                    rtlEnabled={true}
                                                    onValueChange={this.cmbItem_onChange}
                                                    value={this.state.cmbItemValue}
                                                    className="fontStyle"
                                                />
                                                {/* <Label id="errItem" className="standardLabelFont errMessage" /> */}
                                            </Col>
                                        </Row>
                                        {this.state.suggestedProducts != null && this.state.suggestedProducts.map((item, key) =>
                                            <Row className="standardPadding">
                                                <Col>
                                                    {item.name}
                                                </Col>
                                                <Col>
                                                    <p onClick={() => this.removeSuggestedProduct(item.barCode)} style={{ cursor: 'pointer' }}>-</p>
                                                </Col>
                                            </Row>
                                        )}
                                        <Row className="standardPadding">
                                            <Col>
                                                <Button
                                                    icon={RegisterCommentIcon}
                                                    text="ثبت کالا"
                                                    type="default"
                                                    stylingMode="contained"
                                                    rtlEnabled={true}
                                                    onClick={this.btnAdd_onClick}
                                                    className="fontStyle"
                                                />
                                            </Col>
                                            <Col>
                                                <Button
                                                    // icon={RegisterCommentIcon}
                                                    text="انصراف"
                                                    type="default"
                                                    stylingMode="contained"
                                                    rtlEnabled={true}
                                                    onClick={this.btnCancel_onClick}
                                                    className="fontStyle"
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                </Row>
                            </ModalBody>
                        </Modal>
                    </Col>
                </Row>
                <Card className="shadow bg-white border pointer">
                    <Row className="standardPadding">
                        <Label>جستجوی سفارشات اسنپ</Label>
                    </Row>
                    <Row className="standardPadding">
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
                    </Row>
                    <Row className="standardPadding">
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
                </Card>
                <p></p>
                <Card className="shadow bg-white border pointer">
                    <Row className="standardPadding">
                        <Label>سفارشات اسنپ</Label>
                    </Row>
                    <Row className="standardPadding">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.tabOrders_onChange('1', this.state.AllSnpOrders); }}
                                >
                                    ثبت شده
                                </NavLink>
                            </NavItem>
                            {this.state.OrderStaus.map((item, index) => (
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === item.id })}
                                        onClick={() => { this.tabOrders_onChange(item.id, this.state.AllSnpOrders); }}
                                    >
                                        {item.desc}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId='1'>
                                <Row className="standardPadding">
                                    <DataGrid
                                        dataSource={this.state.grdSnpOrders}
                                        defaultColumns={DataGridSnpOrderColumns}
                                        showBorders={true}
                                        rtlEnabled={true}
                                        allowColumnResizing={true}
                                        onRowDblClick={this.grdSnpOrder_onDbClick}
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
                            {this.state.OrderStaus.map((item, index) => (
                                <TabPane tabId={item.id}>
                                    <Row className="standardPadding">
                                        <DataGrid
                                            dataSource={this.state.grdSnpOrders}
                                            defaultColumns={DataGridSnpOrderColumns}
                                            showBorders={true}
                                            rtlEnabled={true}
                                            allowColumnResizing={true}
                                            onRowDblClick={this.grdSnpOrder_onDbClick}
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

                            ))}
                        </TabContent>
                        {/* <Nav tabs>
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
                        </Nav>  */}
                        {/*<TabContent activeTab={this.state.activeTab}>
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
                        </TabContent> */}
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