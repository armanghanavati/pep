import React from "react";
import { connect } from "react-redux";
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
  import SelectBox from 'devextreme-react/select-box';
  import Button from "@mui/material/Button";
  import {
    updatePosition,
    addPosition,
    positionList
  } from "../../redux/reducers/position/position-action";
  import companySlice, { companyActions } from '../../redux/reducers/company/company-slice';
  import { companyList } from '../../redux/reducers/company/company-actions';
  import {DataGridPositionColumns} from "./Position-config";
  
  import { DataGridPageSizes,DataGridDefaultPageSize
    ,DataGridDefaultHeight 
    ,ToastTime
    ,ToastWidth
  } from '../../config/config';
class Position extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            PositionGridData:null,
            Code:null,
            Id:null,
            PositionName:null,
            Desc:null,
            PositionId:null,
            CompanyId:null,
            RowSelected:null,
            stateUpdateDelete: true,
            stateDisable_btnAddPosition:false,
            stateDisable_btnUpdatePosition:false,
            stateDisable_showPosition:false,
            ToastProps:{
                isToastVisible:false,
                Message:"",
                Type:"",
              }
        }

      
    }
  async componentDidMount(){
    await this.fn_GetPermissions();
    this.fn_updateGrid();
    await this.fn_companyList(); 
  }
 
  fn_companyList=async()=>{    
    await this.props.dispatch(companyActions.setCompany({
      company:await companyList(this.props.User.token)
    }));
  }

  fn_updateGrid=async()=>{
    if(this.state.stateDisable_showPosition){
      this.setState({
        PositionGridData: await positionList(this.props.User.token)});
      }
  }

  fn_GetPermissions=()=>{
    const perm=this.props.User.permissions;
    if(perm!=null)
      for(let i=0;i<perm.length;i++){
        switch(perm[i].objectName){
          case 'position.update' :this.setState({stateDisable_btnUpdatePosition:true});break;
          case 'position.insert' :this.setState({stateDisable_btnAddPosition:true});break;
          case 'position.show' :this.setState({stateDisable_showPosition:true});break;
        }
      }   
  }

  grdPosition_onClickRow=(params) => {
    this.setState({
      Id: params.data.id,
      PositionId: params.data.positionId,
      PositionName: params.data.positionName,
      CompanyId: params.data.companyId,
      Desc: params.data.desc,
      RowSelected: params.data
    });
  };

  btnNewPosition_onClick=()=>{
    this.setState({
      PositionName: "",
      Desc: "",
      stateUpdateDelete:false
    });
  }

  btnAddPosition_onClick = async () => {
    let flag = true;
    let errMSG = "";
    document.getElementById("errPositionName").innerHTML = ""; 
    if(this.state.CompanyName=''){
      document.getElementById("errPositionName").innerHTML = "نام سمت را وارد نمائید."; 
      flag=false;
    }

    if(flag){
      const data = {
        code:this.state.Code,
        positionName: this.state.PositionName,
        desc:this.state.Desc,
        companyId:this.state.CompanyId
      };
      await addPosition(data, this.props.User.token);   
      this.setState({        
        ToastProps:{  
            isToastVisible:true,              
            Message:"سمت ثبت گردید.",
            Type:"success",
        }
      })
      this.fn_updateGrid();
    }
  };
  txtCode_onChange = (params) => {
    this.setState({ Code: params.target.value });
  };
  txtPositionName_onChange = (params) => {
    this.setState({ PositionName: params.target.value });
  };

  txtDesc_onChange = (params) => {
    this.setState({ Desc: params.target.value });
  };


  btnUpdatePosition_onClick = async () => {
    let flag = true;
    let errMSG = "";
    document.getElementById("errPositionName").innerHTML = "";
    if(this.state.CompanyName==''){
      document.getElementById("errpositionName").innerHTML = "نام شرکت را وارد نمائید."; 
      flag=false;
    }


    if (this.state.CompanyId == null) {
      errMSG += "درخواستی برای ویرایش انتخاب نشده است." + "<br>";
      flag = false;
    }
    document.getElementById("ErrorUpdatePosition").innerHTML = errMSG;
    if (flag) {
      let data = {
        id: this.state.Id,
        positionName: this.state.PositionNameName,
        desc:this.state.Desc,
      };
      await updatePosition(data, this.props.User.token);
    }
    this.fn_updateGrid();
  };

  onHidingToast=()=>{
    this.setState({ToastProps:{isToastVisible:false}})
  }

  cmbCompany_onChange=(e)=>{
    this.setState({
      CompanyId:e
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
                            سمت
                      </Label>                
                    </Row>
                    {this.state.stateDisable_btnAddPosition &&
                      <Row>                
                        <Col>
                          <Button
                            variant="contained"
                            sx={{ fontFamily: "Tahoma"}}
                            onClick={this.btnNewPosition_onClick}
                          >
                            جدید
                          </Button>
                        </Col>
                      </Row>}
                      <Row className="standardPadding">
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
                          <Label>کد</Label>
                          <Input
                            type="text"
                            value={this.state.Code}
                            onChange={this.txtCode_onChange}
                            placeholder="کد"
                          />
                          <Label id="errPositionName" className="standardLabelFont errMessage" />
                        </Col>
                        <Col>
                          <Label>نام سمت</Label>
                          <Input
                            type="text"
                            value={this.state.PositionName}
                            onChange={this.txtPositionName_onChange}
                            placeholder="نام سمت"
                          />
                          <Label id="errPositionName" className="standardLabelFont errMessage" />
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
                            {this.state.stateDisable_btnAddPosition &&
                              <Col xs="auto">
                                <Button
                                  variant="contained"
                                  sx={{ fontFamily: "Tahoma"}}
                                  onClick={this.btnAddPosition_onClick}
                                >
                                  ثبت سمت
                                </Button>
                              </Col>
                            }
                          </Row>
                        ) : (
                          <>
                            <Row>
                              {this.state.stateDisable_btnUpdatePosition &&
                                  <Col xs="auto">
                                    <Button
                                      variant="contained"
                                      sx={{ fontFamily: "Tahoma"}}
                                      onClick={this.btnUpdatePosition_onClick}
                                    >
                                      ذخیره تغییرات
                                    </Button>
                                  </Col>      
                              }                
                            </Row>
                            <Row>
                              <Col>
                                <p
                                  id="ErrorUpdatePosition"
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
        لیست سمت ها
    </Label>
  </Row>

  <Row>
        <Row className="standardPadding">                    
          <DataGrid
              dataSource={this.state.PositionGridData}
              defaultColumns={DataGridPositionColumns}
              showBorders={true}
              rtlEnabled={true}
              allowColumnResizing={true}
              onRowClick={this.grdPosition_onClickRow}                                            
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
        )
    }
}
const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(Position);
