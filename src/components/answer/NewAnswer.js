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
import { confirm } from "devextreme/ui/dialog";
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
  locationListByLocationType, locationListCombo
} from "../../redux/reducers/userLocation/userLocation-actions"
import {
  personList,
  supervisorList
} from "../../redux/reducers/person/person-actions"
import { DataGridQuestionColumns } from "./NewAnswer-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { unitList } from "../../redux/reducers/unit/unit-actions";
import { zoneList } from "../../redux/reducers/zone/zone-actions";
import Answer from "./Answer";
import { addAnswerDetail } from "../../redux/reducers/answerDetail/answerDetail-actions";
import Wait from "../common/Wait";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import StartIcon from "../../assets/images/icon/plus.png";
import { locationByUserId, locationList } from "../../redux/reducers/location/location-actions";
import { userLocationList } from "../../redux/reducers/user/user-actions";
import { Gfn_convertENunicode } from "../../utiliy/GlobalMethods";

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
      stateDisable_btnConfirm: false,
      stateDisable_confirmUpdate: false,
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
      confirm: null,
      disable_questionType: null,
      oldParam:null,
      stateWait: false,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    await this.fn_questionTypeList();
    if (this.props.answerId != null){
      this.OpenCloseWait();
      await this.fn_loadData(this.props.answerId);
      this.OpenCloseWait();
    }
    else {
      this.fn_locationList();
    }
  }

  fn_loadData = async (answerId) => {
    const answer = await answerListById(answerId, this.props.User.token);
    //alert(JSON.stringify(answer))
    var supervisor = await supervisorList(answer.locationId, 5, this.props.User.token); // 5 سوپروایزر
    var manager = await supervisorList(answer.locationId, 6, this.props.User.token); // 6 سرپرست فروشگاه
    var person = await personList(this.props.Company.currentCompanyId, this.props.User.token);
    this.setState({
      disable_questionType: true,
      confirm: answer.confirm,
      cmbQuestionType: await questionTypeList(this.props.User.userId, this.props.User.token), //[{ id: answer.questionTypeId, name: answer.questionTypeName, minDesc: answer.minDesc, min: answer.min, max: answer.max }],
      cmbQuestionTypeValue: answer.questionTypeId,
      cmbLocation: await userLocationList(this.props.User.userId, this.props.Company.currentCompanyId, this.props.User.token),// [{ id: answer.locationId, locationName: answer.location }],
      cmbLocationValue: answer.locationId,
      cmbSupervisor: person, //[{ id: answer.supervisorId, fullName: answer.supervisor }],
      cmbSupervisorValue: answer.supervisorId,
      cmbManager: person,//[{ id: answer.supervisorId, fullName: answer.manager }],
      cmbManagerValue: answer.storeManagerId,
      QuestionGridData: await answeredQuestionList(answerId, answer.questionTypeId, answer.zoneId, this.props.User.token),
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
            this.setState({ stateDisable_btnConfirm: true });
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

  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }

  fn_questionTypeList = async () => {
    this.setState({
      cmbQuestionType: await questionTypeList(this.props.User.userId, this.props.User.token),
    })
  }

  fn_locationList = async () => {
    this.setState({
      cmbLocation: await userLocationList(this.props.User.userId, this.props.Company.currentCompanyId, this.props.User.token)
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
    this.setState({
      cmbLocationValue: e,
    })
    var supervisor = await supervisorList(e, 5, this.props.User.token); // 5 سوپروایزر
    var manager = await supervisorList(e, 6, this.props.User.token); // 6 سرپرست فروشگاه
    var person = await personList(this.props.Company.currentCompanyId, this.props.User.token);
    this.setState({
      cmbSupervisor: supervisor.length > 0 ? supervisor : person,
      cmbManager: manager.length > 0 ? manager : person
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
        id: this.props.answerId
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
    if (this.state.oldParam != null && this.state.oldParam.data.dec == null && params.data.id != this.state.oldParam.data.id) {
      this.state.oldParam.data.score = null
      this.state.oldParam = null;
    }

    if (this.state.confirm == 1 && !this.state.stateDisable_confirmUpdate) {
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: "بازرسی ثبت نهایی شده امکان ویرایش ندارد",
          Type: "error",
        },
      });
    }
    else {
      var data = {
        questionId: params.data.id,
        answerId: this.props.answerId == null ? this.state.AddedAnswerId : this.props.answerId,
        score: Gfn_convertENunicode(params.data.score),
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
        this.setState({
          ToastProps: {
            isToastVisible: true,
            Message: "نمره باید از " + min + "تا " + max + "باشد ",
            Type: "error",
          },
        });
        params.data.score = null
      }
      else {
        if (params.data.score < minDesc && params.data.dec == null) {
          this.setState({
            ToastProps: {
              isToastVisible: true,
              Message: "توضیحات باید وارد شود",
              Type: "error",
            },
          });
          this.state.oldParam = null;
          this.state.oldParam = params;
          //console.log(t)
        }
        else {
          const RESULT=await addAnswerDetail(data, this.props.User.token);
          this.setState({
            ToastProps: {
              isToastVisible: true,
              Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت",
              Type: RESULT != null ? "success" : "error",
            },
          });
        }
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
    var t = 0;
    var minDesc = 0;
    var min = 0;
    var max = 0;
    this.state.cmbQuestionType.forEach(element => {
      if (element.id == this.state.cmbQuestionTypeValue) {
        minDesc = element.minDesc;
      }
    })

    this.state.QuestionGridData.forEach(element => {
      if (element.score == null || (element.score < minDesc && element.dec == null)) {
        t = 1
      }
    });

    if (t > 0) {
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: "برای تایید نهایی باید تمامی سوالات پاسخ داده شوند",
          Type: "error",
        },
      });
    }
    else {
      let result = confirm("در صورت ثبت نهایی امکان ویرایش وجود ندارد");
      result.then(async (dialogResult) => {
        if (dialogResult) {
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
        else {
          return;
        }
      });
    }
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
                    className="fontStyle"
                    disabled={this.state.disable_questionType}
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
                    displayExpr="label"
                    placeholder="فروشگاه"
                    valueExpr="id"
                    searchEnabled={true}
                    rtlEnabled={true}
                    onValueChange={this.cmbLocation_onChange}
                    value={this.state.cmbLocationValue}
                    className="fontStyle"
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
                    className="fontStyle"
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
                    className="fontStyle"
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
                    className="fontStyle"
                  />
                </Col>
                {this.state.stateDisable_btnAdd && (
                  this.props.answerId == null && (
                    <Col xs="auto">
                      <Button
                        icon={StartIcon}
                        text="شروع بازرسی"
                        type="default"
                        stylingMode="contained"
                        rtlEnabled={true}
                        onClick={this.btnAdd_onClick}
                        className="fontStyle"
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
                {this.state.stateDisable_btnDelete && !this.state.confirm == 1 && (
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
                {this.state.stateDisable_btnDelete && this.state.confirm == 1 && this.state.stateDisable_confirmUpdate == true && (
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
                    <Editing mode="cell" allowUpdating={true} />
                    <FilterRow visible={true} />
                    <FilterPanel visible={true} />
                  </DataGrid>
                </Col>
              </Row>
              {this.state.stateDisable_btnConfirm && this.state.confirm != 1 && (
                <Row>
                  <Col xs="auto" className="standardMarginRight">
                    <Button
                      icon={UpdateIcon}
                      text="ثبت نهایی"
                      type="success"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnConfirm_onClick}
                      className="fontStyle"
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
