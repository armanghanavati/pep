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
import AdapterJalali from "@date-io/date-fns-jalali";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import { userLocationList } from "../../redux/reducers/user/user-actions";
import { positionList } from "../../redux/reducers/position/position-actions";
import { CheckBox } from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";
import {
    supplierListComboByCompanyId
} from "../../redux/reducers/supplier/supplier-action";
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
import Wait from "../common/Wait";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";

class OrderByUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cmbSourceLocation: [],
            cmbDestLocation: [],
            cmbSrcLocationValue: null,
            cmbDestLocationValue: null,
            FileContent: null,
            FinalProducts: null,
            stateWait: false,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
            stateUpdateDelete: true,
            stateDisable_btnAdd: false,
        };
    }

    OpenCloseWait() {
        this.setState({ stateWait: !this.state.stateWait })
    }

    async componentDidMount() {
        await this.fn_GetPermissions();
        this.fn_locationList();
    }

    fn_GetPermissions = () => {
        const perm = this.props.User.permissions;
        if (perm != null)
            for (let i = 0; i < perm.length; i++) {
                switch (perm[i].objectName) {
                    case "order_inv_first_register.update":
                        this.setState({ stateDisable_btnUpdate: true });
                        break;
                    case "order_inv_first_register.insert":
                        this.setState({ stateDisable_btnAdd: true });
                        break;
                    case "order_inv_first_register.show":
                        this.setState({ stateDisable_show: true });
                        break;
                }
            }
    };

    cmbSourceLocation_onChange = (params) => {
        this.setState({ cmbSrcLocationValue: params });
    };

    cmbDestLocation_onChange = (params) => {
        this.setState({ cmbDestLocationValue: params });
    };

    async fn_locationList() {
        var result = await userLocationList(this.props.User.userId, this.props.Company.currentCompanyId, this.props.User.token);
        this.setState({
            cmbSourceLocation: result,
            cmbDestLocation: result
        });
    }

    UploadFile = async (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            this.setState({ FileContent: text.split(/\r?\n/) });
        };
        reader.readAsText(e.target.files[0]);
    };

    btnAdd_onClick = () => {
        let tempContent = this.state.FileContent;
        let ProductsJSON = [];
        for (let i = 0; i < tempContent.length; i++) {
            let tempSplit = tempContent[i].split(",");
            if (parseInt(tempSplit[1]) > 0) {
                let obj = {
                    Bar: tempSplit[0],
                    Num: parseInt(tempSplit[1]),
                };
                ProductsJSON.push(obj);
            }
        }
        this.setState({ FinalProducts: ProductsJSON });
        console.log(JSON.stringify(ProductsJSON));
        //this.api_InsertNewOrder(ProductsJSON);
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
                            <Label>ثبت سفارش افتتاحیه</Label>
                        </Row>
                        <Row className="standardPadding">
                            <Col xs="auto">
                                <Label className="standardLabelFont">فروشگاه مبدا</Label>
                                <SelectBox
                                    dataSource={this.state.cmbSourceLocation}
                                    searchEnabled={true}
                                    displayExpr="label"
                                    placeholder="فروشگاه مبدا"
                                    valueExpr="id"
                                    rtlEnabled={true}
                                    onValueChange={this.cmbSourceLocation_onChange}
                                />
                                <Row>
                                    <Label id="errSourceLocation" className="standardLabelFont errMessage" />
                                </Row>
                            </Col>
                            <Col xs="auto">
                                <Label className="standardLabelFont">فروشگاه مقصد</Label>
                                <SelectBox
                                    dataSource={this.state.cmbDestLocation}
                                    searchEnabled={true}
                                    displayExpr="label"
                                    placeholder="فروشگاه مقصد"
                                    valueExpr="id"
                                    rtlEnabled={true}
                                    onValueChange={this.cmbDestLocation_onChange}
                                />
                                <Row>
                                    <Label id="errDestLocation" className="standardLabelFont errMessage" />
                                </Row>
                            </Col>
                            <Row>
                                <Col xs="auto">
                                    <input type="file" onChange={(e) => this.UploadFile(e)} />
                                </Col>
                            </Row>
                            {this.state.stateDisable_btnAdd && (
                                <Row>
                                    <Col xs="auto" className="standardPadding">
                                        <Button
                                            icon={SaveIcon}
                                            text="ثبت"
                                            type="success"
                                            stylingMode="contained"
                                            rtlEnabled={true}
                                            onClick={this.btnAdd_onClick}
                                        />
                                    </Col>
                                </Row>
                            )}
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

export default connect(mapStateToProps)(OrderByUpload);
