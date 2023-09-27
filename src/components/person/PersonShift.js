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
import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  DataGridDefaultHeight,
  ToastTime,
  ToastWidth,
} from "../../config/config";
import { DataGridPersonColumns } from "./PersonShift-config";
import { locationByUserId } from "../../redux/reducers/location/location-actions";
import {
  updatePerson,
  addPerson,
  searchPersonByUserId,
  searchPersonByLocationId,
  deletePerson,
  shiftList,
  addShift,
  deleteShift,
} from "../../redux/reducers/person/person-actions";
import { Person } from "../../components/person/Person"
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
import { Toast } from "devextreme-react/toast";

class PersonShift extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      locale: "fa-IR",
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_updateGrid();
  }
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
        }
      }
  };

  commitChanges = ({ added, changed, deleted }) => {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        if (this.state.RowSelected == null) {
          alert("لطفا شخص را انتخاب نمایید")
          return;
        }
        if (this.state.title == null) {
          alert("لطفا شیفت را انتخاب نمایید")
        }
        else {
          const startingAddedId = data.id; //data.length > 0 ? data[data.length - 1].id + 1 : 0;
          data = [...data, {
            id: startingAddedId,
            title: this.state.title,
            startDate: this.state.startDate,
            endDate: this.state.endDate
          }];
          //data = [...data, { id: startingAddedId, ...added }];
          var object = {
            personId: this.state.RowSelected.id,
            shift: this.state.title == "شیفت صبح" ? 1 : 2,
            Date: this.state.endDate,
          }
          addShift(object, this.props.User.token)
        }
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
        deleteShift(deleted, this.props.User.token);
      }
      return { data };


    });
  }

  handleChange = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    this.setState({
      startDate: appointmentData.startDate,
      endDate: appointmentData.endDate
    })
    return (
      <div style={{ padding: "10px" }}>
        <label>شیفت را از لیست انتخاب نمایید</label>
        <select style={{ marginRight: "20px", width: "400px", marginTop: "40px", height: "40px" }} onChange={(e) => { this.handleChange(e) }}>
          <option>انتخاب شیفت...</option>
          <option>شیفت صبح</option>
          <option>شیفت بعدازظهر</option>
        </select>

      </div>
    )
  };

  grdPerson_onClickRow = async (e) => {
    var shifts = await shiftList(e.data.id, this.props.User.token)
    this.setState({
      data: shifts,
      stateUpdateDelete: true,
      RowSelected: e.data,
    });
  }

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show) {
      var person = await searchPersonByUserId(this.props.User.userId, this.props.User.token);
      if (person != null)
        this.setState({
          PersonGridData: await searchPersonByLocationId(person.locationId, person.positionId, this.props.User.token),
        });
    }
  }

  render() {
    const { data } = this.state;

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
              <Paper>
                <Scheduler
                  data={data}
                  locale={this.state.locale}
                >
                  <ViewState
                    defaultCurrentDate={new Date()}
                  />
                  <MonthView />
                  {/* <WeekView startDayHour={9} endDayHour={19} /> */}
                  <Toolbar />
                  <DateNavigator />
                  <EditingState
                    onCommitChanges={this.commitChanges}
                  />
                  <IntegratedEditing />
                  {/* <DayView
                         startDayHour={9}
                         endDayHour={19}
                     />  */}
                  <ConfirmationDialog />
                  <TodayButton />
                  <Appointments />
                  <AppointmentTooltip
                    showCloseButton
                    //showOpenButton
                    showDeleteButton
                  />
                  <AppointmentForm
                    //readOnly={this.isNormalUser}
                    basicLayoutComponent={this.BasicLayout}
                  //booleanEditorComponent={this.BoolEditor}
                  //labelComponent={this.LabelComponent}
                  //textEditorComponent={this.InputComponent}               
                  />
                </Scheduler>
              </Paper>
            </Col>
            <Col xs={5}>
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