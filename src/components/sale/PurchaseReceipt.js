import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Scanner } from '@yudiel/react-qr-scanner';
import { connect } from "react-redux";
import { Button } from "devextreme-react";
import Modal from '../common/Modals/Modal';
import TableMultiSelect from "../common/Tables/TableMultiSelect";
import OnOffIcon from '../../assets/images/icon/onOff.png';
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
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
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
} from "devextreme-react/data-grid";
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
import { purchaseItemsColumns } from './Sale-config'
import TextBox from "devextreme-react/text-box";
import { checkItemsAndSendSmsToPerson, itemList, itemListOfPromotionsNotFactor } from "../../redux/reducers/item/item-action";
import { finalConfirmPurchaseReceipt } from "../../redux/reducers/slaSale/slaSale-actions";



const PurchaseReceipt = () => {
    const { users, main, companies } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [ShowItems, setShowItems] = useState(false);
    const [ItemsList, setItemList] = useState([]);
    const [ScanValue, setScanValue] = useState(null);
    const [ShowCamera, setShowCamera] = useState(false);
    const [SelectedItems, setSelectedItems] = useState(null);
    const [ShowInputCode, setShowInputCode] = useState(false);
    const [TxtConfirmCode, setTxtConfirmCode] = useState(null);

    // useEffect(() => {
    //     handleAcceptGroup();
    // }, [ItemsList]);

    const Barcode_onScan = async (data) => {
        setScanValue(data[0].rawValue)
        const DATA = {
            personId: parseInt(ScanValue)
        }
        setItemList(await itemListOfPromotionsNotFactor(DATA, users.token));
        setShowItems(true)
    }

    const btnOnOffCamera_onClick = async () => {
        setShowCamera(!ShowCamera)
        // const DATA = {
        //     personId: parseInt(ScanValue)
        // }
        // setItemList(await itemListOfPromotionsNotFactor(DATA, users.token));
        // setShowItems(true)
    }

    const btnCancelItems_onClick = () => {
        setShowItems(false)
    }

    const btnConfirmItems_onClick = () => {
        alert('test')
    }

    // const handleAcceptGroup = () => {
    //     console.log(ItemsList);
    //     const fix = ItemsList?.filter((store) => store?.isChecked === true)?.map((item) => item?.id);
    //     setSelectedItems((prev) => ({ ...prev, fix }));
    // };
    const handleAcceptGroup = async () => {
        console.log(ItemsList);
        let tempSelectedItems = [];
        ItemsList.forEach(element => {
            if (element.isChecked)
                tempSelectedItems.push(element.id)
        });

        // setSelectedItems((prev) => ({ ...prev, tempSelectedItems }));
        setSelectedItems(tempSelectedItems);
        console.log(JSON.stringify(tempSelectedItems));

        const OBJ = {
            personId: parseInt(ScanValue),
            promotionPlatformCode: "206",
            itemIds: tempSelectedItems
        }
        let result = await checkItemsAndSendSmsToPerson(OBJ, users.token);
        if (result.length === 0)
            setShowInputCode(true)
    };

    const btnFinalConfirm_onClick = async () => {
        const OBJ = {
            companyId: companies.currentCompanyId,
            personId: parseInt(ScanValue),
            authCode: TxtConfirmCode,
            itemIds: SelectedItems
        }
        var result = await finalConfirmPurchaseReceipt(OBJ, users.token);
        setShowInputCode(false);
        setShowItems(false);
        alert(result);
    }

    const btnCancelConfirm_onClick = () => {
        setShowInputCode(false);

    }

    const txtConfirmCodePassword_onChanege = (e) => {
        setTxtConfirmCode(e.value);
    }

    return (
        <div>
            <Card className="shadow bg-white border pointer text-center">
                <Row className="standardPadding">
                    <Col>
                        <Button
                            icon={OnOffIcon}
                            onClick={btnOnOffCamera_onClick}
                            text="دوربین"
                            type="default"
                            stylingMode="contained"
                            rtlEnabled={true}
                            className="fontStyle"
                        />
                    </Col>
                </Row>
                {ShowCamera &&
                    <p>بارکد را در کادر قرمز رنگ قرار دهید</p>
                }                
            </Card>
            {ShowCamera &&
                <Row className="standardPadding">
                    <Scanner
                        onScan={Barcode_onScan}
                    />
                </Row>
            }

            {ShowItems &&
                <Modal
                    size="l"
                    // onClose={handleShowDetail}
                    label="کالاها"
                    isOpen={ShowItems}
                    footerButtons={[
                        <>
                            <Button
                                // icon={OnOffIcon}
                                onClick={btnCancelItems_onClick}
                                text="انصراف"
                                type="default"
                                stylingMode="contained"
                                rtlEnabled={true}
                                className="fontStyle"
                            />
                            <Button
                                // icon={OnOffIcon}                                
                                onClick={btnConfirmItems_onClick}
                                text="تائید"
                                type="default"
                                stylingMode="contained"
                                rtlEnabled={true}
                                className="fontStyle"
                            />
                        </>,
                    ]}
                >

                    <TableMultiSelect
                        submit={handleAcceptGroup}
                        allListRF={ItemsList}
                        columns={purchaseItemsColumns}
                        className="my-3"
                        xxl={12}
                        xl={12}
                        label="کالا"
                    />
                </Modal>
            }
            {ShowInputCode &&
                <Modal
                    size="l"
                    // onClose={handleShowDetail}
                    label="کالاها"
                    isOpen={ShowItems}
                    footerButtons={[
                        <>
                            <Button
                                // icon={OnOffIcon}
                                onClick={btnCancelConfirm_onClick}
                                text="انصراف"
                                type="default"
                                stylingMode="contained"
                                rtlEnabled={true}
                                className="fontStyle"
                            />
                            <Button
                                // icon={OnOffIcon}                                
                                onClick={btnFinalConfirm_onClick}
                                text="تائید نهایی و تحویل"
                                type="default"
                                stylingMode="contained"
                                rtlEnabled={true}
                                className="fontStyle"
                            />
                        </>,
                    ]}
                >
                    <TextBox
                        value={TxtConfirmCode}
                        showClearButton={true}
                        placeholder="کد تائید یا رمز"
                        rtlEnabled={true}
                        valueChangeEvent="keyup"
                        onValueChanged={txtConfirmCodePassword_onChanege}
                        className="fontStyle"
                    />
                </Modal>
            }
        </div>
    );
}

export default PurchaseReceipt;










// class PurchaseReceipt extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             scanValue: null,
//             stateCamera: false,
//             stateShowItems: false,
//             ItemsList: null,
//             ItemSelected:null,
//         };
//     }

//     Barcode_onScan = async (data) => {
//         this.setState({ scanValue: data[0].rawValue })
//         // const obj={
//         //     personId:869
//         // }
//         // const RESULT = await itemListOfPromotionsNotFactor(obj, this.props.User.token);
//     }

//     btnOnOffCamera_onClick = async () => {
//         this.setState({ stateCamera: !this.state.stateCamera })
//         const DATA = {
//             personId: 869
//         }
//         this.setState({
//             ItemsList: await itemListOfPromotionsNotFactor(DATA, this.props.User.token),
//             stateShowItems: true,
//         })
//     }

//     btnCancelItems_onClick = () => {
//         this.setState({
//             stateShowItems: false
//         })
//     }

//     handleAcceptGroup = () => {
//         console.log(this.state.stateShowItems);

//         const tempSelected = this.state.ItemsList
//             ?.filter((platform) => platform?.isChecked === true)
//             .map((item) => item.id);

//         this.setState((prevState)=>({ItemSelected:tempSelected}))

//         console.log(tempSelected);
//         // setTypeAndPlatform((prev) => ({ ...prev, fixAllPlatform }));
//     }

//     grdPurchaseItems_onSelectionChanged = ({
//         selectedRowKeys,
//         selectedRowsData,
//     }) => {
//         console.log(JSON.stringify(selectedRowsData));
//         let temp = [];
//         for (let i = 0; i < selectedRowsData.length; i++) {
//             let obj = { value: selectedRowsData[i].id };
//             temp.push(obj);
//         }
//         // this.setState({ OrderSelected: temp });
//     };

//     render() {
//         return (
//             <div>
//                 <Card className="shadow bg-white border pointer">
//                     <Row className="standardPadding">
//                         <Col>
//                             <Button
//                                 icon={OnOffIcon}
//                                 onClick={this.btnOnOffCamera_onClick}
//                                 text="دوربین"
//                                 type="default"
//                                 stylingMode="contained"
//                                 rtlEnabled={true}
//                                 className="fontStyle"
//                             />
//                         </Col>
//                     </Row>
//                     <p>{this.state.scanValue}</p>
//                 </Card>
//                 {this.state.stateCamera &&
//                     <Row className="standardPadding">
//                         <Scanner
//                             onScan={this.Barcode_onScan}
//                         />
//                     </Row>
//                 }

//                 {this.state.stateShowItems &&
//                     <Modal
//                         size="l"
//                         // onClose={handleShowDetail}
//                         label="پروموشن"
//                         isOpen={this.state.stateShowItems}
//                         footerButtons={[
//                             <>
//                                 <Button
//                                     // icon={OnOffIcon}
//                                     onClick={this.btnCancelItems_onClick}
//                                     text="انصراف"
//                                     type="default"
//                                     stylingMode="contained"
//                                     rtlEnabled={true}
//                                     className="fontStyle"
//                                 />
//                                 <Button
//                                     // icon={OnOffIcon}
//                                     icon={<CheckIcon className="ms-1 font18 fw-bold" />}
//                                     onClick={this.btnConfirmItems_onClick}
//                                     text="تائید"
//                                     type="default"
//                                     stylingMode="contained"
//                                     rtlEnabled={true}
//                                     className="fontStyle"
//                                 />
//                             </>,
//                         ]}
//                     >
//                         <Row className="standardPadding">
//                             <Col>
//                                 {/* <DataGrid
//                                     id="grdPurchaseItems"
//                                     dataSource={this.state.ItemsList}
//                                     defaultColumns={purchaseItemsColumns}
//                                     keyExpr="id"
//                                     columnAutoWidth={true}
//                                     allowColumnReordering={true}
//                                     showBorders={true}
//                                     rtlEnabled={true}
//                                     allowColumnResizing={true}
//                                     columnResizingMode="widget"
//                                     onSelectionChanged={
//                                         this.grdPurchaseItems_onSelectionChanged
//                                     }
//                                 >
//                                     <Scrolling
//                                         rowRenderingMode="virtual"
//                                         showScrollbar="always"
//                                         columnRenderingMode="virtual"
//                                     />

//                                     <Paging defaultPageSize={DataGridDefaultPageSize} />
//                                     <Pager
//                                         visible={true}
//                                         allowedPageSizes={DataGridPageSizes}
//                                         showPageSizeSelector={true}
//                                         showNavigationButtons={true}
//                                     />
//                                     <Selection
//                                         mode="multiple"
//                                         selectAllMode={ALL_MOD}
//                                         showCheckBoxesMode={CHECK_BOXES_MOD}
//                                     />
//                                     <Editing mode="cell" allowUpdating={true} />
//                                     <FilterRow visible={true} />
//                                     <HeaderFilter visible={true} />
//                                 </DataGrid> */}
//                                 <TableMultiSelect
//                                     submit={this.handleAcceptGroup}
//                                     allListRF={this.state.ItemsList}
//                                     columns={purchaseItemsColumns}
//                                     className="my-3"
//                                     xxl={12}
//                                     xl={2}
//                                     label="کالا"
//                                 />
//                             </Col>
//                         </Row>
//                     </Modal>
//                 }
//             </div>
//         )
//     }
// }
// const mapStateToProps = (state) => ({
//     User: state.users,
//     Company: state.companies,
// });

// export default connect(mapStateToProps)(PurchaseReceipt);

