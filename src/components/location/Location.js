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
  import { connect } from "react-redux";
  import Button from "@mui/material/Button";
  import SelectBox from 'devextreme-react/select-box';
  import {
    updateLocation,
    addLocation,
    locationList
  } from "../../redux/reducers/location/location-actions";
  import { companyList } from "../../redux/reducers/company/company-actions";
  import { DataGridLocationColumns } from "./Location-config";
  
  import { DataGridPageSizes,DataGridDefaultPageSize
    ,DataGridDefaultHeight 
    ,ToastTime
    ,ToastWidth
  } from '../../config/config';
class Location extends React.Component{
    constructor(props){
        super(props);
        this.state={
            LocationGridData:null,
            Id:null,
            LocationId:null,
            Code:null,
            LocationName:null,
            PersianName:null,
            Desc:null,
            LocationId:null,
            LocationTypeId:null,
            CompanyId:null,
            stateUpdateDelete: true,
            stateDisable_btnAddLocation:true,
            stateDisable_btnUpdateLocation:false,
            stateDisable_showLocation:true,
            ToastProps:{
                isToastVisible:false,
                Message:"",
                Type:"",
              },
              Location:null,
        }
    }

    async componentDidMount(){
        await this.fn_GetPermissions();
        this.fn_updateGrid();
      }
    
      fn_updateGrid=async()=>{
        if(this.state.stateDisable_showLocation){
        this.setState({
            LocationGridData: await companyList(this.props.User.token
                )});
            }
      }
    
      fn_GetPermissions=()=>{
        const perm=this.props.User.permissions;
        let enable_btnPeymentConfirm=false;
        if(perm!=null)
          for(let i=0;i<perm.length;i++){
            switch(perm[i].objectName){
              case 'location.update' :this.setState({stateDisable_btnUpdateLocation:true});break;
              case 'location.insert' :this.setState({stateDisable_btnAddLocation:true});break;
              case 'location.show' :this.setState({stateDisable_showLocation:true});break;
            }
          }   
      }
    
      grdLocation_onClickRow=(params) => {
        this.setState({
          Id:params.data.id,
          LocationId: params.data.locationId,
          LocationName: params.data.companyName,
          PersianName: params.data.persianName,
          Desc: params.data.desc,
          LocationTypeId: params.data.locationTypeId,
          CompanyId:params.data.companyId
        });
      };
    
      btnNewLocation_onClick=()=>{
        this.setState({
          LocationName: "",
          PersianName: "",
          Desc: "",
          stateUpdateDelete:false
        });
      }
    
      btnAddLocation_onClick = async () => {
        let flag = true;
        let errMSG = "";
        document.getElementById("errLocationName").innerHTML = "";
        document.getElementById("errPersianName").innerHTML = "";  
        if(this.state.LocationName==''){
          document.getElementById("errLocationName").innerHTML = "نام موقعیت را وارد نمائید."; 
          flag=false;
        }
        if(this.state.PersianName==null){
          document.getElementById("errPersianName").innerHTML = "نام فارسی را وارد نمائید."; 
          flag=false;
        }
    
        if(flag){
          const data = {
            code:this.state.Code,
            locationName:this.state.LocationName,
            persianName: this.state.PersianNameName,
            desc:this.state.Desc,
            locationTypeId: this.state.LocationTypeId,
            companyId: this.state.CompanyId,
          };
          await addLocation(data, this.props.User.token);   
          this.setState({        
            ToastProps:{  
                isToastVisible:true,              
                Message:"موقعیت ثبت گردید.",
                Type:"success",
            }
          })
          this.fn_updateGrid();
        }
      };
      txtCode_onChange = (params) => {
        this.setState({ Code: params.target.value });
      };
      txtLocationName_onChange = (params) => {
        this.setState({ LocationName: params.target.value });
      };
    
      txtPersianName_onChange = (params) => {
        this.setState({ PersianName: params.target.value });
      };
    
      txtDesc_onChange = (params) => {
        this.setState({ Desc: params.target.value });
      };
    
      btnUpdateLocation_onClick = async () => {
        let flag = true;
        let errMSG = "";
        document.getElementById("errLocationName").innerHTML = "";
        document.getElementById("errPersianName").innerHTML = "";  
        if(this.state.LocationName==''){
          document.getElementById("errLocationName").innerHTML = "نام موقعیت را وارد نمائید."; 
          flag=false;
        }
        if(this.state.PersianName==null){
          document.getElementById("errPersianName").innerHTML = "نام فارسی را وارد نمائید."; 
          flag=false;
        } 
    
        if (this.state.Id == null) {
          errMSG += "درخواستی برای ویرایش انتخاب نشده است." + "<br>";
          flag = false;
        }
        document.getElementById("ErrorUpdateLocation").innerHTML = errMSG;
        if (flag) {
          let data = {
            id: this.state.Id,
            locationName: this.state.LocationName,
            persianName:this.state.PersianName,
            desc: this.state.Desc,
            locationTypeId: this.state.LocationTypeId,
            companyId: this.state.CompanyId,
          };
          await updateLocation(data, this.props.User.token);
        }
        this.fn_updateGrid();
      };
    
      onHidingToast=()=>{
        this.setState({ToastProps:{isToastVisible:false}})
      }

      cmbCompany_onChange=(e)=>{
        console.log(e);
          this.setState({
            CompanyId:e
          })
      }

    render(){
        return(
            <>
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
                            موقعیت
                      </Label>                
                    </Row>
                    {this.state.stateDisable_btnAddLocation &&
                      <Row>                
                        <Col>
                          <Button
                            variant="contained"
                            sx={{ fontFamily: "Tahoma"}}
                            onClick={this.btnNewLocation_onClick}
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
                          />
                          <Label id="errCode" className="standardLabelFont errMessage" />
                        </Col>
                        <Col>
                          <Label className="standardLabelFont">شرکت</Label>                            
                          <SelectBox 
                            dataSource={this.props.Company.company}
                            displayExpr="companyName"    
                            placeholder="انتخاب شرکت"                            
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}                               
                            onValueChange={this.cmbCompany_onChange}
                          /> 
                        </Col>
                        <Col>
                          <Label>نام موقعیت</Label>
                          <Input
                            type="text"
                            value={this.state.LocationName}
                            onChange={this.txtLocationName_onChange}
                            placeholder="نام موقعیت"
                          />
                          <Label id="errLocationName" className="standardLabelFont errMessage" />
                        </Col>
                        <Col>
                          <Label>نام فارسی موقعیت</Label>
                          <Input
                            type="text"
                            value={this.state.PersianName}
                            onChange={this.txtPersianName_onChange}
                            placeholder="نام فارسی موقعیت"
                          />
                          <Label id="errPersianName" className="standardLabelFont errMessage" />
                        </Col>
                        <Col>              
                          <Label>توضیحات</Label>
                          <Input
                            type="text"
                            value={this.state.Desc}
                            onChange={this.txtDesc_onChange}
                            placeholder="توضیحات"
                          />
                        </Col>
                      </Row>
                      {!this.state.stateUpdateDelete ? (
                          <Row>
                            {this.state.stateDisable_btnAddLocation &&
                              <Col xs="auto">
                                <Button
                                  variant="contained"
                                  sx={{ fontFamily: "Tahoma"}}
                                  onClick={this.btnAddLocation_onClick}
                                >
                                  ثبت موقعیت
                                </Button>
                              </Col>
                            }
                          </Row>
                        ) : (
                          <>
                            <Row>
                              {this.state.stateDisable_btnUpdateLocation &&
                                  <Col xs="auto">
                                    <Button
                                      variant="contained"
                                      sx={{ fontFamily: "Tahoma"}}
                                      onClick={this.btnUpdateLocation_onClick}
                                    >
                                      ذخیره تغییرات
                                    </Button>
                                  </Col>      
                              }                
                            </Row>
                            <Row>
                              <Col>
                                <p
                                  id="ErrorUpdateLocation"
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
        لیست موقعیت ها
    </Label>
  </Row>

  <Row>
        <Row className="standardPadding">                    
          <DataGrid
              dataSource={this.state.LocationGridData}
              defaultColumns={DataGridLocationColumns}
              showBorders={true}
              rtlEnabled={true}
              allowColumnResizing={true}
              onRowClick={this.grdLocation_onClickRow}                                            
              height={DataGridDefaultHeight}
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
            </>
        )
    }
}

const mapStateToProps=(state)=>({
  User:state.users,
  Company:state.companies
});

export default connect(mapStateToProps)(Location)