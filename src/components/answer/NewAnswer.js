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
  questionList,
  updateQuestion,
} from "../../redux/reducers/question/question-actions";
import {
  questionTypeList
} from "../../redux/reducers/question/questionType-actions";
import {
  addAnswer, answerListById,
} from "../../redux/reducers/answer/answer-actions"
import {
  locationListByLocationType
} from "../../redux/reducers/userLocation/userLocation-actions"
import {
  supervisorList
} from "../../redux/reducers/person/person-actions"
import { DataGridQuestionColumns } from "./Question-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import { unitList } from "../../redux/reducers/unit/unit-actions";
import { zoneList } from "../../redux/reducers/zone/zone-actions";

class NewAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RowSelected: null,
      QuestionGridData: null,
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
      cmbQuestionTypeValue: null,
      cmbQuestionType: null,
      cmbLocationValue: null,
      cmbLocation: null,
      cmbSupervisor: null,
      cmbSupervisorValue: null,
      cmbManager: null,
      cmbManagerValue: null
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    await this.fn_questionTypeList();
    if (this.props.answerId != null)
      await this.fn_loadData(this.props.answerId);
  }

  fn_loadData = async (answerId) => {
    const answer = await answerListById(answerId, this.props.User.token);
    this.setState({
      cmbQuestionTypeValue: answer.questionTypeId,
      cmbLocationValue: answer.locationId,
      cmbSupervisorValue: answer.supervisorId,
      cmbManagerValue: answer.storeManagerId,
      QuestionGridData: await questionList(2, this.props.User.token)
    });

  }

  fn_updateGrid = async (e) => {
    if (this.state.stateDisable_show) {
      this.setState({
        QuestionGridData: await questionList(e, this.props.User.token),
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


  btnNew_onClick = () => {
    this.setState({
      txtPriorityValue: null,
      cmbZoneValue: null,
      txtScoreValue: null,
      cmbUnitValue: null,
      txtQuestionValue: null,
      stateUpdateDelete: false,
      chkIsActive: null,
    });
  };
  cmbLocation_onChange = async (e) => {
    var supervisor = await supervisorList(e, 5, this.props.User.token);
    this.setState({
      cmbLocationValue: e,
      cmbSupervisor: await supervisorList(e, 5, this.props.User.token), // 5 سوپروایزر
      cmbManager: await supervisorList(e, 6, this.props.User.token) // 6 سرپرست فروشگاه
    });
  };

  cmbSupervisor_onChange = (e) => {
    this.setState({
      cmbSupervisorValue: e,
    });
  };

  cmbQuestionType_onChange = async (e) => {
    this.setState({
      cmbQuestionTypeValue: e,
      cmbLocation: await locationListByLocationType(this.props.User.userId, this.props.Company.currentCompanyId, 1, this.props.User.token)
    });
  };

  cmbManager_onChange = (e) => {
    this.setState({
      cmbManagerValue: e
    })
  }

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    // document.getElementById("errQuestionType").innerHTML = "";
    // document.getElementById("errLocation").innerHTML = "";
    // document.getElementById("errSupervisor").innerHTML = "";
    // document.getElementById("errManager").innerHTML = "";

    // if (this.state.cmbQuestionTypeValue == null) {
    //   document.getElementById("errQuestiontype").innerHTML =
    //     "نوع سوال را انتخاب نمائید";
    //   flag = false;
    // }

    // if (this.state.cmbLocationValue == null) {
    //   document.getElementById("errLocation").innerHTML =
    //     "فروشگاه را انتخاب نمایید";
    //   flag = false;
    // }

    // if (this.state.cmbSupervisorValue == null) {
    //   document.getElementById("errSupervisor").innerHTML =
    //     "سوپروایزر را انتخاب نمایید";
    //   flag = false;
    // }

    // if (this.state.cmbManagerValue == null) {
    //   document.getElementById("errManager").innerHTML =
    //     "سرپرست فروشگاه را انتخاب نمایید";
    //   flag = false;
    // }
    return flag;
  };

  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        questionTypeId: this.state.cmbQuestionTypeValue,
        supervisorId: this.state.cmbSupervisorValue,
        locationId: this.state.cmbLocationValue,
        storeManagerId: this.state.cmbManagerValue,
        userId: this.props.User.userId
      };
      const RESULT = await addAnswer(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت",
          Type: RESULT != null ? "success" : "error",
        },
      });
      if (RESULT != null)
        this.fn_updateGrid(this.state.cmbQuestionTypeValue);
    }
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        questionTypeId: this.state.cmbQuestionTypeValue,
        supervisorId: this.state.cmbSupervisorValue,
        locationId: this.state.cmbLocationValue,
        storeManagerId: this.state.cmbManagerValue,
      };
      const RESULT = await updateQuestion(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
          Type: RESULT > 0 ? "success" : "error",
        },
      });
      this.fn_updateGrid(this.state.cmbQuestionTypeValue);
    }
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  //   btnDelete_onClick = async () => {
  //     const MSG = await deleteAnswer(
  //       this.state.RowSelected.id,
  //       this.props.User.token
  //     );
  //     this.setState({
  //       ToastProps: {
  //         isToastVisible: true,
  //         Message: MSG,
  //         Type: "success",
  //       },
  //     });
  //     this.fn_updateGrid(this.state.cmbQuestionTypeValue);
  //   };

  grdItemLocation_onUpdateRow = (params) => {
    let tempItems = [];
    if (!this.state.flagSelectAll) tempItems = this.state.ItemsListUpdated;
    let flagPush = true;
    for (let i = 0; i < tempItems.length; i++) {
      if (
        tempItems[i].itemId === params.data.itemId &&
        tempItems[i].locationId === params.data.locationId
      ) {
        tempItems[i].isActive = params.data.isActive;
        tempItems[i].maxPercentChange = params.data.maxPercentChange;
        tempItems[i].minPercentChange = params.data.minPercentChange;
        flagPush = false;
      }
    }
    if (flagPush) {
      let obj = {
        itemId: params.data.itemId,
        locationId: params.data.locationId,
        isActive: params.data.isActive,
        maxPercentChange: params.data.maxPercentChange,
        minPercentChange: params.data.minPercentChange
      };
      tempItems.push(obj);
    }
    this.setState({ ItemsListUpdated: tempItems, flagSelectAll: false });
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
              <Label>سوالات</Label>
            </Row>
            <Row className="standardPadding">
              <Col xs="auto">
                <Label className="standardLabelFont">نوع سوالات</Label>
                <SelectBox
                  dataSource={this.state.cmbQuestionType}
                  displayExpr="name"
                  placeholder="نوع سوالات"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbQuestionType_onChange}
                  value={this.state.cmbQuestionTypeValue}
                />
                <Row>
                  <Label
                    id="errQuestionType"
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
                <Label className="standardLabelFont">سوپروایزر</Label>
                <SelectBox
                  dataSource={this.state.cmbSupervisor}
                  displayExpr="fullName"
                  placeholder="سوپروایزر"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbSupervisor_onChange}
                  value={this.state.cmbSupervisorValue}
                />
                <Row>
                  <Label
                    id="errSupervisor"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">سرپرست فروشگاه</Label>
                <SelectBox
                  dataSource={this.state.cmbManager}
                  displayExpr="fullName"
                  placeholder="سرپرست فروشگاه"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbManager_onChange}
                  value={this.state.cmbManagerValue}
                />
                <Row>
                  <Label
                    id="errManager"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
            </Row>
            <Row className="standardSpaceTop">
              <Row>
                {this.state.stateDisable_btnUpdate && (

                  <Col xs="auto">
                    <Button
                      icon={UpdateIcon}
                      text="شروع بازرسی"
                      type="success"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnAdd_onClick}
                    />
                  </Col>
                )}
              </Row>
            </Row>
            <Row>
              <Col>
                <p
                  id="ErrorUpdateQuestion"
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
              <Label className="title">لیست سوالات {this.state.cmbQuestionTypeValue != null && this.state.cmbQuestionType.map(p => p.id == this.state.cmbQuestionTypeValue ? p.name : '')}</Label>
            </Row>
            <Row>
              <Col xs="auto" className="standardMarginRight">
                <DataGrid
                  dataSource={this.state.QuestionGridData}
                  defaultColumns={DataGridQuestionColumns}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  onRowClick={this.grdQuestion_onClickRow}
                  onRowUpdated={this.grdItemLocation_onUpdateRow}
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
        </Card>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(NewAnswer);
