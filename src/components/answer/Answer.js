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
} from "devextreme-react/data-grid";
import {
    DataGridPageSizes,
    DataGridDefaultPageSize,
    DataGridDefaultHeight,
    ToastTime,
    ToastWidth,
} from "../../config/config";
import {
    answerList,
} from "../../redux/reducers/answer/answer-actions";
import {
    questionTypeList
} from "../../redux/reducers/question/questionType-actions";
import { DataGridAnswerColumns } from "./Answer-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import NewAnswer from "./NewAnswer";
import { zoneList } from "../../redux/reducers/zone/zone-actions";

class Answer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            AnswerGridData: null,
            stateDisable_btnAdd: false,
            stateDisable_btnUpdate: false,
            stateDisable_btnDelete: false,
            stateDisable_show: false,
            stateDisable_confirmUpdate: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            cmbQuestionTypeValue: null,
            cmbQuestionType: null,
            stateNewAnswer_show: false,
            AnswerId: null,
        };
    }
    async componentDidMount() {
        await this.fn_GetPermissions();
        await this.fn_CheckRequireState();
        //await this.fn_questionTypeList();
        this.fn_updateGrid();
    }

    fn_updateGrid = async () => {
        if (this.state.stateDisable_show) {
            this.setState({
                AnswerGridData: await answerList(this.props.User.userId, this.state.stateDisable_confirmUpdate ? 0 : 1, this.props.User.token),
            });
        }
    };

    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "answer.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "answer.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "answer.delete":
                        this.setState({ stateDisable_btnDelete: true });
                        break;
                    case "answer.show":
                        this.setState({ stateDisable_show: true });
                        break;
                    case "answer.confirmUpdate":
                        this.setState({ stateDisable_confirmUpdate: true });
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

    fn_questionTypeList = async () => {
        this.setState({
            cmbQuestionType: await questionTypeList(this.props.User.userId, this.props.User.token)
        })
    }

    grdAnswer_ondblClickRow = (e) => {
        //alert(JSON.stringify(e.data))
        this.setState({
            AnswerId: e.data.id,
            stateNewAnswer_show: true
        });
    };

    btnNew_onClick = () => {
        this.setState({
            stateNewAnswer_show: true
        })
    };

    cmbQuestionType_onChange = (e) => {
        this.setState({
            cmbQuestionTypeValue: e,
        });
    };

    onHidingToast = () => {
        this.setState({ ToastProps: { isToastVisible: false } });
    };

    grdAnswer_onRowPrepared = (e) => {
        if (e.rowType === "data" && e.data.confirm == 1 && !this.state.stateDisable_confirmUpdate)
            e.rowElement.style.backgroundColor = "#60c77f";
    };


    render() {
        return (
            this.state.stateNewAnswer_show == false ? (
                <div className="standardMargin" style={{ direction: "rtl" }}>
                    <Toast
                        visible={this.state.ToastProps.isToastVisible}
                        message={this.state.ToastProps.Message}
                        type={this.state.ToastProps.Type}
                        onHiding={this.onHidingToast}
                        displayTime={ToastTime}
                        width={ToastWidth}
                        rtlEnabled={true}
                        className="fontStyle"
                    />

                    <Card className="shadow bg-white border pointer">
                        <Row className="standardPadding">
                            <Row>
                                <Label className="title">لیست بازرسی</Label>
                            </Row>
                            {this.state.stateDisable_btnUpdate && (

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
                            )}
                            <p></p>
                            <Row>
                                <Col xs="auto" className="standardMarginRight" >
                                    <DataGrid
                                        dataSource={this.state.AnswerGridData}
                                        defaultColumns={DataGridAnswerColumns}
                                        showBorders={true}
                                        rtlEnabled={true}
                                        allowColumnResizing={true}
                                        onRowDblClick={this.grdAnswer_ondblClickRow}
                                        onRowPrepared={this.grdAnswer_onRowPrepared}
                                        height={DataGridDefaultHeight}
                                        columnAutoWidth={true}
                                        className="fontStyle"
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
            ) : (
                <NewAnswer answerId={this.state.AnswerId} />
            )
        );
    }
}
const mapStateToProps = (state) => ({
    User: state.users,
    Company: state.companies,
});

export default connect(mapStateToProps)(Answer);
