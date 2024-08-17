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
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../redux/reducers/question/question-actions";
import { questionTypeList } from "../../redux/reducers/question/questionType-actions";
import { DataGridQuestionColumns } from "./Question-config";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import { unitList } from "../../redux/reducers/unit/unit-actions";
import { zoneList } from "../../redux/reducers/zone/zone-actions";

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txtQuestionValue: null,
      txtPriorityValue: null,
      cmbZoneValue: null,
      cmbZone: null,
      txtScoreValue: null,
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
      cmbUnitValue: null,
      cmbUnit: null,
      chkIsActive: null,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    await this.fn_questionTypeList();
    await this.fn_unitList();
    await this.fn_zoneList();
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
          case "question.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "question.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "question.delete":
            this.setState({ stateDisable_btnDelete: true });
            break;
          case "question.show":
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
  };

  fn_questionTypeList = async () => {
    this.setState({
      cmbQuestionType: await questionTypeList(
        this.props.User.userId,
        this.props.User.token
      ),
    });
  };

  fn_unitList = async () => {
    this.setState({
      cmbUnit: await unitList(this.props.User.token),
    });
  };

  fn_zoneList = async () => {
    this.setState({
      cmbZone: await zoneList(this.props.User.token),
    });
  };

  grdQuestion_onClickRow = (e) => {
    this.setState({
      txtPriorityValue: e.data.priority,
      cmbZoneValue: e.data.zoneId,
      txtScoreValue: e.data.weight,
      cmbQuestionTypeValue: e.data.questionTypeId,
      cmbUnitValue: e.data.unitId,
      txtQuestionValue: e.data.question,
      stateUpdateDelete: true,
      RowSelected: e.data,
      chkIsActive: e.data.isActive,
    });
  };

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
  cmbUnit_onChange = (e) => {
    this.setState({
      cmbUnitValue: e,
    });
  };

  cmbZone_onChange = (e) => {
    this.setState({
      cmbZoneValue: e,
    });
  };

  cmbQuestionType_onChange = (e) => {
    this.setState({
      cmbQuestionTypeValue: e,
    });
    this.fn_updateGrid(e);
  };

  chkIsActive_onChange = (e) => {
    this.setState({
      chkIsActive: e.value,
    });
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errPriority").innerHTML = "";
    document.getElementById("errZone").innerHTML = "";
    document.getElementById("errScore").innerHTML = "";
    document.getElementById("errQuestionType").innerHTML = "";
    document.getElementById("errUnit").innerHTML = "";
    document.getElementById("errQuestion").innerHTML = "";
    if (this.state.txtPriorityValue == null) {
      document.getElementById("errPriority").innerHTML =
        "اولویت را وارد نمائید";
      flag = false;
    }
    if (this.state.cmbZoneValue == null) {
      document.getElementById("errZone").innerHTML = "حوزه را انتخاب نمائید";
      flag = false;
    }
    if (this.state.txtScoreValue == null) {
      document.getElementById("errScore").innerHTML = "نمره را وارد نمایید";
      flag = false;
    }
    if (this.state.cmbQuestionTypeValue == null) {
      document.getElementById("errQuestionType").innerHTML =
        "نوع سوال را انتخاب نمایید";
      flag = false;
    }
    if (this.state.cmbUnitValue == null) {
      document.getElementById("errUnit").innerHTML = "مسول را انتخاب نمایید";
      flag = false;
    }
    if (this.state.txtQuestionValue == null) {
      document.getElementById("errQuestion").innerHTML = "سوال را وارد نمایید";
      flag = false;
    }

    if (this.state.chkIsActive == null) {
      document.getElementById("errIsActive").innerHTML =
        "فعال بودن را مشخص نمائید";
      flag = false;
    }
    return flag;
  };
  btnAdd_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        question: this.state.txtQuestionValue,
        priority: this.state.txtPriorityValue,
        zoneId: this.state.cmbZoneValue,
        score: this.state.txtScoreValue,
        questionTypeId: this.state.cmbQuestionTypeValue,
        unitId: this.state.cmbUnitValue,
        isActive: this.state.chkIsActive,
      };
      const RESULT = await addQuestion(data, this.props.User.token);
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت",
          Type: RESULT != null ? "success" : "error",
        },
      });
      this.fn_updateGrid(this.state.cmbQuestionTypeValue);
    }
  };
  txtQuestion_onChange = (e) => {
    this.setState({ txtQuestionValue: e.value });
  };
  txtScore_onChange = (e) => {
    this.setState({ txtScoreValue: e.value });
  };

  txtPriority_onChange = (e) => {
    this.setState({ txtPriorityValue: e.value });
  };

  btnUpdate_onClick = async () => {
    if (await this.fn_CheckValidation()) {
      const data = {
        id: this.state.RowSelected.id,
        question: this.state.txtQuestionValue,
        priority: this.state.txtPriorityValue,
        zoneId: this.state.cmbZoneValue,
        score: this.state.txtScoreValue,
        questionTypeId: this.state.cmbQuestionTypeValue,
        unitId: this.state.cmbUnitValue,
        isActive: this.state.chkIsActive,
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

  btnDelete_onClick = async () => {
    const MSG = await deleteQuestion(
      this.state.RowSelected.id,
      this.props.User.token
    );
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: MSG,
        Type: "success",
      },
    });
    this.fn_updateGrid(this.state.cmbQuestionTypeValue);
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
          className="fontStyle"
        />
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label>سوالات</Label>
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
                    className="fontStyle"
                  />
                </Col>
              </Row>
            )}
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
                />
                <Row>
                  <Label
                    id="errQuestionType"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">اولویت</Label>
                <TextBox
                  value={this.state.txtPriorityValue}
                  showClearButton={true}
                  placeholder="اولویت"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtPriority_onChange}
                  mode="number"
                  className="fontStyle"
                />
                <Row>
                  <Label
                    id="errPriority"
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
                  className="fontStyle"
                />
                <Row>
                  <Label
                    id="errZone"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">وزن</Label>
                <TextBox
                  value={this.state.txtScoreValue}
                  showClearButton={true}
                  placeholder="وزن"
                  rtlEnabled={true}
                  valueChangeEvent="keyup"
                  onValueChanged={this.txtScore_onChange}
                  mode="number"
                  className="fontStyle"
                />
                <Row>
                  <Label
                    id="errScore"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">مسئول</Label>
                <SelectBox
                  dataSource={this.state.cmbUnit}
                  displayExpr="name"
                  placeholder="مسئول"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbUnit_onChange}
                  value={this.state.cmbUnitValue}
                  className="fontStyle"
                />
                <Row>
                  <Label
                    id="errUnit"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Row>
                <Col xs={9}>
                  <Label className="standardLabelFont">سوال</Label>
                  <TextArea
                    value={this.state.txtQuestionValue}
                    showClearButton={true}
                    placeholder="سوال"
                    rtlEnabled={true}
                    valueChangeEvent="keyup"
                    onValueChanged={this.txtQuestion_onChange}
                    height={120}
                    className="fontStyle"
                  />
                  <Row>
                    <Label
                      id="errQuestion"
                      className="standardLabelFont errMessage"
                    />
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col xs="auto">
                  <CheckBox
                    value={this.state.chkIsActive}
                    text="فعال"
                    rtlEnabled={true}
                    onValueChanged={this.chkIsActive_onChange}
                    className="fontStyle"
                  />
                  <Row>
                    <Label
                      id="errIsActive"
                      className="standardLabelFont errMessage"
                    />
                  </Row>
                </Col>
              </Row>
            </Row>

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
                      className="fontStyle"
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
                </Row>
              </Row>
            )}
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
              <Label className="title">
                لیست سوالات{" "}
                {this.state.cmbQuestionTypeValue != null &&
                  this.state.cmbQuestionType.map((p) =>
                    p.id == this.state.cmbQuestionTypeValue ? p.name : ""
                  )}
              </Label>
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
    );
  }
}
const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(Question);
