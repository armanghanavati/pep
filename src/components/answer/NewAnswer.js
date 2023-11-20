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
  answeredQuestionList,
} from "../../redux/reducers/question/question-actions";
import {
  questionTypeList
} from "../../redux/reducers/question/questionType-actions";
import {
  addAnswer, answerListById, confirmAnswer, deleteAnswer, updateAnswer
} from "../../redux/reducers/answer/answer-actions"
import {
  locationListByLocationType
} from "../../redux/reducers/userLocation/userLocation-actions"
import {
  supervisorList
} from "../../redux/reducers/person/person-actions"
import { DataGridQuestionColumns } from "./NewAnswer-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import { unitList } from "../../redux/reducers/unit/unit-actions";
import { zoneList } from "../../redux/reducers/zone/zone-actions";
import Answer from "./Answer";
import { addAnswerDetail } from "../../redux/reducers/answerDetail/answerDetail-actions";

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
      stateDisable_btnConfirm: true,
      stateDisable_showAdmin: false,
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
      cmbManagerValue: null,
      ItemsListUpdated: [],
      stateAnswer_show: false,
      AddedAnswerId: null,
      cmbZone:null,
      cmbZoneValue:null
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
    alert(JSON.stringify(answer))
    var t = 0;
    this.state.cmbQuestionType.forEach(element => {
      if (element.id == answer.questionTypeId) t = element.locationTypeId;
    })
    this.setState({
      cmbQuestionTypeValue: answer.questionTypeId,
      cmbLocation: await locationListByLocationType(this.props.User.userId, this.props.Company.currentCompanyId, t, this.props.User.token),
      cmbLocationValue: answer.locationId,
      cmbSupervisor: await supervisorList(answer.locationId, 5, this.props.User.token), // 5 سوپروایزر
      cmbSupervisorValue: answer.supervisorId,
      cmbManager: await supervisorList(answer.locationId, 6, this.props.User.token), // 6 سرپرست فروشگاه
      cmbManagerValue: answer.storeManagerId,
      cmbZone:await zoneList(this.props.User.token),
      cmbZoneValue:answer.zoneId,
      QuestionGridData: await answeredQuestionList(answerId, this.props.User.userId, answer.questionTypeId, answer.zoneId, this.props.User.token),
    });
  }

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
          case "answer.confirm":
            this.setState({ stateDisable_confirm: true });
            break;
          case "answer.showAdmin":
            this.setState({ stateDisable_showAdmin: true });
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
      cmbQuestionType: await questionTypeList(this.props.User.userId, this.props.User.token),
      cmbZone: await zoneList(this.props.User.token)
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
    var t = 0;
    this.state.cmbQuestionType.forEach(element => {
      if (element.id == e) t = element.locationTypeId;
    })
    this.setState({
      cmbQuestionTypeValue: e,
      cmbLocation: await locationListByLocationType(this.props.User.userId, this.props.Company.currentCompanyId, t, this.props.User.token)
    });
  };

  cmbManager_onChange = (e) => {
    this.setState({
      cmbManagerValue: e
    })
  }

  cmbZone_onChange=(e)=>{
    this.setState({
      cmbZoneValue:e
    })
  }

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errQuestionType").innerHTML = "";
    document.getElementById("errLocation").innerHTML = "";
    document.getElementById("errSupervisor").innerHTML = "";
    document.getElementById("errManager").innerHTML = "";

    if (this.state.cmbQuestionTypeValue == null) {
      document.getElementById("errQuestionType").innerHTML =
        "نوع سوال را انتخاب نمائید";
      flag = false;
    }

    if (this.state.cmbLocationValue == null) {
      document.getElementById("errLocation").innerHTML =
        "فروشگاه را انتخاب نمایید";
      flag = false;
    }

    if (this.state.cmbSupervisorValue == null) {
      document.getElementById("errSupervisor").innerHTML =
        "سوپروایزر را انتخاب نمایید";
      flag = false;
    }

    if (this.state.cmbManagerValue == null) {
      document.getElementById("errManager").innerHTML =
        "سرپرست فروشگاه را انتخاب نمایید";
      flag = false;
    }
    return flag;
  };

  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        questionTypeId: this.state.cmbQuestionTypeValue,
        supervisorId: this.state.cmbSupervisorValue,
        locationId: this.state.cmbLocationValue,
        storeManagerId: this.state.cmbManagerValue,
        userId: this.props.User.userId,
        zoneId:this.state.cmbZoneValue
      };
      const RESULT = await addAnswer(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت",
          Type: RESULT != null ? "success" : "error",
        },
      });
      if (this.props.answerId == null) {
        this.setState({
          AddedAnswerId: RESULT.id
        })
      }
      this.fn_loadData(RESULT.id);
    }
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        questionTypeId: this.state.cmbQuestionTypeValue,
        supervisorId: this.state.cmbSupervisorValue,
        locationId: this.state.cmbLocationValue,
        storeManagerId: this.state.cmbManagerValue,
        id: this.props.answerId,
        zoneId:this.state.cmbZoneValue
      };
      const RESULT = await updateAnswer(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT > 0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
          Type: RESULT > 0 ? "success" : "error",
        },
      });
      this.fn_loadData(this.props.answerId);
    }
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  btnDelete_onClick = async () => {
    const MSG = await deleteAnswer(
      this.props.answerId,
      this.props.User.token
    );
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: MSG,
        Type: "success",
      },
      stateAnswer_show: true
    });
  };

  grdQuestion_onUpdateRow = async (params) => {
    //alert(JSON.stringify(params.data))
    var data = {
      questionId: params.data.id,
      answerId: this.props.answerId == null ? this.state.AddedAnswerId : this.props.answerId,
      score: params.data.score,
      dec: params.data.dec
    };
    var minDesc = 0;
    var min = 0;
    var max = 0;
    this.state.cmbQuestionType.forEach(element => {
      if (element.id == this.state.cmbQuestionTypeValue) {
        minDesc = element.minDesc;
        min = params.data.min;
        max = params.data.max
      }
    })
    if (params.data.score > max || params.data.score < min) {
      alert("نمره باید از " + min + "تا " + max + "باشد ")
      if (this.props.answerId == null)
        this.fn_loadData(this.state.AddedAnswerId)
      else
        this.fn_loadData(this.props.answerId)
    }
    else {
      if (params.data.score < minDesc && params.data.dec == null)
        alert("توضیحات باید وارد شود")
      else {
        var result = await addAnswerDetail(data, this.props.User.token);
        if (this.props.answerId == null)
          this.fn_loadData(this.state.AddedAnswerId)
        else
          this.fn_loadData(this.props.answerId)
      }
    }
  };
  btnInsList_onClick = async () => {
    this.setState({
      stateAnswer_show: true
    });
  }

  btnConfirm_onClick = async () => {
    const data = {
      answerId: this.props.answerId == null ? this.state.AddedAnswerId : this.props.answerId,
      confirm: 1
    };

    const RESULT = await confirmAnswer(data, this.props.User.token);
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: RESULT > 0 ? "ثبت نهایی با موفقیت انجام گردید" : "عدم ثبت",
        Type: RESULT > 0 ? "success" : "error",
      },
      stateAnswer_show: true
    });
    if (this.props.answerId == null)
      this.fn_loadData(this.state.AddedAnswerId)
    else
      this.fn_loadData(this.props.answerId)
  }
  render() {
    return (
      this.state.stateAnswer_show == false ? (
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
                <Label>بازرسی</Label>
              </Row>
              <Row className="standardPadding">
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
                  <Row>
                    <Label
                      id="errQuestionType"
                      className="standardLabelFont errMessage"
                    />
                  </Row>
                </Col>
                <Col xs="auto">
                  <Label className="standardLabelFont">حوزه</Label>
                  <SelectBox
                    dataSource={this.state.cmbZone}
                    displayExpr="name"
                    placeholder="حوزه"
                    valueExpr="id"
                    searchEnabled={true}
                    rtlEnabled={true}
                    onValueChange={this.cmbZone_onChange}
                    value={this.state.cmbZoneValue}
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
                <Col xs="auto">
                  <Button
                    text="لیست بازرسی"
                    type="success"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnInsList_onClick}
                  />
                </Col>
                {this.state.stateDisable_btnAdd && (
                  this.props.answerId == null && (
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
                  ))}


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
                <Label className="title">لیست {this.state.cmbQuestionTypeValue != null && this.state.cmbQuestionType.map(p => p.id == this.state.cmbQuestionTypeValue ? p.name : '')}</Label>
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
                    onRowUpdated={this.grdQuestion_onUpdateRow}
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
              {this.state.stateDisable_btnConfirm && !this.state.stateDisable_showAdmin && (
                <Row>
                  <Col xs="auto" className="standardMarginRight">
                    <Button
                      icon={UpdateIcon}
                      text="ثبت نهایی"
                      type="success"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnConfirm_onClick}
                    />
                  </Col>
                </Row>
              )}
            </Row >
          </Card>
        </div>
      ) : (
        <Answer />
      )
    );
  }
}
const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(NewAnswer);
