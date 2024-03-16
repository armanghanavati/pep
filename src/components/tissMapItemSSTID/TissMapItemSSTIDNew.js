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
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

class TissMapItemSSTIDNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cmbItemGroup: null,
            cmbItemGroupValue: null,
            cmbItems: null,
            cmbItemsOrg: null,
            cmbItemValue: null,
            stateWait: false,
            stateUpdateDelete: true,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_btnDelete: false,
            stateDisable_show: false,
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
        await this.fn_GetPermissions();
    }

    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "tissMapItemSSTID_Form.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "tissMapItemSSTID_Form.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "tissMapItemSSTID_Form.delete":
                        this.setState({ stateDisable_btnDelete: true });
                        break;
                    case "tissMapItemSSTID_Form.show":
                        this.setState({ stateDisable_show: true });
                        break;
                }
            }
    };

    cmbItemGroup_onChange = async (e) => {
        this.OpenCloseWait();
        const OBJ = {
            ItemGroupId: e,
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

    cmbItem_onChange = async (e) => {
        const data = {
            ItemId: e
        }
        const tempItems = this.state.cmbItemsOrg;
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
                <Row className="standardSpaceTop">
                    {this.props.isNew ?
                        <>
                            {this.state.stateDisable_btnAdd && (
                                <Col xs="auto">
                                    <Button
                                        icon={SaveIcon}
                                        text="ثبت"
                                        type="default"
                                        stylingMode="contained"
                                        rtlEnabled={true}
                                        onClick={this.btnAdd_onClick}
                                        className="fontStyle"
                                    />
                                </Col>
                            )}
                        </> :
                        <>
                            {this.state.stateDisable_btnUpdate && (
                                <Col xs="auto">
                                    <Button
                                        icon={UpdateIcon}
                                        text="ذخیره تغییرات"
                                        type="success"
                                        stylingMode="contained"
                                        rtlEnabled={true}
                                        onClick={this.btnUpdate_onClick}
                                        className="fontStyle"
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
                                        className="fontStyle"
                                    />
                                </Col>
                            )}
                        </>
                    }
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    User: state.users,
    Item: state.items,
    ItemGroup: state.itemGroups,
    Company: state.companies,
});

export default connect(mapStateToProps)(TissMapItemSSTIDNew);
