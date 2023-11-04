import * as React from 'react';
import { connect } from "react-redux";
import Paper from '@mui/material/Paper';
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  AppointmentForm,
  AppointmentTooltip,
  WeekView,
  ConfirmationDialog
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
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
import SelectBox from 'devextreme-react/select-box';
import { Button } from 'devextreme-react/button';
import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  DataGridDefaultHeight,
  ToastTime,
  ToastWidth,
} from "../../config/config";
import { DataGridPersonColumns } from "./PersonShift-config";
import { locationByUserId, locationList } from "../../redux/reducers/location/location-actions";
import {
  updatePerson,
  addPerson,
  searchPersonByUserId,
  searchPersonByLocationId,
  deletePerson,
  personShiftList,
  addPersonShift,
  deletePersonShift,
} from "../../redux/reducers/person/person-actions";
import { Person } from "../../components/person/Person"
import { userLocationList, userLocationListCombo } from "../../redux/reducers/user/user-actions";
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
import { locale } from 'devextreme/localization';
import { TextBox } from 'devextreme-react';
import companySlice, {
  companyActions,
} from "../../redux/reducers/company/company-slice";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { Toast } from "devextreme-react/toast";
import { Backdrop, Hidden } from '@mui/material';
import { Margin } from 'devextreme-react/bullet';
import SaveIcon from "../../assets/images/icon/save.png";
import Calendar from './Calendar';
import TestProps from './test';
const data = [];
class PersonShift extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      locale: "fa-IR",
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      RowSelected: null,
      stateShowCalendar: false,
      stateDisable_show: false,
      PersonId: null,
      PersonName: null,
      cmbLocation: null,
      cmbLocationValue: null,
      stateDisable_showLocation: false,
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    await this.fn_locationList();
    this.fn_updateGrid(0);
  }

  // componentDidUpdate() {
  //   if (this.state.stateShowCalendar == true) {
  //     this.setState({
  //       stateShowCalendar: false
  //     })
  //   }
  // }
  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "personShift.update":
            this.setState({ stateDisable_btnUpdate: true });
            break;
          case "personShift.insert":
            this.setState({ stateDisable_btnAdd: true });
            break;
          case "personShift.show":
            this.setState({ stateDisable_show: true });
            break;
          case "personShift.show_location":
            this.setState({ stateDisable_showLocation: true });
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

  fn_locationList = async () => {
    this.setState({
      cmbLocation: await userLocationList(
        this.props.User.userId,
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  handelClick = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  grdPerson_onClickRow = async (e) => {
    this.setState({
      stateShowCalendar: true,
      RowSelected: e.data,
      PersonId: e.data.id,
      PersonName: e.data.fullName
    });
  }

  fn_updateGrid = async (permission) => {
    if (this.state.stateDisable_show) {
      var person = await searchPersonByUserId(this.props.User.userId, this.props.User.token);
      if (person != null)
        this.setState({
          PersonGridData: await searchPersonByLocationId(this.state.cmbLocationValue == null ? person.locationId : this.state.cmbLocationValue, person.positionId, permission == 0 ? 0 : 1, this.props.User.token),
        });
    }
  }

  cmbLocation_onChange = (e) => {
    this.setState({
      cmbLocationValue: e,
      PersonId:null
    })
    this.fn_updateGrid(1);
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
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Col width={6}>
              {this.state.PersonId != null && <Calendar personId={this.state.PersonId} personName={this.state.PersonName} />}
              {/* <TestProps p1={this.state.PersonId} />                */}
            </Col>
            <Col xs={5}>
              {this.state.stateDisable_showLocation &&
                <>
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
                  />
                </>
              }
              <br />
              <Row>
                <Label className="title">لیست اشخاص</Label>
              </Row>
              <Row>
                <Col xs="auto" className="standardMarginRight">
                  <DataGrid
                    dataSource={this.state.PersonGridData}
                    defaultColumns={DataGridPersonColumns}
                    showBorders={true}
                    rtlEnabled={true}
                    allowColumnResizing={true}
                    onRowClick={this.grdPerson_onClickRow}
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
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Position: state.positions,
  Location: state.locations,
  Company: state.companies,
});

export default connect(mapStateToProps)(PersonShift);