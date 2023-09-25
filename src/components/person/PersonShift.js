import * as React from 'react';
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
import { Toast } from "devextreme-react/toast";
import Paper from '@mui/material/Paper';
import {
  styled, darken, alpha, lighten,
} from '@mui/material/styles';
import Opacity from '@mui/icons-material/Opacity';
import WbSunny from '@mui/icons-material/WbSunny';
import FilterDrama from '@mui/icons-material/FilterDrama';
import TableCell from '@mui/material/TableCell';
import ColorLens from '@mui/icons-material/ColorLens';
import Typography from '@mui/material/Typography';
import classNames from 'clsx';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog,
  WeekView,
  MonthView,
  DateNavigator,
  Toolbar
} from '@devexpress/dx-react-scheduler-material-ui';
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
//import { appointments } from '../../../demo-data/appointments';
var appointments = [
  {
    id: 1,
    title: "تست برنامه",
    startDate: "2023-09-19T15:24",
    endDate: "2023-09-19T15:25",
    allDay: true
  },
]
const PREFIX = 'Demo';

const classes = {
  cell: `${PREFIX}-cell`,
  content: `${PREFIX}-content`,
  text: `${PREFIX}-text`,
  sun: `${PREFIX}-sun`,
  cloud: `${PREFIX}-cloud`,
  rain: `${PREFIX}-rain`,
  sunBack: `${PREFIX}-sunBack`,
  cloudBack: `${PREFIX}-cloudBack`,
  rainBack: `${PREFIX}-rainBack`,
  opacity: `${PREFIX}-opacity`,
  appointment: `${PREFIX}-appointment`,
  apptContent: `${PREFIX}-apptContent`,
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  flexContainer: `${PREFIX}-flexContainer`,
  tooltipContent: `${PREFIX}-tooltipContent`,
  tooltipText: `${PREFIX}-tooltipText`,
  title: `${PREFIX}-title`,
  icon: `${PREFIX}-icon`,
  circle: `${PREFIX}-circle`,
  textCenter: `${PREFIX}-textCenter`,
  dateAndTitle: `${PREFIX}-dateAndTitle`,
  titleContainer: `${PREFIX}-titleContainer`,
  container: `${PREFIX}-container`,
};

const getBorder = theme => (`1px solid ${theme.palette.mode === 'light'
    ? lighten(alpha(theme.palette.divider, 1), 0.88)
    : darken(alpha(theme.palette.divider, 1), 0.68)
  }`);

const DayScaleCell = props => (
  <MonthView.DayScaleCell {...props} style={{ textAlign: 'center', fontWeight: 'bold' }} />
);

const StyledOpacity = styled(Opacity)(() => ({
  [`&.${classes.rain}`]: {
    color: '#4FC3F7',
  },
}));
const StyledWbSunny = styled(WbSunny)(() => ({
  [`&.${classes.sun}`]: {
    color: '#FFEE58',
  },
}));
const StyledFilterDrama = styled(FilterDrama)(() => ({
  [`&.${classes.cloud}`]: {
    color: '#90A4AE',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${classes.cell}`]: {
    color: '#78909C!important',
    position: 'relative',
    userSelect: 'none',
    verticalAlign: 'top',
    padding: 0,
    height: 100,
    borderLeft: getBorder(theme),
    '&:first-of-type': {
      borderLeft: 'none',
    },
    '&:last-child': {
      paddingRight: 0,
    },
    'tr:last-child &': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: 'white',
    },
    '&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
      outline: 0,
    },
  },
  [`&.${classes.sunBack}`]: {
    backgroundColor: '#FFFDE7',
  },
  [`&.${classes.cloudBack}`]: {
    backgroundColor: '#ECEFF1',
  },
  [`&.${classes.rainBack}`]: {
    backgroundColor: '#E1F5FE',
  },
  [`&.${classes.opacity}`]: {
    opacity: '0.5',
  },
}));
const StyledDivText = styled('div')(() => ({
  [`&.${classes.text}`]: {
    padding: '0.5em',
    textAlign: 'center',
  },
}));
const StyledDivContent = styled('div')(() => ({
  [`&.${classes.content}`]: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
}));

const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
  [`&.${classes.appointment}`]: {
    borderRadius: '10px',
    '&:hover': {
      opacity: 0.6,
    },
  },
}));

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    flex: 'none',
  },
  [`& .${classes.flexContainer}`]: {
    display: 'flex',
    alignItems: 'center',
  },
}));
const StyledAppointmentsAppointmentContent = styled(Appointments.AppointmentContent)(() => ({
  [`&.${classes.apptContent}`]: {
    '&>div>div': {
      whiteSpace: 'normal !important',
      lineHeight: 1.2,
    },
  },
}));



// const resources = [{
//   fieldName: 'ownerId',
//   title: 'Owners',
//   instances: owners,
// }];

const WeatherIcon = ({ id }) => {
  switch (id) {
    case 0:
      return <StyledOpacity className={classes.rain} fontSize="large" />;
    case 1:
      return <StyledWbSunny className={classes.sun} fontSize="large" />;
    case 2:
      return <StyledFilterDrama className={classes.cloud} fontSize="large" />;
    default:
      return null;
  }
};

const CellBase = React.memo(({
  startDate,
  formatDate,
  otherMonth,
}) => {
  const iconId = Math.abs(Math.floor(Math.sin(startDate.getDate()) * 10) % 3);
  const isFirstMonthDay = startDate.getDate() === 1;
  const formatOptions = isFirstMonthDay
    ? { day: 'numeric', month: 'long' }
    : { day: 'numeric' };
  return (
    <StyledTableCell
      tabIndex={0}
      className={classNames({
        [classes.cell]: true,
        [classes.rainBack]: iconId === 0,
        [classes.sunBack]: iconId === 1,
        [classes.cloudBack]: iconId === 2,
        [classes.opacity]: otherMonth,
      })}
    >
      <StyledDivContent className={classes.content}>
        <WeatherIcon classes={classes} id={iconId} />
      </StyledDivContent>
      <StyledDivText className={classes.text}>
        {formatDate(startDate, formatOptions)}
      </StyledDivText>
    </StyledTableCell>
  );
});

const TimeTableCell = (CellBase);

const Appointment = (({ ...restProps }) => (
  <StyledAppointmentsAppointment
    {...restProps}
    className={classes.appointment}
  />
));

const AppointmentContent = (({ ...restProps }) => (
  <StyledAppointmentsAppointmentContent {...restProps} className={classes.apptContent} />
));

const FlexibleSpace = (({ ...restProps }) => (
  <StyledToolbarFlexibleSpace {...restProps} className={classes.flexibleSpace}>
    {/* <div className={classes.flexContainer}>
        <ColorLens fontSize="large" htmlColor="#FF7043" /> 
        <Typography variant="h5" style={{ marginLeft: '10px' }}>Art School</Typography> 
     </div> */}
  </StyledToolbarFlexibleSpace>
));

class PersonShift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: appointments,
      currentDate: new Date(),
      locale: "fa-IR",
      stateDisable_show: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
      title: null,
      startDate: new Date(),
      endDate: new Date()
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

  fn_updateGrid = async () => {
    if (this.state.stateDisable_show) {
      var person = await searchPersonByUserId(this.props.User.userId, this.props.User.token);
      if (person != null)
        this.setState({
          PersonGridData: await searchPersonByLocationId(person.locationId, person.positionId, this.props.User.token),
        });
    }
  }



  commitChanges = ({ added, changed, deleted }) => {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, {
          id: startingAddedId,
          title: this.state.title,
          startDate: this.state.startDate,
          endDate: this.state.endDate
        }];
        //data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };

    });
  }

  BoolEditor = (props) => {
    return <AppointmentForm.BooleanEditor
      {...props}
    />
  };
  LabelComponent = (props) => {
    if (props.text === 'Details') {
      return <AppointmentForm.Label
        {...props}
        text="جزییات"
      />
    } else if (props.text === 'More Information') {
      return <AppointmentForm.Label
        {...props}
        text="توضیحات"
      />
    } else if (props.text === '-') {
      return <AppointmentForm.Label
        {...props}
      />
    }
  };
  InputComponent = (props) => {
    if (props.type === 'titleTextEditor') {
      return <AppointmentForm.TextEditor
        {...props}
        type='numberEditor'
        placeholder='عنوان'
      />
    }
  };
  handleChange = (e) => {
    this.setState({
      title: e.target.value
    })
  }
  // cambio el layout
  BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    this.setState({
      startDate: appointmentData.startDate,
      endDate: appointmentData.endDate
    })
    return (
      <textarea onChange={(e) => { this.handleChange(e) }} placeholder='توضیحات' style={{ marginRight: "20px", width: "400px" }} />
    )
  };



  render() {
    const { currentDate, data } = this.state;

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
                  height={630}
                  locale={this.state.locale}

                >
                  <ViewState
                    currentDate={currentDate}
                  />

                  {/* <WeekView startDayHour={9} endDayHour={19} />  */}
                  <MonthView
                    dayScaleCellComponent={DayScaleCell}
                  />
                  <EditingState
                    onCommitChanges={this.commitChanges}
                  />
                  <IntegratedEditing />
                  {/* <DayView
                        startDayHour={9}
                        endDayHour={19}
                    /> */}
                  <Toolbar
                    flexibleSpaceComponent={FlexibleSpace}
                  />
                  <DateNavigator />
                  <ConfirmationDialog />
                  <Appointments
                    appointmentComponent={Appointment}
                    appointmentContentComponent={AppointmentContent} />
                  <AppointmentTooltip
                    showCloseButton
                    //showOpenButton
                    showDeleteButton
                  />
                  <AppointmentForm
                    // readOnly={this.isNormalUser}
                    basicLayoutComponent={this.BasicLayout}
                  // booleanEditorComponent={this.BoolEditor}
                  //  labelComponent={this.LabelComponent}
                  //  textEditorComponent={this.InputComponent}               
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
