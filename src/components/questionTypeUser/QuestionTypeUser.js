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
    Input,
} from "reactstrap";
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import { Toast } from "devextreme-react/toast";
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
    DataGridPageSizes,
    DataGridDefaultPageSize,
    DataGridDefaultHeight,
    ToastTime,
    ToastWidth,
    ALL_MOD,
    CHECK_BOXES_MOD,
    FILTER_BUILDER_POPUP_POSITION,
} from "../../config/config";
import {
    allQuestionType,
    allquestionType,
    questionTypeList
} from "../../redux/reducers/question/questionType-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import {
    questionTypeUserList,
    addQuestionTypeUser,
    deleteQuestionTypeUser,
    updateQuestionTypeUser
} from "../../redux/reducers/question/questionTypeUser-actions";
import { userList } from "../../redux/reducers/user/user-actions";

import { DataGridQuestionTypeUserColumns } from "./QuestionTypeUser-config";



import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

const dateLabel = { "aria-label": "Date" };

class QuestionTypeUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cmbUser: null,
            cmbUserValue: null,
            cmbQuestionType: null,
            cmbQuestionTypeValue: null,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            RowSelected: null,
            stateUpdateDelete: true,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_btnDelete: false,
            stateDisable_show: false,
            QuestionTypeUserGridData: null
        };
    }
    async componentDidMount() {
        await this.fn_GetPermissions();
        await this.fn_CheckRequireState();
        this.fn_userList();
        this.fn_questionTypeList();
        this.fn_updateGrid();
    }
    fn_userList = async () => {
        const LAZY = new DataSource({
            store: await userList(
                this.props.User.token
            ),
            paginate: true,
            pageSize: 10,
        });
        this.setState({
            cmbUser: LAZY
        });
    };
    fn_questionTypeList = async () => {
        this.setState({
            cmbQuestionType: await allQuestionType(this.props.User.token)
        });
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

    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "questionTypeUser.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "questionTypeUser.delete":
                        this.setState({ stateDisable_btnDelete: true });
                        break;
                    case "questionTypeUser.show":
                        this.setState({ stateDisable_show: true });
                        break;
                    case "questionTypeUser.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                }
            }
    };

    fn_updateGrid = async () => {
        this.setState({
            QuestionTypeUserGridData: await questionTypeUserList(this.props.User.token)
        })
    }

    cmbUser_onChange = (e) => {
        this.setState({
            cmbUserValue: e
        })
    };

    cmbQuestionType_onChange = (e) => {
        this.setState({
            cmbQuestionTypeValue: e
        })
    };

    onHidingToast = () => {
        this.setState({ ToastProps: { isToastVisible: false } });
    };

    btnNew_onClick = () => {
        this.setState({
            cmbUserValue: null,
            cmbQuestionTypeValue: null,
            stateUpdateDelete: false,
        });
    };

    grdQuestionTypeUser_onRowClick = (e) => {
        this.setState({
            cmbUserValue: e.data.userId,
            cmbQuestionTypeValue: e.data.questionTypeId,
            stateUpdateDelete: true,
            RowSelected: e.data,
        })
    }
    fn_CheckValidation = () => {
        let errMsg = "";
        let flag = true;
        document.getElementById("errUser").innerHTML = "";
        document.getElementById("errQuestionType").innerHTML = "";
        if (this.state.cmbUserValue == null) {
            document.getElementById("errUser").innerHTML =
                "بازرس را انتخاب نمائید";
            flag = false;
        }
        if (this.state.cmbQuestionTypeValue == null) {
            document.getElementById("errQuestionType").innerHTML =
                "نوع بازرسی را انتخاب نمائید";
            flag = false;
        }
        return flag;
    };
    btnAdd_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                userId: this.state.cmbUserValue,
                questionTypeId: this.state.cmbQuestionTypeValue,
            };
            const RESULT = await addQuestionTypeUser(data, this.props.User.token);
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

    btnDelete_onClick = async () => {
        const MSG = await deleteQuestionTypeUser(
            this.state.RowSelected.userId,
            this.state.RowSelected.questionTypeId,
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

    btnUpdate_onClick = async () => {
        if (await this.fn_CheckValidation()) {
          const data = {
            userId: this.state.cmbUserValue,
            questionTypeId: this.state.cmbQuestionTypeValue,
            questionTypeIdOld:this.state.RowSelected.questionTypeId
          };
    
          const RESULT = await updateQuestionTypeUser(data, this.props.User.token);
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
                            <Label>بازرس</Label>
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
                        <Row>
                            <Col xs="auto">
                                <Label className="standardLabelFont">نام کاربری</Label>
                                <SelectBox
                                    dataSource={this.state.cmbUser}
                                    searchEnabled={true}
                                    displayExpr="userName"
                                    placeholder="نام کاربری"
                                    valueExpr="id"
                                    rtlEnabled={true}
                                    onValueChange={this.cmbUser_onChange}
                                    value={this.state.cmbUserValue}
                                />
                                <Label
                                    id="errUser"
                                    className="standardLabelFont errMessage"
                                />
                            </Col>
                            <Col xs="auto">
                                <Label className="standardLabelFont">نوع بازرسی</Label>
                                <SelectBox
                                    dataSource={this.state.cmbQuestionType}
                                    displayExpr="name"
                                    placeholder="نوع بازرسی"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbQuestionType_onChange}
                                    value={this.state.cmbQuestionTypeValue}
                                />
                                <Label
                                    id="errQuestionType"
                                    className="standardLabelFont errMessage"
                                />
                            </Col>
                            <Row>
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
                                        </Row>
                                    </Row>
                                )}
                            </Row>
                        </Row>
                    </Row>
                </Card>
                <p></p>
                <Card className="shadow bg-white border pointer">
                    <Row className="standardPadding">
                        <Row>
                            <Label className="title"></Label>
                        </Row>
                    </Row>
                    <Row className="standardPadding">
                        <Row>
                            <Label className="title">لیست بازرس</Label>
                        </Row>

                        <Row>
                            <Col xs="auto" className="standardPadding">
                                <DataGrid
                                    dataSource={this.state.QuestionTypeUserGridData}
                                    defaultColumns={DataGridQuestionTypeUserColumns}
                                    showBorders={true}
                                    rtlEnabled={true}
                                    allowColumnResizing={true}
                                    onRowClick={this.grdQuestionTypeUser_onRowClick}
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
                                    <Editing mode="cell" allowUpdating={true} />
                                    <FilterRow visible={true} />
                                    <FilterPanel visible={true} />
                                </DataGrid>
                            </Col>
                        </Row>
                    </Row>
                    <Row style={{ paddingRight: "10px", paddingBottom: "10px" }}>
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

export default connect(mapStateToProps)(QuestionTypeUser);
