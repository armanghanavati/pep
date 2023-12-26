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
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { SearchUserById, updateProfile } from "../../redux/reducers/user/user-actions";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import RejectIcon from '../../assets/images/icon/reject.png'
import { AttachmentList, UploadFiles } from "../../redux/reducers/Attachments/attachment-action";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            txtNameValue: null,
            txtUserNameValue: null,
            txtPasswordValue: null,
            stateUpdateDelete: true,
            stateDisable_btnUpdate: true,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            User: null,
            AttachedFile: null,
            Attachment: null,
            AttachmentFile: null,
        };
    }
    async componentDidMount() {
        await this.fn_CheckRequireState();
        const USER = await SearchUserById(this.props.User.userId, this.props.User.token);
        const obj = {
            AttachmentId: this.props.User.userId
        }
        this.setState({
            txtNameValue: USER.fullName,
            txtUserNameValue: USER.userName,
            AttachedFile: await AttachmentList(obj, this.props.User.token)
        });
    }

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

    fn_CheckValidation = () => {
        let errMsg = "";
        let flag = true;
        document.getElementById("errName").innerHTML = "";
        document.getElementById("errUserName").innerHTML = "";
        if (this.state.txtNameValue == null) {
            document.getElementById("errName").innerHTML =
                "نام و نام خانوادگی را وارد نمائید";
            flag = false;
        }
        if (this.state.txtUserNameValue == null) {
            document.getElementById("errUserName").innerHTML =
                "نام کاربری را وارد نمایید";
            flag = false;
        }
        return flag;
    };

    txtName_onChange = (e) => {
        this.setState({ txtNameValue: e.value });
    };


    txtPassword_onChange = (e) => {
        this.setState({ txtPasswordValue: e.value });
    };

    btnUpdate_onClick = async () => {
        if (await this.fn_CheckValidation()) {
            const data = {
                userId: this.props.User.userId,
                name: this.state.txtNameValue,
                userName: this.state.txtUserNameValue,
                password: this.state.txtPasswordValue,
            };
            alert(JSON.stringify(data))
            if (this.state.AttachedFile != null) {
                const attachObj = {
                    AttachedFile: this.state.AttachedFile,
                    AttachmentId: this.props.User.userId,
                    AttachmentType: "us",
                    AttachmentName: "user"
                }
                var imageResult=await UploadFiles(attachObj, this.props.User.token);
            }
            const RESULT = await updateProfile(data, this.props.User.token);
            this.setState({
                ToastProps: {
                    isToastVisible: true,
                    Message: RESULT > 0 || imageResult != null ?  "ویرایش با موفقیت انجام گردید" : "عدم ویرایش",
                    Type: RESULT > 0 || imageResult != null ? "success" : "error",
                },
            });
        }
    };

    onHidingToast = () => {
        this.setState({ ToastProps: { isToastVisible: false } });
    };

    setFile = (e) => {
        let errMsg = "";
        if (e.target.files[0].size > 5000000)
            errMsg += "فایل" + e.target.files[0].name + "بیشتر از 5 مگابایت است." + "<br>"
        else {
            var reader = new FileReader();
            var url = reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = function (e) {
                this.setState({
                    Attachment: reader.result
                })
            }.bind(this);
        }

        document.getElementById("ErrProfileAttachment").innerHTML = errMsg;
        this.setState({
            AttachedFile: e.target.files,
        });
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
                        <Row>
                            <Label>پروفایل کاربری</Label>
                        </Row>
                        <Row className="standardPadding">
                            <Row>
                                <Col xs="auto">
                                    <label for="profile-attachment">
                                        <img src={this.state.AttachedFile == null || this.state.AttachedFile.length == 0 ? window.siteAddress + "/us/profile.png" : ( this.state.Attachment == null ? window.siteAddress + "/" + this.state.AttachedFile[0].attachmentType + "/" + this.state.AttachedFile[0].fileName + this.state.AttachedFile[0].ext : this.state.Attachment)} id="file-input" width={100} height={100} />
                                    </label>

                                    <input id="profile-attachment" type="file" accept="image/*" style={{ display: "none" }} onChange={e => this.setFile(e)} />
                                    <p id="ErrProfileAttachment" className='errMessage' ></p>
                                </Col>
                            </Row>
                            <Col xs="auto">
                                <Label className="standardLabelFont">نام و نام خانوادگی</Label>
                                <TextBox
                                    value={this.state.txtNameValue}
                                    showClearButton={true}
                                    placeholder="نام و نام خانوادگی"
                                    rtlEnabled={true}
                                    valueChangeEvent="keyup"
                                    onValueChanged={this.txtName_onChange}
                                />
                                <Row>
                                    <Label
                                        id="errName"
                                        className="standardLabelFont errMessage"
                                    />
                                </Row>
                            </Col>
                            <Col xs="auto">
                                <Label className="standardLabelFont">نام کاربری</Label>
                                <TextBox
                                    value={this.state.txtUserNameValue}
                                    showClearButton={true}
                                    placeholder="نام کاربری"
                                    rtlEnabled={true}
                                    valueChangeEvent="keyup"
                                    onValueChanged={this.txtUserName_onChange}
                                />
                                <Row>
                                    <Label
                                        id="errUserName"
                                        className="standardLabelFont errMessage"
                                    />
                                </Row>
                            </Col>
                            <Col xs="auto">
                                <Label className="standardLabelFont">رمز عبور</Label>
                                <TextBox
                                    value={this.state.txtPasswordValue}
                                    showClearButton={true}
                                    placeholder="رمز عبور"
                                    rtlEnabled={true}
                                    valueChangeEvent="keyup"
                                    onValueChanged={this.txtPassword_onChange}
                                />
                                <Row>
                                    <Label
                                        id="errPassword"
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
                                            text="ذخیره تغییرات"
                                            type="success"
                                            stylingMode="contained"
                                            rtlEnabled={true}
                                            onClick={this.btnUpdate_onClick}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Row>
                        <Row>
                            <Col>
                                <p
                                    id="ErrorUpdateUser"
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

export default connect(mapStateToProps)(Profile);
