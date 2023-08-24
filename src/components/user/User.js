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
    addUser,
    updateUser,
    deleteUser,
    userList,
} from '../../redux/reducers/user/user-actions';
import { 
  personList,
} from '../../redux/reducers/person/person-actions';
  import { userActions } from '../../redux/reducers/user/user-slice';

  import { DataGridUserColumns } from "./User-config";
    
  import PlusNewIcon from "../../assets/images/icon/plus.png";
  import SaveIcon from "../../assets/images/icon/save.png";
  import UpdateIcon from "../../assets/images/icon/update.png";
  import DeleteIcon from "../../assets/images/icon/delete.png";
  
class User extends React.Component{
    constructor(props){
        super(props);
        this.state={
            txtUserNameValue:null,
            chkIsActive: null,
            RowSelected:null,
            UserGridData:null,
            stateUpdateDelete: true,
            stateDisable_btnAdd:false,
            stateDisable_btnUpdate:false,
            stateDisable_show:false,
            ToastProps:{
              isToastVisible:false,
              Message:"",
              Type:"",
            },
            userId:null,
            user:null,
            stateDisable_txtCode:false,
            PersonList:null,
            PersonId:null,
            txtPasswordValue:null,
        }
    }

    async componentDidMount(){
      await this.fn_GetPermissions();
      this.fn_updateGrid();
      await this.fn_personList();
    }

    fn_personList=async()=>{
      this.setState({
        PersonList:await personList(this.props.Company.currentCompanyId, this.props.User.token)
      })
    }
  
    fn_updateGrid=async()=>{
      if(this.state.stateDisable_show)
        this.setState({
          UserGridData: await userList(this.props.Company.currentCompanyId, this.props.User.token)
        });
        
    }
  
    fn_GetPermissions = () => {
      const perm = this.props.User.permissions;
      if (perm != null)
        for (let i = 0; i < perm.length; i++) {
          switch (perm[i].objectName) {
            case "user.update":
              this.setState({ stateDisable_btnUpdate: true });
              break;
            case "user.insert":
              this.setState({ stateDisable_btnAdd: true });
              break;
            case "user.show":
              this.setState({ stateDisable_show: true });
              break;
          }
        }
    };
  
    grdUser_onClickRow=(e) => {
      this.setState({
        txtUserNameValue: e.data.userName,
        chkIsActive: e.data.isActive,        
        stateUpdateDelete: true,
        RowSelected: e.data,
        PersonId:e.data.personId
      });
    };
  
    btnNew_onClick=()=>{
      this.setState({
        txtUserNameValue: null,
        chkIsActive:null,
        stateUpdateDelete:false,
        stateDisable_txtCode:false,
        PersonId:null,
      });
    }
    
    chkIsActive_onChange = (e) => {
      this.setState({
        chkIsActive: e.value,
      });
    };
  
    fn_CheckValidation = () => {
      let errMsg = "";
      let flag = true;
      document.getElementById("errUserName").innerHTML = "";
      if (this.state.txtUserNameValue == null) {
        document.getElementById("errUserName").innerHTML =
          "نام کاربری را وارد نمائید";
        flag = false;
      }
  
      if (this.state.chkIsActive == null) {
        document.getElementById("errUserIsActive").innerHTML =
          "فعال بودن را مشخص نمائید.";
        flag = false;
      }
      return flag;
    };
    btnAdd_onClick = async () => {
      if (await this.fn_CheckValidation()) {
        const data = {
          userName: this.state.txtUserNameValue,
          isActive:this.state.chkIsActive,
          personId:this.state.PersonId,
        };
        const RESULT=await addUser(data, this.props.User.token);   
        this.setState({
          ToastProps: {
            isToastVisible: true,
            Message: RESULT!=null ? "ثبت با موفقیت انجام گردید" : "عدم ثبت" ,
            Type: RESULT!=null ? "success" : "error",
          },
        });
        await this.fn_personList();
        this.fn_updateGrid();

      }
    };
    txtUserName_onChange = (e) => {
      this.setState({ txtUserNameValue: e.value });
    };
  
    txtPassword_onChange=(e) =>{
      this.setState({txtPasswordValue:e. value});
    }
    btnUpdate_onClick = async () => {
      if (await this.fn_CheckValidation()) {
        const data = {
          id: this.state.RowSelected.id,
          userName: this.state.txtUserNameValue,
          isActive:this.state.chkIsActive,
          password:this.state.txtPasswordValue,
          personId:this.state.PersonId
        };
        
        const RESULT=await updateUser(data, this.props.User.token);
        this.setState({
          ToastProps: {
            isToastVisible: true,
            Message: RESULT>0 ? "ویرایش با موفقیت انجام گردید" : "عدم ویرایش" ,
            Type: RESULT>0 ? "success" : "error",
          },
        });
      this.fn_updateGrid();
      }
    };
  
    onHidingToast=()=>{
      this.setState({ToastProps:{isToastVisible:false}})
    }
  
  
    btnDelete_onClick=async()=>{
        const MSG=await deleteUser(this.state.RowSelected.id, this.props.User.token);
        this.setState({
          ToastProps: {
            isToastVisible: true,
            Message: MSG,
            Type: "success",
          },
        });
        await this.fn_personList();
        this.fn_updateGrid();
    }

    cmbPerson_onChange=(e)=>{
      this.setState({
        PersonId:e
      })
    }
    render(){
      return(
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
                  <Label>
                        کاربر
                  </Label>                
                </Row>
                {this.state.stateDisable_btnAdd &&
                  <Row>                
                    <Col xs="auto">
                      <Button
                        icon={PlusNewIcon}
                        text="جدید"
                        type="default"
                        stylingMode="contained"
                        rtlEnabled={true}
                        onClick={this.btnNew_onClick}
                    />
                    </Col>
                  </Row>}
                  <Row className="standardPadding">
                    <Col xs={3}>
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
                      <Col xs={3}>
                        <Label className="standardLabelFont">شخص</Label>
                        <SelectBox
                          dataSource={this.state.PersonList}
                          displayExpr="fullName"
                          placeholder="شخص"
                          valueExpr="id"
                          searchEnabled={true}
                          rtlEnabled={true}
                          onValueChange={this.cmbPerson_onChange}
                          value={this.state.PersonId}
                        />
                      </Col>
                      {this.state.stateUpdateDelete &&
                      <Col xs={3}>
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
                            id="errUserName"
                            className="standardLabelFont errMessage"
                          />
                        </Row>
                      </Col>
                      }
                  </Row>
                  <Row>
                  <Col xs="auto">
                    <CheckBox
                      value={this.state.chkIsActive}
                      text="فعال"
                      rtlEnabled={true}
                      onValueChanged={this.chkIsActive_onChange}
                    />
                    <Row>
                      <Label
                        id="errUserIsActive"
                        className="standardLabelFont errMessage"
                      />
                    </Row>
                  </Col>
                </Row>
                  {!this.state.stateUpdateDelete ? (
                      <Row>
                        {this.state.stateDisable_btnAdd &&(
                          <Col xs="auto">
                            <Button
                              icon={SaveIcon}
                              text="ثبت"
                              type="success"
                              stylingMode="contained"
                              rtlEnabled={true}
                              onClick={this.btnAdd_onClick}
                            />
                          </Col>
                        )}
                      </Row>
                    ) : (
                      <Row className="standardSpaceTop">
                        <Row>
                          {this.state.stateDisable_btnUpdate &&(
                            <>
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
                            </>
                               )}
                               </Row>
                             </Row>
                           )}
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
            <p></p>
          <Card className="shadow bg-white border pointer">
            <Row className="standardPadding"> 
              <Row>
                <Label className="title">
                    لیست کاربران
                </Label>
              </Row>
            <Row>
              <Col xs="auto" className="standardMarginRight">                     
                <DataGrid
                    dataSource={this.state.UserGridData}
                    defaultColumns={DataGridUserColumns}
                    showBorders={true}
                    rtlEnabled={true}
                    allowColumnResizing={true}
                    onRowClick={this.grdUser_onClickRow}                                            
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
                    
  export default connect(mapStateToProps)(User);
  