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
import { locale } from "devextreme/localization";
import classnames from "classnames";
import TextBox from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import AdapterJalali from "@date-io/date-fns-jalali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import { userLocationList } from "../../redux/reducers/user/user-actions";
import { positionList } from "../../redux/reducers/position/position-actions";
import { CheckBox } from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";
import {
  positionApproveOrderTime,
  addPositionApproveOrderTime,
} from "../../redux/reducers/positionApproveOrderTime/positionApproveOrderTime-actions";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  ToastTime,
  ToastWidth,
  ALL_MOD,
  CHECK_BOXES_MOD,
} from "../../config/config";
import { Tooltip } from "devextreme-react/tooltip";
import {
  Gfn_BuildValueComboMulti,
  Gfn_ConvertComboForAll,
  Gfn_BuildValueComboSelectAll,
  Gfn_ExportToExcel,
  Gfn_DT2StringSql,
} from "../../utiliy/GlobalMethods";

import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

class RegisterOrderTime extends React.Component {
  constructor(props) {
    super(props);
    locale(navigator.language);
    this.state = {
      LocationList: null,
      LocationId: null,
      PositionList: null,
      PositionId: null,
      StartDate: new Date(),
      EndDate: new Date(),
      StartTime: null,
      EndTime: null,
      PositionApproveOrderTime: null,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      FromDate: new Date(),
      ToDate: new Date(),
      FromDateapi: "",
      ToDateapi: "",
      stateDisable_btnAdd: true,
    };
  }
  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    this.fn_locationList();
    this.fn_positionList();
  }

  fn_locationList = async () => {
    this.setState({
      LocationList: await userLocationList(
        this.props.User.userId,
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  fn_positionList = async () => {
    this.setState({
      PositionList: await positionList(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "registerOrderTime.insert":
            this.setState({ stateDisable_btnAdd: true });
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

  cmbLocation_onChange = (e) => {
    this.setState({ LocationId: e });
  };

  cmbPosition_onChange = (e) => {
    this.setState({ PositionId: e });
  };

  btnShow_onClick = async () => {
    var result = await positionApproveOrderTime(
      this.state.LocationId,
      this.state.PositionId,
      this.props.User.token
    );
    if (result != null) {
      this.setState({
        FromDate: result.startDate,
        ToDate: result.endDate,
      });
    } else {
      this.setState({
        FromDate: null,
        ToDate: null,
      });
    }
  };

  fn_CheckValidation = () => {
    let errMsg = "";
    let flag = true;
    document.getElementById("errLocation").innerHTML = "";
    document.getElementById("errPosition").innerHTML = "";
    document.getElementById("errStartDate").innerHTML = "";
    document.getElementById("errEndDate").innerHTML = "";
    if (this.state.LocationId == null) {
      document.getElementById("errLocation").innerHTML =
        "نام فروشگاه را انتخاب نمائید";
      flag = false;
    }
    if (this.state.PositionId == null) {
      document.getElementById("errPosition").innerHTML =
        "سمت را انتخاب نمایید";
      flag = false;
    }

    if (this.state.FromDate == null) {
      document.getElementById("errStartDate").innerHTML =
        "از تاریخ را وارد نمایید";
      flag = false;
    }

    if (this.state.ToDate == null) {
      document.getElementById("errEndDate").innerHTML =
        "تا تاریخ را وارد  نمایید";
      flag = false;
    }
    return flag;
  };

  btnAdd_onClick = async () =>  {
    if (await this.fn_CheckValidation()) {
      const data = {
        locationId: this.state.LocationId,
        positionId: this.state.PositionId,
        startDate: this.addHours(new Date(this.state.FromDate), 3, 30),
        endDate:  this.addHours(new Date(this.state.ToDate), 3, 30),
      };
      const RESULT = await addPositionApproveOrderTime(
        data,
        this.props.User.token
      );
      this.setState({
        ToastProps: {
          isToastVisible: true,
          Message: RESULT != null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت",
          Type: RESULT != null ? "success" : "error",
        },
      });
    }
  };

   addHours=(date, hours, minutes)=> {
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  DatePickerFrom_onChange = (params) => {
    this.setState({ FromDate: params});
  };

  DatePickerTo_onChange = (params) => {
    this.setState({ ToDate: params });
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
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
              <Label>زمانبندی فروشگاه</Label>
            </Row>
            <Row className="standardPadding">
              <Col xs="auto">
                <Label className="standardLabelFont">نام فروشگاه</Label>
                <SelectBox
                  dataSource={this.state.LocationList}
                  displayExpr="label"
                  placeholder="نام فروشگاه"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbLocation_onChange}
                  value={this.state.LocationId}
                />
                <Row>
                  <Label
                    id="errLocation"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <Label className="standardLabelFont">نام سمت</Label>
                <SelectBox
                  dataSource={this.state.PositionList}
                  displayExpr="positionName"
                  placeholder="نام سمت"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbPosition_onChange}
                  value={this.state.PositionId}
                />
                <Row>
                  <Label
                    id="errPosition"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
            </Row>

            <Row className="standardSpaceTop">
              <Col xs="auto">
                <Button
                  text="مشاهده"
                  type="success"
                  stylingMode="contained"
                  rtlEnabled={true}
                  onClick={this.btnShow_onClick}
                />
              </Col>
            </Row>
            <Row className="standardSpaceTop">
              <Col xs="auto">
                <LocalizationProvider dateAdapter={AdapterJalali}>
                  <DateTimePicker
                    label="از تاریخ"
                    value={this.state.FromDate}
                    onChange={this.DatePickerFrom_onChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <Row>
                  <Label
                    id="errStartDate"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
              <Col xs="auto">
                <LocalizationProvider dateAdapter={AdapterJalali}>
                  <DateTimePicker
                    label="تا تاریخ"
                    value={this.state.ToDate}
                    onChange={this.DatePickerTo_onChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <Row>
                  <Label
                    id="errEndDate"
                    className="standardLabelFont errMessage"
                  />
                </Row>
              </Col>
            </Row>

            <Row className="standardSpaceTop">
              <Row>
                {this.state.stateDisable_btnAdd && (
                  <>
                    <Col xs="auto">
                      <Button
                        icon={UpdateIcon}
                        text="ذخیره تغییرات"
                        type="success"
                        stylingMode="contained"
                        rtlEnabled={true}
                        onClick={this.btnAdd_onClick}
                      />
                    </Col>
                  </>
                )}
              </Row>
            </Row>
            <Row>
              <Col>
                <p
                  id="ErrorUpdateOrderTime"
                  style={{ textAlign: "right", color: "red" }}
                ></p>
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

export default connect(mapStateToProps)(RegisterOrderTime);
