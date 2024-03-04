import React, { Suspense } from "react";
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
import classnames from "classnames";
import TextBox from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
import SelectBox from "devextreme-react/select-box";
import TagBox from "devextreme-react/tag-box";
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
    Export,
} from "devextreme-react/data-grid";
import Wait from "../common/Wait";

import {
    Gfn_NumberDetect,
    Gfn_convertENunicode,
} from "../../utiliy/GlobalMethods";

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

import { itemListComboByItemGroup } from "../../redux/reducers/item/item-action";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { itemGroupListCombo } from "../../redux/reducers/itemGroup/itemGroup-actions";
import { itemListById } from "../../redux/reducers/item/item-action";
import { updateItemSSTID } from "../../redux/reducers/item/item-action";

import TissMapItemSSTIDNew from "./TissMapItemSSTIDNew";
import { DataGridTissMapItemSSTIDcolumns } from "./TissMapItemSSTID-Config";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import CancelIcon from "../../assets/images/icon/cancel.png";
import MinusImage from "../../assets/images/icon/minus.png";
import SearchIcon from "../../assets/images/icon/search.png";


class TissMapItemSSTID extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ItemGridData: null,
            cmbItemGroup: null,
            cmbItemGroupValue: null,
            cmbItems: null,
            cmbItemsOrg: null,
            cmbItemValue: null,
            ItemUpdated: null,
            stateModal_TissMapItemSSTIDNew: false,
            isNew: false,
            stateUpdateDelete: true,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_show: false,
            stateDisable_btnDelete: false,
            stateWait: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
        };
    }

    onHidingToast = () => {
        this.setState({ ToastProps: { isToastVisible: false } });
    };


    OpenCloseWait() {
        this.setState({ stateWait: !this.state.stateWait });
    }

    componentDidMount = async () => {
        this.fn_CheckRequireState();
        await this.fn_GetPermissions();
    }

    fn_CheckRequireState = async () => {
        this.OpenCloseWait();
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
        this.setState({ cmbItemGroup: await itemGroupListCombo(this.props.User.token) })
        this.OpenCloseWait();
    };

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
                    case "tissMapItemSSTID_Form.show":
                        this.setState({ stateDisable_show: true });
                        break;
                }
            }
    };

    cmbItemGroup_onChange = async (e) => {
        const OBJ = {
            ItemGroupId: e,
        }

        this.setState({
            cmbItemGroupValue: e,
        });

        const ITEMS = await itemListComboByItemGroup(OBJ, this.props.User.token)
        const LAZY = new DataSource({
            store: ITEMS,
            paginate: true,
            pageSize: 10
        })
        this.setState({
            cmbItems: LAZY,
            cmbItemsOrg: ITEMS
        })
    }

    cmbItem_onChange = async (e) => {
        this.setState({
            cmbItemValue: e,
        })
    }

    btnSearch_onClick = async () => {
        const OBJ = {
            ItemId: this.state.cmbItemValue,
        }
        this.setState({
            ItemGridData: await itemListById(OBJ, this.props.User.token)
        })
    }

    btnNew_onClick = () => {
        this.setState({
            isNew: true,
            stateModal_TissMapItemSSTIDNew: true,
        });
    }

    ModalTissMapItemSSTIDNew_onClickAway = () => {
        this.setState({ stateModal_TissMapItemSSTIDNew: false });
    };

    TissMapItemSSTIDDataGrd_onUpdateRow = (params) => {
        // alert(JSON.stringify(params.data))
        let obj = {
            itemId: params.data.id,
            sstid: params.data.sstid,
        };

        this.setState({ ItemUpdated: obj});
    };

    btnUpdate_onClick=async()=>{        
        const RESULT=await updateItemSSTID(this.state.ItemUpdated,this.props.User.token);        
        this.setState({
            ToastProps: {
              isToastVisible: true,
              Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
              Type: RESULT > 0 ? "success" : "error",
            },
          });
    }

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
                            <Col xs="2">
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
                            <Col xs="5">
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
                    {/* {this.state.stateDisable_btnAdd && (
                        <Row className="standardPadding">
                            <Col xs="auto">
                                <Button
                                    icon={PlusNewIcon}
                                    text="جدید"
                                    type="default"
                                    stylingMode="contained"
                                    rtlEnabled={true}
                                    onClick={this.btnNew_onClick}
                                    className="fontStyle"
                                />
                            </Col>
                        </Row>
                    )} */}
                    <Row className="standardPadding">
                        <Label className="title">شناسه کالا دارایی</Label>
                    </Row>
                    <Row className="standardPadding">
                        <Col xs="auto" className="standardPadding">
                            <DataGrid
                                dataSource={this.state.ItemGridData}
                                defaultColumns={DataGridTissMapItemSSTIDcolumns}
                                showBorders={true}
                                rtlEnabled={true}
                                allowColumnResizing={true}
                                onRowUpdated={this.TissMapItemSSTIDDataGrd_onUpdateRow}
                                className="fontStyle"

                            >
                                <Scrolling
                                    rowRenderingMode="virtual"
                                    showScrollbar="always"
                                    columnRenderingMode="virtual"
                                />
                                <Editing mode="cell" allowUpdating={true} />
                            </DataGrid>
                        </Col>
                    </Row>

                    {this.state.stateDisable_btnUpdate && (
                        <Row className="standardPadding">
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
                        </Row>
                    )}
                </Card>
                {/* {this.state.stateModal_TissMapItemSSTIDNew && (
                    <Row className="text-center">
                        <Col>
                            <Modal
                                style={{ direction: "rtl" }}
                                isOpen={this.state.stateModal_TissMapItemSSTIDNew}
                                toggle={this.ModalTissMapItemSSTIDNew_onClickAway}
                                centered={true}
                                size="lg"
                                className="fontStyle"
                            >
                                <ModalHeader>
                                    ثبت سفارش
                                </ModalHeader>
                                <ModalBody>
                                    <Row
                                        className="standardPadding"
                                        style={{
                                            // overflowY: "scroll",
                                            maxHeight: "450px",
                                        }}
                                    >
                                        <TissMapItemSSTIDNew isNew={this.state.isNew}/>
                                    </Row>
                                </ModalBody>
                            </Modal>
                        </Col>
                    </Row>
                )} */}

            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    User: state.users,
    Company: state.companies,
});

export default connect(mapStateToProps)(TissMapItemSSTID);
