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
import { locationByUserId } from "../../redux/reducers/location/location-actions";
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
import { Backdrop, Hidden } from '@mui/material';
import { Margin } from 'devextreme-react/bullet';
import SaveIcon from "../../assets/images/icon/save.png";
var data = [];
var today = new Date().toLocaleDateString('fa-IR-u-nu-latn');
var year = today.split("/")[0];
var month = today.split("/")[1];
var day = today.split("/")[2];
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
            Date: null,
            Shift: null,
            RowSelected: null,
            stateModalShift: false,
            ShiftList: [{ id: 1, title: "شیفت صبح" }, {
                id: 2, title: "شیفت عصر"
            }],
            ShiftId: null,
            dd: false
        };
    }

    async componentDidMount() {
        await this.loadData();
    }

    loadData = async () => {
        data = await personShiftList(this.props.personId, year, month, this.props.User.token);
        if (data[0].day == "يکشنبه") {
            data = [{ "day": "شنبه", dayOfMonth: "" }, ...data]
        }
        else if (data[0].day == "دوشنبه") {
            data = [{ "day": "یکشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "شنبه", dayOfMonth: "" }, ...data];
        }
        else if (data[0].day == "سه‌شنبه") {
            data = [{ "day": "دوشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "یکشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "شنبه", dayOfMonth: "" }, ...data];
        }
        else if (data[0].day == "چهارشنبه") {
            data = [{ "day": "سه شنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "دوشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "یکشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "شنبه", dayOfMonth: "" }, ...data];
        }
        else if (data[0].day == "پنجشنبه") {
            data = [{ "day": "چهارشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "سه شنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "دوشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "یکشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "شنبه", dayOfMonth: "" }, ...data];
        }
        else if (data[0].day == "جمعه") {
            data = [{ "day": "پنج شنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "چهارشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "سه شنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "دوشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "یکشنبه", dayOfMonth: "" }, ...data];
            data = [{ "day": "شنبه", dayOfMonth: "" }, ...data];
        }
        this.setState({
            dd: true
        })
    }

    handleCalendar_onclick = (e) => {
        this.setState({
            stateModalShift: true,
            Date: e.currentTarget.getAttribute('date'),
            ShiftId: e.currentTarget.getAttribute('shiftId')
        })
    }

    ModalShift_onClickAway = () => {
        this.setState({ stateModalShift: false })
    }

    cmbShift_onChange = (e) => {
        this.setState({
            Shift: e
        })
    }

    btnAdd_onClick = async () => {
        if (this.props.personId == null) {
            alert("لطفا شخص را انتخاب نمایید")
            return;
        }
        if (this.state.Shift == null) {
            alert("لطفا شیفت را انتخاب نمایید")
            return
        }
        var object = {
            personId: this.props.personId,
            shift: this.state.Shift,
            Date: this.state.Date,
        }
        await addPersonShift(object, this.props.User.token)
        await this.loadData();
        this.setState({
            stateModalShift: false,
        })
    }

    btnDelete_onClick = async () => {
        await deletePersonShift(this.state.ShiftId, this.props.User.token)
        await this.loadData();
        this.setState({
            stateModalShift: false,
        })
    }
    nextMonth_onClick = async (e) => {
        month = parseInt(month) + 1;
        if (month > 12)
            month = 12
        await this.loadData();
        if (this.state.dd == true)
            this.setState({
                dd: false,
            })
        else
            this.setState({
                dd: true
            })
    }
    previousMonth_onClick = async (e) => {
        month = parseInt(month) - 1;
        if (month < 1)
            month = 1;
        await this.loadData();
        if (this.state.dd == true)
            this.setState({
                dd: false,
            })
        else
            this.setState({
                dd: true
            })
    }
    render() {
        var backgroundColor;
        return (
            <>
                <div style={{ marginRight: "10px" }}><i onClick={(event) => this.nextMonth_onClick(event)} style={{ marginLeft: "60px", cursor: "pointer" }} title="ماه بعدی">&#60;</i>{month + " - " + year}<i onClick={(event) => this.previousMonth_onClick(event)} style={{ marginRight: "60px", cursor: "pointer" }} title='ماه قبلی'>&#62;</i></div>
                {
                    data.map((element, index) => {
                        index++;
                        if (day == element.dayOfMonth && month==today.split('/')[1])
                            backgroundColor = "lightgreen"
                        else if(element.dayOfMonth == "")
                            backgroundColor = ""
                        else
                            backgroundColor="lightblue"
                        if (element.dayOfMonth == "") {
                            return <i style={{ backgroundColor: backgroundColor, margin: "5px", width: "100px", height: "100px", maxWidth: "100px", maxHeight: "100px", display: "inline-block", overflow: "Hidden", textAlign: "center" }} >
                                {element.day}
                            </i>
                        }
                        if (index % 7 == 0)
                            return <>
                                <i id={element.id} shiftId={element.shiftId} date={element.date} style={{ backgroundColor: backgroundColor, margin: "5px", width: "100px", height: "100px", maxWidth: "100px", maxHeight: "100px", display: "inline-block", textAlign: "center", overflow: "Hidden" }} onClick={(event) => this.handleCalendar_onclick(event)}>
                                    <p>{element.day}</p><p>{element.dayOfMonth}</p>
                                    <p style={{ color: "red", fontSize: "14px", fontWeight: "600" }}>{element.title == 1 && "شیفت صبح"}{element.title == 2 && "شیفت عصر"}</p>
                                </i>
                                <br />
                            </>
                        if (index < 7)
                            return <i id={element.id} shiftId={element.shiftId} date={element.date} style={{ backgroundColor: backgroundColor, margin: "5px", width: "100px", height: "100px", maxWidth: "100px", maxHeight: "100px", display: "inline-block", textAlign: "center", overflow: "Hidden" }} onClick={(event) => this.handleCalendar_onclick(event)}>
                                <p>{element.day}</p>
                                <p style={{ color: "#fff", fontWeight: "700" }}>{element.dayOfMonth}</p>
                                <p style={{ color: "red", fontSize: "14px", fontWeight: "600" }}>{element.title == 1 && "شیفت صبح"}{element.title == 2 && "شیفت عصر"}</p>
                            </i>
                        else
                            return <i id={element.id} shiftId={element.shiftId} date={element.date} style={{ backgroundColor: backgroundColor, margin: "5px", width: "100px", height: "100px", maxWidth: "100px", maxHeight: "100px", display: "inline-block", textAlign: "center", overflow: "Hidden" }} onClick={(event) => this.handleCalendar_onclick(event)}>
                                <p style={{ marginTop: "35%", color: "#fff", fontWeight: "700" }}>{element.dayOfMonth}</p>
                                <p style={{ color: "red", fontSize: "14px", fontWeight: "600" }}>{element.title == 1 && "شیفت صبح"}{element.title == 2 && "شیفت عصر"}</p>
                            </i>
                    })
                }
                <Modal style={{ direction: 'rtl' }}
                    isOpen={this.state.stateModalShift}
                    toggle={this.ModalShift_onClickAway}
                    centered={true}
                    size="lg"
                >
                    <ModalHeader toggle={this.ModalNewTicket_onClickAway} >
                        شیفت کاری
                    </ModalHeader>
                    <ModalBody>
                        <Row className="standardPadding">
                            <Col>
                                <Label className="standardLabelFont">شیفت کاری را از لیست زیر انتخاب نمایید</Label>
                                <SelectBox
                                    dataSource={this.state.ShiftList}
                                    displayExpr="title"
                                    placeholder="انتخاب شیفت"
                                    valueExpr="id"
                                    searchEnabled={true}
                                    rtlEnabled={true}
                                    onValueChange={this.cmbShift_onChange}
                                />
                            </Col>
                        </Row>

                        <Row className="standardPadding">
                            <Col xs="auto">
                                <Button
                                    // width={120}
                                    text="ثبت"
                                    type="default"
                                    stylingMode="contained"
                                    onClick={this.btnAdd_onClick}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button
                                    // width={120}
                                    text="حذف"
                                    type="default"
                                    stylingMode="contained"
                                    onClick={this.btnDelete_onClick}
                                />
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </>
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