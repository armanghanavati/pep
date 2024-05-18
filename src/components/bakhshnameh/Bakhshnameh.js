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
import SelectBox, { Position } from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import { CheckBox } from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";
import { Tooltip } from "devextreme-react/tooltip";
import HtmlEditor, {
    Toolbar,
    MediaResizing,
    ImageUpload,
    Item,
} from 'devextreme-react/html-editor';
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
    updateBakhshnameh,
    addBakhshnameh,
    bakhshnamehList,
    deleteBakhshnameh,
    updateBakhshnamehStatus,
} from "../../redux/reducers/bakhshnameh/bakhshnameh-actions";
import { UploadFiles, AttachmentList } from '../../redux/reducers/Attachments/attachment-action';
import { bakhshnamehTypeList } from "../../redux/reducers/bakhshnameh/bakhshnamehType-actions";
import { positionList, searchPositionByBakhshnamehTypeIdList, searchPositionByUserId } from "../../redux/reducers/position/position-actions";
import "../../assets/CSS/style.css";
import { DataGridBakhshnamehColumns, tabs } from "./Bakhshnameh-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import AttachmentIcon from '../../assets/images/icon/attachment.png';
import RejectIcon from '../../assets/images/icon/reject.png';
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import { addBakhshnamehLog } from "../../redux/reducers/bakhshnameh/bakhshnamehLog-ations";
import { searchBakhshnamehPositionByBakhshnamehIdList } from "../../redux/reducers/bakhshnameh/bakhshnamehPosition-actions";
import { accordionActionsClasses } from "@mui/material";
import { FlashAuto } from "@mui/icons-material";

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = [
    'Arial',
    'Courier New',
    'Georgia',
    'Impact',
    'Lucida Console',
    'Tahoma',
    'Times New Roman',
    'Verdana',
];
const headerValues = [false, 1, 2, 3, 4, 5];
const fontSizeOptions = {
    inputAttr: {
        'aria-label': 'Font size',
    },
};
const fontFamilyOptions = {
    inputAttr: {
        'aria-label': 'Font family',
    },
};
const headerOptions = {
    inputAttr: {
        'aria-label': 'Font family',
    },
};
var checkList = [];
class Bakhshnameh extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cmbBakhshnamehType: null,
            cmbBakhshnamehTypeValue: null,
            txtTitleValue: null,
            txtTextValue: null,
            RowSelected: null,
            BakhshnamehGridData: null,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_btnDelete: false,
            stateDisable_show: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            positionList: null,
            stateModalBakhshnameh: false,
            newState: true,
            chkIsRead: false,
            bakhshnamehPostionList: null,
            AttachedFiles: null,
            Attachments: null,
            positionId: null,
            t:false,
        };
    }
    async componentDidMount() {
        await this.fn_GetPermissions();
        await this.fn_CheckRequireState();
        // await this.fn_getPositionId();
        this.fn_bakhshnamehType();
        this.fn_updateGrid();
    }

    fn_bakhshnamehType = async () => {
        this.setState({
            cmbBakhshnamehType: await bakhshnamehTypeList(await searchPositionByUserId(this.props.User.userId, this.props.Company.currentCompanyId, this.props.User.token), this.props.User.token)
        })
    }

    fn_updateGrid = async () => {
        if (this.state.stateDisable_show)
            this.setState({
                BakhshnamehGridData: await bakhshnamehList(await searchPositionByUserId(this.props.User.userId, this.props.Company.currentCompanyId, this.props.User.token), this.props.User.userId, this.props.User.token),
            });
    };

    fn_getPositionId = async () => {
        this.setState({
            positionId: await searchPositionByUserId(this.props.User.userId, this.props.Company.currentCompanyId, this.props.User.token)
        })
    }

    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "bakhshnameh.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "bakhshnameh.show":
                        this.setState({ stateDisable_show: true });
                        break;
                    case "bakhshnameh.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "bakhshnameh.delete":
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

    setFile = (e) => {
        let errMsg = "";
        var files = [];
        for (let i = 0; i < e.target.files.length; i++) {
            if (e.target.files[i].size > 5000000)
                errMsg += "فایل" + e.target.files[i].name + "بیشتر از 5 مگابایت است." + "<br>"
            else {
                files.push(e.target.files[i]);
            }
        }
        document.getElementById("ErrTicketAttachments").innerHTML = errMsg;
        this.setState({
            AttachedFiles: files,
        });
    }

    btnClearFileAttach_onClick = (e) => {
        //alert(e.target.id);
        var temp = this.state.AttachedFiles;
        temp.splice(e.target.id, 1)
        //this.state.AttachedCommentFiles.remove(e.target.id);
        this.setState({
            AttachedFiles: temp
        })
    }
    grdBakhshnameh_onClickRow = async (e) => {
        var sb = await searchBakhshnamehPositionByBakhshnamehIdList(e.data.id, this.props.User.token) // سمت های مربوط به بخشنامه
        var stb = await searchPositionByBakhshnamehTypeIdList(e.data.bakhshnamehTypeId, this.props.User.token) // سمت های مربوط به نوع بخشنامه
        //alert(JSON.stringify(p))
        //alert(JSON.stringify(t))
        this.setState({
            cmbBakhshnamehTypeValue: e.data.bakhshnamehTypeId,
            txtTitleValue: e.data.title,
            txtTextValue: e.data.text,
            RowSelected: e.data,
            stateModalBakhshnameh: true,
            newState: e.data.statusLog == 1 && e.data.userIdLog == this.props.User.userId ? true : false, // چک کردن اینکه کاربر برای این بخشنامه  مطالعه کردم را کلیک کرده یا خیر
            bakhshnamehPostionList: await searchBakhshnamehPositionByBakhshnamehIdList(e.data.id, this.props.User.token),
        });
        var position = [];
        for (var i = 0; i < stb.length; i++) {
            if (sb.length < i + 1) {
                position.push({ positionId: stb[i].id, positionName: stb[i].positionName, check: false })
                continue;
            }

            if (stb[i].id == sb[i].positionId) {
                position.push({ positionId: stb[i].id, positionName: stb[i].positionName, check: true })
            }
            else {
                position.push({ positionId: stb[i].id, positionName: stb[i].positionName, check: false })
            }
        }
        this.setState({
            positionList: position
        })
        const obj = {
            AttachmentId: e.data.id
        }
        this.setState({ Attachments: await AttachmentList(obj, this.props.User.token) })
        //alert(JSON.stringify(position))
    };

    btnNew_onClick = () => {
        this.setState({
            cmbBakhshnamehTypeValue: null,
            txtTitleValue: null,
            txtTextValue: null,
            stateModalBakhshnameh: true,
            newState: true,
            RowSelected: null,
            Attachments: null,
            AttachedFiles: null,
            t:true,
        });
    };


    fn_CheckValidation = () => {
        let errMsg = "";
        let flag = true;
        document.getElementById("errBakhshnamehType").innerHTML = "";
        document.getElementById("errTitle").innerHTML = "";
        if (this.state.cmbBakhshnamehTypeValue == null) {
            document.getElementById("errBakhshnamehType").innerHTML =
                "نوع اسناد را وارد نمائید";
            flag = false;
        }
        if (this.state.txtTitleValue == null) {
            document.getElementById("errTitle").innerHTML =
                "عنوان اسناد را وارد نمائید";
            flag = false;
        }

        return flag;
    };
    btnAdd_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                userId: this.props.User.userId,
                bakhshnamehTypeId: this.state.cmbBakhshnamehTypeValue,
                title: this.state.txtTitleValue,
                text: this.state.txtTextValue,
                status: 0,
                bakhshnamehIds: checkList
            };
            //alert(JSON.stringify(data))
            const RESULT = await addBakhshnameh(data, this.props.User.token);
            if (RESULT != null) {
                const attachObj = {
                    AttachedFile: this.state.AttachedFiles,
                    AttachmentId: RESULT.id,
                    AttachmentType: "bk",
                    AttachmentName: "bakhshnameh"
                }
                this.state.AttachedFiles && await UploadFiles(attachObj, this.props.User.token);
            }
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

    btnAddConfirm_onClick = async () => {
        var data =
        {
            id: this.state.RowSelected.id,
            status: 1 // final
        }

        const RESULT = await updateBakhshnamehStatus(data, this.props.User.token);
        this.setState({
            ToastProps: {
                isToastVisible: true,
                Message: RESULT != null ? "وایریش با موفقیت انجام گردید" : "عدم ویرایش",
                Type: RESULT != null ? "success" : "error",
            },
        });
        this.fn_updateGrid();
    }

    txtTitle_onChange = (e) => {
        this.setState({ txtTitleValue: e.value });
    };
    cmbBakhshnamehType_onChange = async (e) => {
        this.setState({ positionList: await searchPositionByBakhshnamehTypeIdList(e, this.props.User.token) })
        this.setState({
            cmbBakhshnamehTypeValue: e
        });
    };
    chkIsRead_onChange = async (e) => {
        if (e.value) {
            var data = {
                bakhshnamehId: this.state.RowSelected.id,
                userId: this.props.User.userId,
                status: 1
            }
            await addBakhshnamehLog(data, this.props.User.token)
            this.setState({
                stateModalBakhshnameh: false
            })
            this.fn_updateGrid();
        }
    }

    btnUpdate_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                id: this.state.CompanyId,
                companyName: this.state.txtCompanyNameValue,
                economicCode: this.state.txtEconomicCodeValue,
                nationalCode: this.state.txtNationalCodeValue,
                address: this.state.txtAddressValue,
                companyType: this.state.txtCompanyTypeValue,
                isActive: this.state.chkIsActive,
            };

            const RESULT = await updateBakhshnameh(data, this.props.User.token);
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
        const RESULT = await deleteBakhshnameh(
            this.state.RowSelected.id,
            this.props.User.token
        );
        this.setState({
            ToastProps: {
                isToastVisible: true,
                Message: RESULT > 0 ? "حذف با موفقیت انجام گردید" : "عدم حذف",
                Type: RESULT > 0 ? "success" : "error",
            },
        });
        this.fn_updateGrid();
    };

    txtText_onChange = (e) => {
        this.setState({
            txtTextValue: e.value
        });
    }

    ModalBakhshnameh_onClickAway = () => {
        this.setState({ stateModalBakhshnameh: false })
    }

    chkPosition_onChange = (event) => {
        const checkedId = event.target.value;

        if (event.target.checked) {
            checkList = [...checkList, parseInt(checkedId)]
        } else {
            checkList = checkList.filter(id => id !== parseInt(checkedId))
        }
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
                <Row className="text-center">
                    <Col>
                        <Modal style={{ direction: 'rtl' }}
                            isOpen={this.state.stateModalBakhshnameh}
                            toggle={this.ModalBakhshnameh_onClickAway}
                            centered={true}
                            size="xl"
                            className="fontStyle"
                        >
                            <ModalHeader>
                                ثبت اسناد
                            </ModalHeader>
                            <ModalBody>
                                <Row className="standardPadding">
                                    <Row>
                                        <Col xs="auto">
                                            <Label className="standardLabelFont">نوع اسناد</Label>
                                            <SelectBox
                                                dataSource={this.state.cmbBakhshnamehType}
                                                displayExpr="name"
                                                placeholder="انتخاب نوع اسناد"
                                                valueExpr="id"
                                                searchEnabled={true}
                                                rtlEnabled={true}
                                                onValueChange={this.cmbBakhshnamehType_onChange}
                                                value={this.state.cmbBakhshnamehTypeValue}
                                            />
                                            <Row>
                                                <Label
                                                    id="errBakhshnamehType"
                                                    className="standardLabelFont errMessage"
                                                />
                                            </Row>
                                        </Col>
                                        <Col xs={4}>
                                            <Label className="standardLabelFont">عنوان سند</Label>
                                            <TextBox
                                                value={this.state.txtTitleValue}
                                                showClearButton={true}
                                                placeholder="عنوان سند"
                                                rtlEnabled={true}
                                                valueChangeEvent="keyup"
                                                onValueChanged={this.txtTitle_onChange}
                                            />
                                            <Row>
                                                <Label
                                                    id="errTitle"
                                                    className="standardLabelFont errMessage"
                                                />
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="widget-container">
                                        <Col>
                                            <HtmlEditor
                                                height="300px"
                                                //defaultValue={marjup}
                                                //valueType={editorValueType}
                                                value={this.state.txtTextValue}
                                                onValueChanged={this.txtText_onChange}
                                            //rtlEnabled="true"
                                            >
                                                <MediaResizing enabled={true} />
                                                <ImageUpload
                                                    tabs={tabs[0].value}
                                                    fileUploadMode="base64"
                                                />
                                                <Toolbar multiline={true}>
                                                    <Item name="undo" />
                                                    <Item name="redo" />
                                                    <Item name="separator" />
                                                    <Item
                                                        name="size"
                                                        acceptedValues={sizeValues}
                                                        options={fontSizeOptions}
                                                    />
                                                    <Item
                                                        name="font"
                                                        acceptedValues={fontValues}
                                                        options={fontFamilyOptions}
                                                    />
                                                    <Item name="separator" />
                                                    <Item name="bold" />
                                                    <Item name="italic" />
                                                    <Item name="strike" />
                                                    <Item name="underline" />
                                                    <Item name="separator" />
                                                    <Item name="alignLeft" />
                                                    <Item name="alignCenter" />
                                                    <Item name="alignRight" />
                                                    <Item name="alignJustify" />
                                                    <Item name="separator" />
                                                    <Item name="orderedList" />
                                                    <Item name="bulletList" />
                                                    <Item name="separator" />
                                                    <Item
                                                        name="header"
                                                        acceptedValues={headerValues}
                                                        options={headerOptions}
                                                    />
                                                    <Item name="separator" />
                                                    <Item name="color" />
                                                    <Item name="background" />
                                                    <Item name="separator" />
                                                    <Item name="link" />
                                                    <Item name="image" />
                                                    <Item name="separator" />
                                                    <Item name="clear" />
                                                    <Item name="codeBlock" />
                                                    <Item name="blockquote" />
                                                    <Item name="separator" />
                                                    <Item name="insertTable" />
                                                    <Item name="deleteTable" />
                                                    <Item name="insertRowAbove" />
                                                    <Item name="insertRowBelow" />
                                                    <Item name="deleteRow" />
                                                    <Item name="insertColumnLeft" />
                                                    <Item name="insertColumnRight" />
                                                    <Item name="deleteColumn" />
                                                </Toolbar>
                                            </HtmlEditor>
                                        </Col>

                                        <Row className="standardMargin">
                                            <Col>
                                                {this.state.positionList != null && this.state.positionList.map((item, index) => (
                                                    <label key={item.id}>
                                                        <input
                                                            type="checkbox"
                                                            value={item.id}
                                                            text={item.positionName}
                                                            checked={item.check}
                                                            onChange={(event) => { this.chkPosition_onChange(event) }}
                                                        />
                                                        {item.positionName}
                                                    </label>
                                                )
                                                )}
                                            </Col>
                                            <Col>
                                                { this.state.RowSelected == null || (this.state.RowSelected != null && this.state.RowSelected.status == 0 && this.state.RowSelected.userId == this.props.User.userId)&&(
                                                    <Col xs="auto">
                                                        <label for="file-TicketAttachment">
                                                            <Button
                                                                icon={AttachmentIcon}
                                                                text="پیوست فایل"
                                                                type="default"
                                                                stylingMode="outlined"
                                                                rtlEnabled={true}
                                                                id="file-input"
                                                                className="fontStyle"
                                                            />

                                                        </label>

                                                        {this.state.AttachedFiles && this.state.AttachedFiles.map((item, key) =>
                                                            <>
                                                                <Col>{item.name}</Col>
                                                                <Col>
                                                                    <img src={RejectIcon} id={key} onClick={e => this.btnClearFileAttach_onClick(e)} width={10} height={10} />
                                                                </Col>
                                                            </>
                                                        )}
                                                        <input id="file-TicketAttachment" type="file" multiple style={{ display: "none" }} onChange={e => this.setFile(e)} />
                                                        <p id="ErrTicketAttachments" className='errMessage' ></p>
                                                    </Col>
                                                )}


                                                <Row className="standardPadding" style={{ overflowY: 'scroll', maxHeight: '450px', background: '#ffcdcd' }}>
                                                    {this.state.Attachments && this.state.Attachments.map((item, key) =>

                                                        <Card className="shadow bg-white border pointer" key={key}>
                                                            <Row className="standardPadding">
                                                                <Col xs='auto'>
                                                                    {(item.ext.toLowerCase() == ".jpg" || item.ext.toLowerCase() == ".png" || item.ext.toLowerCase() == ".jpeg" || item.ext.toLowerCase() == ".ico") &&
                                                                        <img src={window.siteAddress + "/" + item.attachmentType + "/" + item.fileName + item.ext} style={{ width: "100px", height: "100px" }} />
                                                                    }
                                                                    <p><a href={window.siteAddress + "/" + item.attachmentType + "/" + item.fileName + item.ext} target="_blank">دانلود فایل {item.ext}</a></p>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    )}
                                                </Row>
                                            </Col>
                                        </Row>


                                    </Row>

                                    {  this.state.RowSelected == null || (this.state.RowSelected != null && this.state.RowSelected.userId == this.props.User.userId && this.state.RowSelected.status === 0) &&(
                                        <>
                                            <Row className="standardMargin">
                                                {this.state.stateDisable_btnAdd && (
                                                    <Col xs="auto">
                                                        <Button
                                                            icon={SaveIcon}
                                                            text="ذخیره"
                                                            type="success"
                                                            stylingMode="contained"
                                                            rtlEnabled={true}
                                                            onClick={this.btnAdd_onClick}
                                                        />
                                                    </Col>
                                                )}
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
                                                {this.state.stateDisable_btnAdd && (
                                                    <Col xs="auto">
                                                        <Button
                                                            icon={SaveIcon}
                                                            text="انتشار"
                                                            type="success"
                                                            stylingMode="contained"
                                                            rtlEnabled={true}
                                                            onClick={this.btnAddConfirm_onClick}
                                                        />
                                                    </Col>
                                                )}
                                            </Row>
                                        </>
                                    )}

                                    {!this.state.newState && this.state.RowSelected.userId != this.props.User.userId && (
                                        <Row className="standardMargin">
                                            <CheckBox
                                                value={this.state.chkIsRead}
                                                text="مطالعه کردم"
                                                rtlEnabled={true}
                                                onValueChanged={this.chkIsRead_onChange}
                                            />
                                        </Row>
                                    )}
                                </Row>

                            </ModalBody>
                        </Modal>
                    </Col>
                </Row>
                <Card className="shadow bg-white border pointer">
                    <Row className="standardPadding">
                        <Row>
                            <Label className="title">لیست  اسناد</Label>
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
                        <Row className="standardMargin">
                            <Col xs="auto" className="standardMarginRight">
                                <DataGrid
                                    dataSource={this.state.BakhshnamehGridData}
                                    defaultColumns={DataGridBakhshnamehColumns}
                                    showBorders={true}
                                    rtlEnabled={true}
                                    allowColumnResizing={true}
                                    onRowClick={this.grdBakhshnameh_onClickRow}
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

export default connect(mapStateToProps)(Bakhshnameh);
