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
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";

import { itemGroupListCombo } from "../../redux/reducers/itemGroup/itemGroup-actions";
import { itemListComboByItemGroupId } from "../../redux/reducers/item/item-action";
import { supplierListComboByItemId } from "../../redux/reducers/supplier/supplier-action";
import { insertNewDataOrderPointInventory } from "../../redux/reducers/OrderPointInventory/orderPointInventory-actions";
import { locationListOrderInventoryComboNew, locationListOrderInventoryComboNewOutRoute } from "../../redux/reducers/location/location-actions";
import Wait from "../common/Wait";

import { Gfn_BuildValueComboMulti } from "../../utiliy/GlobalMethods";

import SaveIcon from '../../assets/images/icon/save.png'

class OrderInventoryNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cmbLocationGroups: null,
            cmbLocation: null,
            cmbLocationValue: null,
            cmbInventory: null,
            cmbInventoryvalue: null,
            cmbItemGroup: null,
            cmbItemGroupValue: null,
            cmbItems: null,
            cmbItemsOrg: null,
            cmbItemValue: null,
            cmbSuppliers: null,
            cmbSupplierValue: null,
            txtOrderNumberValue: null,
            lblQtyPerPack: null,
            lblQtyPerPack2: null,
            lblRetailStoreMojoodi: null,
            lblSetadMojoodi: null,
            stateWait: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
        }
    }

    OpenCloseWait() {
        this.setState({ stateWait: !this.state.stateWait });
      }

    componentDidMount = async () => {
        this.fn_CheckRequireState();
    }

    fn_CheckRequireState = async () => {
        this.setState({
            cmbInventory: this.props.Inventory.inventoryCombo,
            cmbLocationGroups:
                this.props.isOutRoute ?
                    await locationListOrderInventoryComboNewOutRoute(this.props.Company.currentCompanyId, this.props.User.token)
                    :
                    await locationListOrderInventoryComboNew(this.props.Company.currentCompanyId, this.props.User.token)
        });
    };

    cmbLocationGroup_onChange = async (e) => {
        const TEMP_LocationGroup = this.state.cmbLocationGroups;
        let tempLocation = [];
        for (let j = 0; j < TEMP_LocationGroup.length; j++)
            if (e == TEMP_LocationGroup[j].id)
                tempLocation.push(TEMP_LocationGroup[j]);
        this.setState({
            cmbLocation: tempLocation,
            cmbLocationGroupValue: await Gfn_BuildValueComboMulti(e),
        });
    };

    cmbLocation_onChange = async (e) => {
        this.setState({
            cmbLocationValue: e,
            cmbItemGroupValue: null,
            cmbItemValue: null,
            txtOrderNumberValue: null,
            cmbSupplierValue: null,
            cmbItemGroup: await itemGroupListCombo(this.props.User.token)
        })
    }

    cmbInventory_onChange = async (e) => {
        // alert(e)
        this.setState({ cmbInventoryvalue: e })
    }

    cmbItemGroup_onChange = async (e) => {

        this.OpenCloseWait();
        document.getElementById("errLocationNew").innerHTML = "";

        if (this.state.cmbLocationValue == null || this.state.cmbLocationValue == "")
            document.getElementById("errLocationNew").innerHTML = "فروشگاه را انتخاب نمائید.";

        else {
            const OBJ = {
                ItemGroupId: e,
                LocationId: this.state.cmbLocationValue
            }

            this.setState({
                cmbItemGroupValue: e,
            });

            const ITEMS = await itemListComboByItemGroupId(OBJ, this.props.User.token)
            const LAZY = new DataSource({
                store: ITEMS,
                paginate: true,
                pageSize: 10
            })
            this.setState({
                cmbItems: LAZY,
                cmbItemsOrg: ITEMS
            })
            this.OpenCloseWait();
        }
        
    }

    txtOrderNumber_onChanege = (e) => {
        this.setState({ txtOrderNumberValue: e.value })
    }

    cmbItem_onChange = async (e) => {

        const data = {
            ItemId: e
        }
        const tempItems = this.state.cmbItemsOrg;
        // console.log(JSON.stringify(tempItems))
        for (let i = 0; i < tempItems.length; i++) {

            if (tempItems[i].id == e) {

                this.setState({
                    lblQtyPerPack: tempItems[i].qtyPerPack,
                    lblQtyPerPack2: tempItems[i].qtyPerPack2,
                    lblRetailStoreMojoodi: tempItems[i].mojoodi,
                    lblSetadMojoodi: tempItems[i].mojoodiSetad
                })
            }
        }
        this.setState({
            cmbItemValue: e,
            cmbSupplierValue: null,
            txtOrderNumberValue: null,
            cmbSuppliers: await supplierListComboByItemId(data, this.props.User.token)
        })
    }
    cmbSupplier_onChange = async (e) => {
        this.setState({
            cmbSupplierValue: e
        });
    }

    fn_CheckFinalValidation = () => {
        let flagSend = true;
        document.getElementById("errLocationNew").innerHTML = "";
        document.getElementById("errItemNew").innerHTML = "";
        document.getElementById("errSupplierNew").innerHTML = "";
        document.getElementById("errOrderNumberNew").innerHTML = "";
        document.getElementById("errInventoryNew").innerHTML = "";
        if (this.state.cmbLocationValue === null || this.state.cmbLocationValue == "") {
            const msg = "فروشگاه را انتخاب نمائید.";
            document.getElementById("errLocationNew").innerHTML = msg;
            flagSend = false;
        }
        if (this.state.cmbInventoryvalue === null || this.state.cmbInventoryvalue == "") {
            const msg = " انبار را انتخاب نمائید.";
            document.getElementById("errInventoryNew").innerHTML = msg;
            flagSend = false;
        }
        if (this.state.cmbItemValue == null || this.state.cmbItemValue == "") {
            const msg = "کالا را انتخاب نمائید.";
            document.getElementById("errItemNew").innerHTML = msg;
            flagSend = false;
        }
        if (this.state.cmbSupplierValue == null || this.state.cmbSupplierValue == "") {
            const msg = "تامین کننده را انتخاب نمائید."
            document.getElementById("errSupplierNew").innerHTML = msg;
            flagSend = false;
        }
        if (this.state.txtOrderNumberValue == null || this.state.cmbSupplierValue == "") {
            const msg = "تعداد سفارش را وارد نمائید."
            document.getElementById("errOrderNumberNew").innerHTML = msg;
            flagSend = false;
        }

        let errMSG = '';
        // if (this.state.txtOrderNumberValue > this.state.lblSetadMojoodi) {
        //     errMSG += "تعداد سفارش از موجودی ستاد بیشتر است." + "<br>";
        //     flagSend = false;
        // }
        // if(this.state.txtOrderNumberValue%this.state.lblQtyPerPack!==0 || this.state.txtOrderNumberValue<=0){
        if (this.state.txtOrderNumberValue % (this.state.lblQtyPerPack2 == 0 ? this.state.lblQtyPerPack : this.state.lblQtyPerPack2) !== 0
            || this.state.txtOrderNumberValue <= 0) {
            errMSG += 'تعداد سفارش باید ضریبی از واحد بسته بندی باشد.'
            flagSend = false;
        }
        document.getElementById("InserNewOrderValidation").innerHTML = errMSG;
        return flagSend;
    }

    btnSaveOrder_onClick = async () => {
        const flag_insert = await this.fn_CheckFinalValidation();
        if (flag_insert) {
            let data = {
                locationId: this.state.cmbLocationValue,
                inventoryId: this.state.cmbInventoryvalue,
                supplierId: this.state.cmbSupplierValue,
                productId: this.state.cmbItemValue,
                numberOrder: this.state.txtOrderNumberValue,
                userId: this.props.User.userId
            }
            alert(JSON.stringify(await insertNewDataOrderPointInventory(data, this.props.User.token)))
        }
    }

    render() {
        return (
            <div style={{ direction: "rtl" }}>
                {this.state.stateWait && (
                    <Row className="text-center">
                        <Col style={{ textAlign: "center", marginTop: "10px" }}>
                            <Wait />
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col>
                        <Label className="standardLabelFont">گروه فروشگاه</Label>
                        <SelectBox
                            dataSource={this.state.cmbLocationGroups}
                            displayExpr="label"
                            placeholder="گروه فروشگاه"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}
                            onValueChange={this.cmbLocationGroup_onChange}
                            className="fontStyle"
                        />
                    </Col>
                    <Col>
                        <Label className="standardLabelFont">فروشگاه</Label>
                        <SelectBox
                            dataSource={this.state.cmbLocation}
                            displayExpr="label"
                            placeholder="فروشگاه"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}
                            value={this.state.cmbLocationValue}
                            onValueChange={this.cmbLocation_onChange}
                            className="fontStyle"
                        />
                        <Label id="errLocationNew" className="standardLabelFont errMessage" />
                    </Col>
                    <Col>
                        <Label className="standardLabelFont">انبار</Label>
                        <SelectBox
                            dataSource={this.state.cmbInventory}
                            searchEnabled={true}
                            displayExpr="label"
                            placeholder="انبار"
                            valueExpr="id"
                            rtlEnabled={true}
                            value={this.state.cmbInventoryvalue}
                            onValueChange={this.cmbInventory_onChange}
                            className="fontStyle"
                        />
                        <Label id="errInventoryNew" className="standardLabelFont errMessage" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label className="standardLabelFont">گروه کالا</Label>
                        <SelectBox
                            dataSource={this.state.cmbItemGroup}
                            displayExpr="label"
                            placeholder="گروه کالا"
                            value={this.state.cmbItemGroupValue}
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}
                            onValueChange={this.cmbItemGroup_onChange}
                            className="fontStyle"
                        />
                    </Col>
                    <Col>
                        <Label className="standardLabelFont">کالا</Label>
                        <SelectBox
                            dataSource={this.state.cmbItems}
                            displayExpr="label"
                            placeholder="کالا"
                            valueExpr="id"
                            value={this.state.cmbItemValue}
                            searchEnabled={true}
                            rtlEnabled={true}
                            onValueChange={this.cmbItem_onChange}
                            className="fontStyle"
                        />
                        <Label id="errItemNew" className="standardLabelFont errMessage" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label className="standardLabelFont">تعداد در کارتن: {this.state.lblQtyPerPack}</Label>
                    </Col>
                    {this.state.lblQtyPerPack2 != 0 &&
                        <Col>
                            <Label className="standardLabelFont">تعداد در کارتن 2: {this.state.lblQtyPerPack}</Label>
                        </Col>
                    }
                    <Col>
                        <Label className="standardLabelFont">موجودی فروشگاه: {this.state.lblRetailStoreMojoodi}</Label>
                    </Col>
                    <Col>
                        <Label className="standardLabelFont">موجودی ستاد: {this.state.lblSetadMojoodi}</Label>
                    </Col>
                </Row>
                <Row className="standardSpaceTop">
                    <Col xs="auto">
                        <Label className="standardLabelFont">تامین کننده</Label>
                        <SelectBox
                            dataSource={this.state.cmbSuppliers}
                            displayExpr="label"
                            placeholder="تامین کننده"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}
                            value={this.state.cmbSupplierValue}
                            onValueChange={this.cmbSupplier_onChange}
                            className="fontStyle"
                        />
                        <Label id="errSupplierNew" className="standardLabelFont errMessage" />
                    </Col>
                    <Col xs="auto">
                        <Label className="standardLabelFont">تعداد</Label>
                        <TextBox
                            value={this.state.txtOrderNumberValue}
                            showClearButton={true}
                            placeholder="تعداد سفارش"
                            rtlEnabled={true}
                            valueChangeEvent="keyup"
                            onValueChanged={this.txtOrderNumber_onChanege}
                            className="fontStyle"
                        />
                        <Label id="errOrderNumberNew" className="standardLabelFont errMessage" />
                    </Col>
                </Row>

                <Row className="standardSpaceTop">
                    <Col xs="auto">
                        <Button
                            icon={SaveIcon}
                            text="ثبت"
                            type="success"
                            stylingMode="contained"
                            rtlEnabled={true}
                            onClick={this.btnSaveOrder_onClick}
                            className="fontStyle"
                        />
                    </Col>
                    <Col xs="auto">
                        <Label id="InserNewOrderValidation" className="standardLabelFont errMessage" />
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    User: state.users,
    Location: state.locations,
    Supplier: state.suppliers,
    Item: state.items,
    ItemGroup: state.itemGroups,
    Company: state.companies,
    Inventory: state.inventories,
});

export default connect(mapStateToProps)(OrderInventoryNew);
