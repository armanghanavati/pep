import React from 'react';
import { connect } from "react-redux";
import {    
    Row,
    Col, 
    Card, 
    Label,
    TabContent, TabPane, Nav, NavItem, NavLink,  
    Modal, ModalHeader, ModalBody, ModalFooter 
} from 'reactstrap';
import classnames from 'classnames';
import TextBox from 'devextreme-react/text-box';
import TextArea from 'devextreme-react/text-area';
import SelectBox from 'devextreme-react/select-box';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import { Toast } from 'devextreme-react/toast';
import { Tooltip } from 'devextreme-react/tooltip';
import DataGrid, {
    Column, Editing, Paging, Lookup, Scrolling,
    FilterRow,
    HeaderFilter,
    FilterPanel,    
    Pager,  
} from 'devextreme-react/data-grid';
import { DataGridPageSizes,DataGridDefaultPageSize
        ,DataGridDefaultHeight 
        ,ToastTime
        ,ToastWidth
    } from '../../config/config';
import { DataGridTicketcolumns } from './Ticket-Config';
import { 
    fetchSubjectData,
    RegisterNewTicket,
    getAllUserInsertTicket,
    getTicketDetail,
    updateTicket,
} from '../../redux/reducers/ticket/ticket-actions';
import { UploadFiles,AttachmentList } from '../../redux/reducers/Attachments/attachment-action';
import { ticketActions } from '../../redux/reducers/ticket/ticket-slice';
import { ticketSubjectActions } from '../../redux/reducers/ticketSubject/ticketSubject-slice';
import { ticketPriorityActions } from '../../redux/reducers/ticketPriority/ticketPriority-slice';
import { fetchTicketSubjectData } from '../../redux/reducers/ticketSubject/ticketSubject-actions';
import { fetchTicketPriorityData } from '../../redux/reducers/ticketPriority/ticketPriority-actions';

import DoneIcon from '../../assets/images/icon/done.png';
import RejectIcon from '../../assets/images/icon/reject.png'
import SandTimer from '../../assets/images/icon/sandtimer.png' 
import RegisterComment from '../../assets/images/icon/register_comment.png' 
import attachment from '../../assets/images/attachment.png'


const renderContent = () => {
    return (
        <p>فایل پیوست</p>
    );
}
const notesLabel = { 'aria-label': 'Notes' };

class Ticket extends React.Component {
    constructor(props) {
      super(props);
      this.state={
        txtTilteValue:null,
        txtDescValue:null,
        cmbTicketSubjectValue:null,
        cmbTicketPriorityValue:null,
        AllTickets:null,
        grdTickets:null,        
        activeTab:null,
        stateModalNewTicket:false,
        TicketDetail:[],
        stateModalTicketDetail:false,
        TicketId:null,
        txtCommnetValue:null,     
        UserIdInsertd:null,
        TicketData:null  ,        
        ToastProps:{
            isToastVisible:false,
            Message:"",
            Type:"",
        },
        AttachedFiles: null, 
        Attachments:null,
        stateModalAttachment:false,
        errTicketAttached:'',
      }
    }

    async componentDidMount(){     
        const rtnAllTicket=await this.fn_LoadAllTickets();        
        await this.fn_TicketPriorityData();
        await this.fn_TicketSubjectData();           
        this.tabTickets_onChange('1',rtnAllTicket)
    }

    fn_showNotifyMessage = (msg,typeNotify) => {
        notify(
            {
                message: msg, 
                width: 230,
                position: {
                    at: "bottom",
                    my: "bottom",
                    of: "#container"
                }
            }, 
            // types[Math.floor(Math.random() * 4)], 
            typeNotify, 
            1000
        );
    }


    fn_LoadAllTickets=async()=>{        
        const rtn=await getAllUserInsertTicket(this.props.User.userId,"ffd");
        this.setState({
            AllTickets:rtn
        })        
        return rtn;
    }

    fn_TicketPriorityData= async () =>{
        const ticketPriority=await fetchTicketPriorityData();
        this.props.dispatch(ticketPriorityActions.setTicketPriority({
            ticketPriority
        }))
    }
    fn_TicketSubjectData= async () =>{
        const ticketSubjects=await fetchTicketSubjectData();
        this.props.dispatch(ticketSubjectActions.setTicketSubjects({
            ticketSubjects                     
          }));  
    }

    txtSubject_onChanege=(e)=>{
        this.setState({txtTilteValue:e.value})
    }

    txtDesc_onChange=(e)=>{
        this.setState({txtDescValue:e.value})
    }    

    cmbTicketPriority_onChange=(e)=>{
        this.setState({cmbTicketPriorityValue:e})
    }

    cmbTicketSubject_onChange=(e)=>{
        this.setState({cmbTicketSubjectValue:e})
    }
        
    btnRgisterTicket_onClick=async(e)=>{
        const obj={
            parentId:null,            
            title:this.state.txtTilteValue,
            ticketSubjectId: this.state.cmbTicketSubjectValue,
            TicketStatusId: 1,
            ticketPriorityId: this.state.cmbTicketPriorityValue,
            // insertDate:null,
            desc:this.state.txtDescValue,                       
            applicationUserId: this.props.User.userId
        }
        var result=await RegisterNewTicket(obj,"kjhkjh");
        const rtnAllTicket=await this.fn_LoadAllTickets();        
        this.setState({
            stateModalNewTicket:false,
            ToastProps:{  
                isToastVisible:true,              
                Message:"تیکت جدید ثبت گردید.",
                Type:"success",
            }
        })

        if(result!=null){
            const attachObj={
                AttachedFile:this.state.AttachedFiles,
                AttachmentId:result.id,
                AttachmentType:"tc",
                AttachmentName:"ticket"
            }
            this.state.AttachedFiles && await UploadFiles(attachObj,this.props.User.token);
        }

        await this.fn_UpdateGrids(rtnAllTicket,'1');
        
    }

    
    grdTicket_onClick= async (e)=>{    
        // alert(e.data.id)    
        // alert(JSON.stringify(e.data))        
        const tickectDetail=await getTicketDetail(e.data.id);
        const obj={
            AttachmentId:e.data.id
        }        
        this.setState({Attachments:await AttachmentList(obj,this.props.User.token)})
        this.setState({
            stateModalTicketDetail:true,
            TicketDetail: tickectDetail== null ? [] : tickectDetail,
            TicketId:e.data.id,
            TicketData:e.data,
            UserIdInsertd:e.data.applicationUserId,
        })
    }

    fn_UpdateGrids=async(AllTicket,tab) =>{
        const tempAllTickets=AllTicket;
        console.log('ALLLLLLL='+JSON.stringify(tempAllTickets));
        let tempTicket=[];
        for(let i=0;i<tempAllTickets.length;i++)
            if(tempAllTickets[i].ticketStatusCode==tab)
                tempTicket.push(tempAllTickets[i]);                   
        console.log('NEW GRD='+JSON.stringify(tempTicket));
        this.setState({grdTickets:tempTicket})  
    }

    tabTickets_onChange=async(tab,AllTicket)=> {
        if (this.state.activeTab !== tab) {                        
            this.setState({
              activeTab: tab
            });                 
        }   
        
        await this.fn_UpdateGrids(AllTicket,tab)        
    }
    

    btnNewTicket_onClick=()=>{   
        this.setState({stateModalNewTicket:true})
    }
    ModalNewTicket_onClickAway=()=>{
        this.setState({stateModalNewTicket:false})
    }

    ModalTicketDetail_onClickAway=()=>{
        this.setState({stateModalTicketDetail:false,})
    }
    ModalAttachment_onClickAway=()=>{
        this.setState({stateModalAttachment:false,})
    }

    txtTciketComment_onChange=(e)=>{
        this.setState({txtCommnetValue:e.value})
    }

    btnRegisterCommet_onClick=async()=>{                
        const obj={
            parentId:this.state.TicketId,            
            title:"",
            ticketSubjectId: null,
            TicketStatusId: null,
            ticketPriorityId: null,            
            desc:this.state.txtCommnetValue,                       
            applicationUserId: this.props.User.userId
        }
        // alert(JSON.stringify(obj))
        const NewCommnet=await RegisterNewTicket(obj,"kjhkjh");

        const tempTicketDetial=this.state.TicketDetail;
        tempTicketDetial.push(NewCommnet);
        this.setState({
            tickectDetail:tempTicketDetial,
            ToastProps:{
                isToastVisible:true,
                Message:"نظر شما با موفقیت درج گردید.",
                Type:"info",
            }
        })

        await this.fn_LoadAllTickets();
    }

    btnStartTicket_onClick = async ()=>{                
        const obj={
            ticketId: this.state.TicketId,
            ticketStatusId :3
                      
        }
        this.setState({            
            ToastProps:{  
                isToastVisible:true,              
                Message:"وضعیت تیکت به در حال انجام تغییر یافت.",
                Type:"success",
            }
        })

        updateTicket(obj,"sd");
    }

    btnDoneTicket_onClick = async()=>{
        const obj={
            ticketId: this.state.TicketId,
            ticketStatusId :2
                      
        }
        this.setState({            
            ToastProps:{  
                isToastVisible:true,              
                Message:"وضعیت تیکت به انجام شده تغییر یافت.",
                Type:"success",
            }
        })
        updateTicket(obj,"sd");
    }

    btnRejectTicket_onClick =()=>{
        const obj={
            ticketId: this.state.TicketId,
            ticketStatusId :4
                      
        }
        this.setState({  
            ToastProps:{  
                isToastVisible:true,              
                Message:"وضعیت تیکت به رد شده تغییر یافت.",
                Type:"success",
            }
        })
        updateTicket(obj,"sd");
    }

    onHidingToast=()=>{
        this.setState({ToastProps:{isToastVisible:false}})
    }

    async attachmentList(attachId){
        const url=window.apiAddress+"/Ticket/attachmentList?attachId=" + attachId  
        const Token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJqdGkiOiJjMmZiMjJiYS02MjRkLTQ2NmUtYWNlNC02Zjc5N2M5ZTE1ZDEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbmlzdHJhdG9yIiwiZXhwIjoxNjg4NTY4ODQ1LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxMzkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxMzkifQ.W7Ao-K7bzjXA8T7d-TcGDy-C0YE-yMu0H9Xqkjd5HKo";     
        const response = await fetch(
         url,
            {
                method: "GET",              
                headers: { 
                    'Authorization': `Bearer ${Token}`
                },   
            }
            
        );        
        const result= await response.json();
        console.log(JSON.stringify(result.data));
        return result.data;
    }

    setFile=(e)=> {  
        let errMsg="";        
        var files=[]; 
        for(let i=0; i<e.target.files.length; i++){
             if(e.target.files[i].size > 5000000)
                 errMsg+="فایل" + e.target.files[i].name + "بیشتر از 5 مگابایت است." + "<br>"
             else{
                files.push(e.target.files[i]);
             }      
        }       
        document.getElementById("ErrTicketAttachments").innerHTML = errMsg; 
        this.setState({ 
            AttachedFiles: files ,            
        });     
    }

    //  addMenuItems=(e)=>{
    //     if (e.target == 'header') {
    //         // e.items can be undefined
    //         if (!e.items) e.items = [];
 
    //         // Add a custom menu item
    //         e.items.push({
    //             text: 'Log Column Caption',
    //             onItemClick: () => {
    //                 console.log(e.column.caption);
    //             }
    //         });
    //     }
    //     if (e.target === "content") {
    //         e.items = [{
    //             text: "نمایش ضمایم",
    //             onItemClick: async ()=>{
    //                 //e.component.editRow(e.row.rowIndex);
    //                 console.log(e.row.data.id);
    //                 this.setState({stateModalAttachment:true,})
    //                 var result= await this.attachmentList(e.row.data.id);
    //                 this.setState({
    //                     attachment:result
    //                 });     
    //             }
    //         },
    //         {
    //             text: "ویرایش",
    //             onItemClick: function () {
    //                 //e.component.addRow();
    //             }
    //         },
    //         {
    //             text: "حذف",
    //             onItemClick: function () {
    //                 //e.component.deleteRow(e.row.rowIndex);
    //             }
    //         }];
    //     }
    // }
    
    render(){    
        // const  fileName=[];
        // if(this.state.file != null)  {
        //     for(let i=0; i<this.state.file.length; i++){
        //         fileName.push(this.state.file[i].name);
        //     }
        // };   

        return(
            <div className='standardMargin'>
                <Toast
                    visible={this.state.ToastProps.isToastVisible}
                    message={this.state.ToastProps.Message}
                    type={this.state.ToastProps.Type}
                    onHiding={this.onHidingToast}
                    displayTime={ToastTime}
                    width={ToastWidth}
                    rtlEnabled={true}
                />                  

                <Row className="text-center">
                    <Col>
                        <Modal style={{direction:'rtl'}} 
                            isOpen={this.state.stateModalAttachment} 
                            toggle={this.ModalAttachment_onClickAway} 
                            centered={true}
                            size="lg"
                        >
                            <ModalHeader  toggle={this.ModalNewTicket_onClickAway} >
                                فایل ضمیمه
                            </ModalHeader>
                            <ModalBody>
                                <Row className="standardPadding" style={{overflowY:'scroll',maxHeight:'450px',background:'#ffcdcd'}}>
                                            {this.state.attachment && this.state.attachment.map((item,key)=> 
                                        
                                                <Card className="shadow bg-white border pointer" key={key}>
                                                    <Row className="standardPadding">
                                                        <Col xs='auto'>
                                                            {(item.ext.toLowerCase() == ".jpg" || item.ext.toLowerCase() == ".png" || item.ext.toLowerCase() == ".jpeg") &&  
                                                                <img src={window.siteAddress + "/" + item.attachType + "/" + item.fileName + item.ext} style={{width:"100px", height:"100px"}}/>
                                                            }
                                                            <p><a href={window.siteAddress + "/" + item.attachType + "/" + item.fileName + item.ext} target="_blank">دانلود فایل {item.ext}</a></p>
                                                        </Col>
                                                    </Row>                                             
                                                </Card>                                  
                                            )}                                                                                 
                                </Row>
                            </ModalBody>
                        </Modal>
                    </Col>
                    <Col>
                        <Modal style={{direction:'rtl'}} 
                            isOpen={this.state.stateModalTicketDetail} 
                            toggle={this.ModalTicketDetail_onClickAway} 
                            centered={true}
                            size="lg"
                        >
                            <ModalHeader  toggle={this.ModalNewTicket_onClickAway} >
                                پاسخ ها
                            </ModalHeader>
                            <ModalBody>
                                {this.state.TicketData!=null && (
                                    <>                                                                            
                                        <Row className="standardPadding">                                        
                                            <Col xs='auto'>شماره تیکت : {this.state.TicketData.id}</Col>
                                            <Col xs='auto'>کاربر درخواست دهنده : {this.state.TicketData.userName}</Col>
                                            <Col xs='auto'>تاریخ ثبت : {this.state.TicketData.persianDate}</Col>
                                        </Row>                                    
                                        <Row className="standardPadding">
                                            <Col xs='auto'>موضوع : {this.state.TicketData.ticketSubjectDesc}</Col>
                                            <Col xs='auto'>وضعیت : {this.state.TicketData.ticketStatusDesc}</Col>
                                            <Col xs='auto'>اولویت : {this.state.TicketData.ticketPriorityDesc}</Col>
                                        </Row>
                                        <Row className="standardPadding">                                        
                                            <Col xs='auto'>عنوان : {this.state.TicketData.title}</Col>                                            
                                        </Row>
                                        <Row className="standardPadding">                                        
                                            <Col>
                                                توضیحات : {this.state.TicketData.desc}                                                
                                            </Col>
                                        </Row>
                                    
                                        <Row className="standardPadding" style={{overflowY:'scroll',maxHeight:'250px'}}>
                                            {this.state.Attachments!=null && this.state.Attachments.map((item,key)=>                                                     
                                                <Card className="shadow bg-white border pointer" key={key}>
                                                    <Row>
                                                        <Col xs='auto'>
                                                            {(item.ext.toLowerCase() == ".jpg" || item.ext.toLowerCase() == ".png" || item.ext.toLowerCase() == ".jpeg") &&  
                                                                <img src={window.siteAddress + "/" + item.attachmentType + "/" + item.fileName + item.ext} style={{width:"100px", height:"100px"}}/>
                                                            }
                                                            <p><a href={window.siteAddress + "/" + item.attachmentType + "/" + item.fileName + item.ext} target="_blank">دانلود {item.fileName.split("_")[0]}{item.ext}</a></p>
                                                        </Col>
                                                    </Row>                                             
                                                </Card>                                                                                  
                                            )} 
                                        </Row>                                                                                                                            
                                    </>                                    
                                )}
                                <Row className="standardPadding" style={{overflowY:'scroll',maxHeight:'450px',background:'#ffcdcd'}}>
                                    {this.state.TicketDetail.map((item,key)=> 
                                    
                                            <Card className="shadow bg-white border pointer">
                                                <Row className="standardPadding">
                                                    <Col xs='auto'>توضیحات: {item.desc}</Col>
                                                </Row>
                                                <Row className="standardPadding">
                                                    <Col xs="auto">نام کاربری: {item.userName}</Col>
                                                    <Col xs='auto'>تاریخ ثبت: {item.persianDate}</Col>    
                                                </Row>                                                
                                            </Card>                                
                                    )}                                                                                
                                </Row>                                              
                                <Row className="standardPadding">
                                    <Col>
                                        <Label className="standardLabelFont">توضیحات</Label>       
                                        <TextArea
                                            height={100}                                    
                                            defaultValue={this.state.txtCommnetValue}
                                            inputAttr={notesLabel}
                                            autoResizeEnabled={true} 
                                            onValueChanged={this.txtTciketComment_onChange}
                                        />                                                
                                    </Col>
                                </Row>
                                <Row className="standardPadding">
                                    <Col xs="auto">
                                        <Button
                                            icon={RegisterComment}
                                            text="ثبت پاسخ"
                                            type="default"
                                            stylingMode="contained"
                                            rtlEnabled={true}
                                            onClick={this.btnRegisterCommet_onClick}
                                        />
                                    </Col>                                    
                                    {this.state.UserIdInsertd != this.props.User.userId && (<>
                                                                                                <Col xs="auto">
                                                                                                    <Button                                                                                                        
                                                                                                        icon={SandTimer}                                                                                                    
                                                                                                        text="شروع"
                                                                                                        type="success"
                                                                                                        stylingMode="contained"
                                                                                                        rtlEnabled={true}
                                                                                                        onClick={this.btnStartTicket_onClick}
                                                                                                    />
                                                                                                </Col>
                                                                                                <Col xs="auto">
                                                                                                    <Button
                                                                                                        icon={DoneIcon}
                                                                                                        text="انجام شد"
                                                                                                        type="success"
                                                                                                        stylingMode="contained"
                                                                                                        rtlEnabled={true}
                                                                                                        onClick={this.btnDoneTicket_onClick}
                                                                                                    />
                                                                                                </Col>
                                                                                                <Col xs="auto">
                                                                                                    <Button
                                                                                                        icon={RejectIcon}
                                                                                                        text="رد کردن"
                                                                                                        type="danger"
                                                                                                        stylingMode="contained"
                                                                                                        rtlEnabled={true}
                                                                                                        onClick={this.btnRejectTicket_onClick}
                                                                                                    />
                                                                                                </Col>   
                                                                                            </>                         
                                                                                        )}
                                </Row> 
                            </ModalBody>
                        </Modal>
                    </Col>
                <Col style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Modal style={{direction:'rtl'}} 
                        isOpen={this.state.stateModalNewTicket} 
                        toggle={this.ModalNewTicket_onClickAway} 
                        centered={true}
                        size="lg"
                    >
                        <ModalHeader  toggle={this.ModalNewTicket_onClickAway} >
                            تیکت جدید
                        </ModalHeader>
                        <ModalBody>
                            <Row className="standardPadding">                       
                                <Col>
                                    <Label className="standardLabelFont">عنوان</Label>                            
                                    <TextBox 
                                        defaultValue={this.state.txtTilteValue}                                
                                        showClearButton={true}
                                        placeholder="عنوان"
                                        rtlEnabled={true}
                                        valueChangeEvent="keyup"
                                        onValueChanged={this.txtSubject_onChanege}                                 
                                    />
                                </Col>
                                <Col>
                                    <Label className="standardLabelFont">موضوع</Label>                            
                                    <SelectBox 
                                        dataSource={this.props.TicketSubject.ticketSubjects}
                                        displayExpr="subject"    
                                        placeholder="انتخاب موضوع"                            
                                        valueExpr="id"
                                        searchEnabled={true}
                                        rtlEnabled={true}        
                                        on                        
                                        onValueChange={this.cmbTicketSubject_onChange}
                                    />
                                </Col>
                                <Col>
                                    <Label className="standardLabelFont">اولویت</Label>                            
                                    <SelectBox 
                                        dataSource={this.props.TicketPriority.ticketPriority}
                                        displayExpr="title"    
                                        placeholder="انتخاب اولویت"                            
                                        valueExpr="id"
                                        rtlEnabled={true}                                
                                        onValueChange={this.cmbTicketPriority_onChange}
                                    />
                                </Col>
                            </Row>
                                        
                            <Row className="standardPadding">
                                <Col>
                                    <Label className="standardLabelFont">توضیحات</Label>       
                                    <TextArea
                                        height={200}                                    
                                        defaultValue={this.state.txtDescValue}
                                        inputAttr={notesLabel}
                                        autoResizeEnabled={true} 
                                        onValueChanged={this.txtDesc_onChange}
                                    />                                                
                                </Col>
                            </Row>
                            <Row className="standardPadding">
                                <Col xs="auto">
                                    <Button
                                        // width={120}
                                        text="ثبت تیکت"
                                        type="default"
                                        stylingMode="contained"
                                        onClick={this.btnRgisterTicket_onClick}
                                    />
                                </Col>
                                <Col xs="auto">                    
                                    <label for="file-input">     
                                        <Button
                                        id="btnAttachment"
                                            icon={attachment}
                                            stylingMode="contained"
                                            rtlEnabled={true}
                                            width={100}
                                        />
                                        <Tooltip
                                            target="#btnAttachment"
                                            showEvent="dxhoverstart"
                                            hideEvent="dxhoverend"
                                            contentRender={renderContent}
                                        />
                                    </label>

                                    {this.state.AttachedFiles && this.state.AttachedFiles.map((item, key)=>
                                       <Col>{item.name}</Col>
                                    )}
                                    <input id="file-input" type="file" multiple style={{display:"none"}} onChange={e=>this.setFile(e)}/>
                                    <p id="ErrTicketAttachments" style={{ textAlign: "right", color: "red" }}></p>
                                </Col>                             
                            </Row>                                         
                        </ModalBody>                    
                    </Modal>                
                </Col>     
                </Row>        
                    <Card className="shadow bg-white border pointer">  
                        <Row className="standardPadding">
                            <Col xs='auto'>
                                <Button                            
                                    text="تیکت جدید"
                                    type="default"
                                    stylingMode="contained"
                                    onClick={this.btnNewTicket_onClick}
                                />
                            </Col>
                        </Row>
                        <Row className="standardPadding">
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.tabTickets_onChange('1',this.state.AllTickets); }}
                                        >
                                    ثبت شده
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '3' })}
                                        onClick={() => { this.tabTickets_onChange('3',this.state.AllTickets); }}
                                        >
                                    درحال انجام
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '2' })}
                                        onClick={() => { this.tabTickets_onChange('2',this.state.AllTickets); }}
                                        >
                                    انجام شده
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '4' })}
                                        onClick={() => { this.tabTickets_onChange('4',this.state.AllTickets); }}
                                        >
                                    بایگانی شده 
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    <Row className="standardPadding">
                                        <DataGrid
                                            dataSource={this.state.grdTickets}
                                            defaultColumns={DataGridTicketcolumns}
                                            showBorders={true}
                                            rtlEnabled={true}
                                            allowColumnResizing={true}
                                            onRowClick={this.grdTicket_onClick}                                            
                                            height={DataGridDefaultHeight}
                                        >
                                            <Scrolling rowRenderingMode="virtual"
                                                showScrollbar="always"
                                                columnRenderingMode="virtual"
                                            />
                                            <Editing
                                                mode="cell"
                                                allowUpdating={true}
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
                                            <HeaderFilter visible={true} />
                                        </DataGrid>
                                    </Row>          
                                </TabPane>
                                <TabPane tabId="2">
                                    <Row className="standardPadding">
                                        <DataGrid
                                            dataSource={this.state.grdTickets}
                                            defaultColumns={DataGridTicketcolumns}
                                            showBorders={true}
                                            rtlEnabled={true}
                                            allowColumnResizing={true}
                                            onRowClick={this.grdTicket_onClick}                                            
                                            height={DataGridDefaultHeight}
                                        >
                                            <Scrolling rowRenderingMode="virtual"
                                                showScrollbar="always"
                                                columnRenderingMode="virtual"
                                            />
                                            <Editing
                                                mode="cell"
                                                allowUpdating={true}
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
                                            <HeaderFilter visible={true} />
                                        </DataGrid>
                                    </Row> 
                                </TabPane>
                                <TabPane tabId="3">
                                    <Row className="standardPadding">
                                        <DataGrid
                                            dataSource={this.state.grdTickets}
                                            defaultColumns={DataGridTicketcolumns}
                                            showBorders={true}
                                            rtlEnabled={true}
                                            allowColumnResizing={true}
                                            onRowClick={this.grdTicket_onClick}                                        
                                            height={DataGridDefaultHeight}
                                        >
                                            <Scrolling rowRenderingMode="virtual"
                                                showScrollbar="always"
                                                columnRenderingMode="virtual"
                                            />
                                            <Editing
                                                mode="cell"
                                                allowUpdating={true}
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
                                            <HeaderFilter visible={true} />
                                        </DataGrid>
                                    </Row> 
                                </TabPane>
                                <TabPane tabId="4">
                                    <Row className="standardPadding">
                                        <DataGrid
                                            dataSource={this.state.grdTickets}
                                            defaultColumns={DataGridTicketcolumns}
                                            showBorders={true}
                                            rtlEnabled={true}
                                            allowColumnResizing={true}
                                            onRowClick={this.grdTicket_onClick}                                            
                                            height={DataGridDefaultHeight}
                                        >
                                            <Scrolling rowRenderingMode="virtual"
                                                showScrollbar="always"
                                                columnRenderingMode="virtual"
                                            />
                                            <Editing
                                                mode="cell"
                                                allowUpdating={true}
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
                                            <HeaderFilter visible={true} />
                                        </DataGrid>
                                    </Row> 
                                </TabPane>
                            </TabContent>                          
                        </Row>                                                                                                            
                </Card>                
            </div>
        )
    }
}

const mapStateToProps=(state)=>({  
    User:state.users,
    Ticket:state.ticket,
    TicketSubject:state.ticketSubjects,
    TicketPriority: state.ticketPriority,
});

export default connect(mapStateToProps)(Ticket);