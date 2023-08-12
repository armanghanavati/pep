import React from "react";
import {
    Input,
    Container,
    Row,
    Col,
    Card,
    CardDeck,
    CardImg,
    CardBody,
    CardTitle,
    Label,
    TabContent, TabPane, Nav, NavItem, NavLink,  
    Modal, ModalHeader, ModalBody, ModalFooter 
  } from "reactstrap";
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
  import { Toast } from 'devextreme-react/toast';
  import { CheckBox } from 'devextreme-react/check-box';
  import { connect } from "react-redux";
  import Button from "@mui/material/Button";
  import {
    updateCompany,
    addCompany,
    companyList
  } from "../../redux/reducers/company/company-actions";
  import { DataGridCompanyColumns } from "./Company-config";
  
  import { DataGridPageSizes,DataGridDefaultPageSize
    ,DataGridDefaultHeight 
    ,ToastTime
    ,ToastWidth
  } from '../../config/config';
class Company extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            CompanyGridData:null,
            companyId:null,
            Code:'',
            CompanyName:'',
            EconomicCode:'',
            NationalCode:'',
            CompanyType:'',
            RowSelected:null,
            stateUpdateDelete: true,
            stateDisable_btnAddCompany:false,
            stateDisable_btnUpdateCompany:false,
            stateDisable_showCompany:false,
            ToastProps:{
                isToastVisible:false,
                Message:"",
                Type:"",
              },
            Company:null,
            Active:false,
        }
    }
   async componentDidMount(){
    await this.fn_GetPermissions();
    this.fn_updateGrid();
  }

  fn_updateGrid=async()=>{
    if(this.state.stateDisable_showCompany){
    this.setState({
        CompanyGridData: await companyList(this.props.User.token
            )});
        }
  }

  fn_GetPermissions=()=>{
    const perm=this.props.User.permissions;
    let enable_btnPeymentConfirm=false;
    if(perm!=null)
      for(let i=0;i<perm.length;i++){
        switch(perm[i].objectName){
          case 'company.update' :this.setState({stateDisable_btnUpdateCompany:true});break;
          case 'company.insert' :this.setState({stateDisable_btnAddCompany:true});break;
          case 'company.show' :this.setState({stateDisable_showCompany:true});break;
        }
      }   
  }

  grdCompany_onClickRow=(params) => {
    this.setState({
      Code: params.data.code,
      CompanyId: params.data.id,
      CompanyName: params.data.companyName,
      EconomicCode: params.data.economicCode,
      NationalCode: params.data.nationalCode,
      Address: params.data.address,
      CompanyType:params.data.companyType,
      Active:params.data.isActive,
      stateUpdateDelete: true,
      RowSelected: params.data,
    });
    document.getElementById("txtCode").disabled = true;
  };

  btnNewCompany_onClick=()=>{
    this.setState({
      CompanyName: "",
      EconomicCode: "",
      NationalCode: "",
      Address: "",
      CompanyType: "",
      stateUpdateDelete:false
    });
    document.getElementById("txtCode").disabled = false;
  }

  btnAddCompany_onClick = async () => {
    let flag = true;
    let errMSG = "";
    document.getElementById("errCompanyName").innerHTML = "";
    document.getElementById("errNationalCode").innerHTML = "";  
    if(this.state.CompanyName.trim()==''){
      document.getElementById("errCompanyName").innerHTML = "نام شرکت را وارد نمائید."; 
      flag=false;
    }
    if(this.state.NationalCode.trim()==''){
      document.getElementById("errNationalCode").innerHTML = "کد ملی را وارد نمائید."; 
      flag=false;
    } 

    if(flag){
      const data = {
        code:this.state.Code,
        companyName: this.state.CompanyName,
        economicCode:this.state.EconomicCode,
        nationalCode: this.state.NationalCode,
        address: this.state.Address,
        companyType: this.state.CompanyType,
        isActive:this.state.Active
      };
      var result=await addCompany(data, this.props.User.token);   
      if(result == null)
      {
        this.setState({        
          ToastProps:{  
              isToastVisible:true,              
              Message:"خطا در ثبت شرکت.",
              Type:"error",
          }
        })
      }
      else{
      this.setState({        
        ToastProps:{  
            isToastVisible:true,              
            Message:"شرکت ثبت گردید.",
            Type:"success",
        }
      })
    }
      this.fn_updateGrid();
    }
  };
  txtCode_onChange = (params) => {
    this.setState({ Code: params.target.value });
  };
  txtCompanyName_onChange = (params) => {
    this.setState({ CompanyName: params.target.value });
  };

  txtEconomicCode_onChange = (params) => {
    this.setState({ EconomicCode: params.target.value });
  };

  txtNationalCode_onChange = (params) => {
    this.setState({ NationalCode: params.target.value });
  };

  txtAddress_onChange = (params) => {
    this.setState({ Address: params.target.value });
  };

  txtCompanyType_onChange = (params) => {
    this.setState({ CompanyType: params.target.value });
  };

  btnUpdateCompany_onClick = async () => {
    let flag = true;
    let errMSG = "";
    document.getElementById("errCompanyName").innerHTML = "";
    document.getElementById("errNationalCode").innerHTML = "";  
    if(this.state.CompanyName.trim()==''){
      document.getElementById("errCompanyName").innerHTML = "نام شرکت را وارد نمائید."; 
      flag=false;
    }
    if(this.state.NationalCode.trim()==''){
      document.getElementById("errNationalCode").innerHTML = "کد ملی را وارد نمائید."; 
      flag=false;
    } 

    if (this.state.CompanyId == null) {
      errMSG += "درخواستی برای ویرایش انتخاب نشده است." + "<br>";
      flag = false;
    }
    document.getElementById("ErrorUpdateCompany").innerHTML = errMSG;
    if (flag) {
      let data = {
        id: this.state.CompanyId,
        companyName: this.state.CompanyName,
        economicCode:this.state.EconomicCode,
        nationalCode: this.state.NationalCode,
        address: this.state.Address,
        companyType: this.state.CompanyType,
        isActive:this.state.Active
      };
      await updateCompany(data, this.props.User.token);
    }
    this.fn_updateGrid();
  };

  onHidingToast=()=>{
    this.setState({ToastProps:{isToastVisible:false}})
  }

  chkActive_onChange=(args)=> {
    this.setState({
      Active: args.value,
    });
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
                            شرکت
                      </Label>                
                    </Row>
                    {this.state.stateDisable_btnAddCompany &&
                      <Row>                
                        <Col>
                          <Button
                            variant="contained"
                            sx={{ fontFamily: "Tahoma"}}
                            onClick={this.btnNewCompany_onClick}
                          >
                            جدید
                          </Button>
                        </Col>
                      </Row>}
                      <Row className="standardPadding">
                      <Col>
                          <Label>کد</Label>
                          <Input
                            type="text"
                            value={this.state.Code}
                            onChange={this.txtCode_onChange}
                            placeholder="کد"
                            id="txtCode"
                          />
                        </Col>
                        <Col>
                          <Label>نام شرکت</Label>
                          <Input
                            type="text"
                            value={this.state.CompanyName}
                            onChange={this.txtCompanyName_onChange}
                            placeholder="نام شرکت"
                          />
                          <Label id="errCompanyName" className="standardLabelFont errMessage" />
                        </Col>
                        <Col>              
                          <Label>کد اقتصادی</Label>
                          <Input
                            type="text"
                            value={this.state.EconomicCode}
                            onChange={this.txtEconomicCode_onChange}
                            placeholder="کد اقتصادی"
                          />
                        </Col>
                        <Col>
                          <Label>کد ملی</Label>
                          <Input
                            type="text"
                            value={this.state.NationalCode}
                            onChange={this.txtNationalCode_onChange}
                            placeholder="کد ملی"
                          />
                          <Label id="errNationalCode" className="standardLabelFont errMessage" />
                        </Col>
                        <Col>              
                          <Label>آدرس</Label>
                          <Input
                            type="text"
                            value={this.state.Address}
                            onChange={this.txtAddress_onChange}
                            placeholder="آدرس"
                          />
                        </Col>
                        <Col>              
                          <Label>نوع شرکت</Label>
                          <Input
                            type="text"
                            value={this.state.CompanyType}
                            onChange={this.txtCompanyType_onChange}
                            placeholder="نوع شرکت"
                          />
                        </Col>
                        <Col>              
                          <Label>فعال</Label>
                          <CheckBox
                            value={this.state.Active}
                            //elementAttr={handleValueChangeLabel}
                            onValueChanged={this.chkActive_onChange}
                          />
                        </Col>
                      </Row>
                      {!this.state.stateUpdateDelete ? (
                          <Row>
                            {this.state.stateDisable_btnAddCompany &&
                              <Col xs="auto">
                                <Button
                                  variant="contained"
                                  sx={{ fontFamily: "Tahoma"}}
                                  onClick={this.btnAddCompany_onClick}
                                >
                                  ثبت شرکت
                                </Button>
                              </Col>
                            }
                          </Row>
                        ) : (
                          <>
                            <Row>
                              {this.state.stateDisable_btnUpdateCompany &&
                                  <Col xs="auto">
                                    <Button
                                      variant="contained"
                                      sx={{ fontFamily: "Tahoma"}}
                                      onClick={this.btnUpdateCompany_onClick}
                                    >
                                      ذخیره تغییرات
                                    </Button>
                                  </Col>      
                              }                
                            </Row>
                            <Row>
                              <Col>
                                <p
                                  id="ErrorUpdateCompany"
                                  style={{ textAlign: "right", color: "red" }}
                                ></p>
                              </Col>
                            </Row>
                          </>
                        )}  
                  </Row>   
                </Card>
                <p></p>
<Card className="shadow bg-white border pointer">
<Row className="standardPadding">
  <Row>  
    <Label className="title">
        لیست شرکت ها
    </Label>
  </Row>

  <Row>
        <Row className="standardPadding">                    
          <DataGrid
              dataSource={this.state.CompanyGridData}
              defaultColumns={DataGridCompanyColumns}
              showBorders={true}
              rtlEnabled={true}
              allowColumnResizing={true}
              onRowClick={this.grdCompany_onClickRow}                                            
              height={DataGridDefaultHeight}
              keyExpr="id"
          >
              <Scrolling rowRenderingMode="virtual"
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
        </Row>

  </Row>
</Row>
</Card>    
</div>   
        )
    }
}
const mapStateToProps = (state) => ({
    User: state.users,
  });
  
  export default connect(mapStateToProps)(Company);
