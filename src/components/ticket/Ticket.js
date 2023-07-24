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
    getTicketExecuters,
} from '../../redux/reducers/ticket/ticket-actions';
import { UploadFiles,AttachmentList } from '../../redux/reducers/Attachments/attachment-action';
import { ticketActions } from '../../redux/reducers/ticket/ticket-slice';
import { ticketSubjectActions } from '../../redux/reducers/ticketSubject/ticketSubject-slice';
import { ticketPriorityActions } from '../../redux/reducers/ticketPriority/ticketPriority-slice';
import { fetchTicketSubjectData } from '../../redux/reducers/ticketSubject/ticketSubject-actions';
import { fetchTicketPriorityData } from '../../redux/reducers/ticketPriority/ticketPriority-actions';

import DoneIcon from '../../assets/images/icon/done.png';
import RejectIcon from '../../assets/images/icon/reject.png'
import SendTimerIcon from '../../assets/images/icon/sandtimer.png' 
import RegisterCommentIcon from '../../assets/images/icon/register_comment.png' 
import AttachmentIcon from '../../assets/images/icon/attachment.png'
import CommentAttachmentIcon from '../../assets/images/icon/comment_attachment.png'

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
        UserNameExec:null,
        UserIdExec:null,
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
        AttachedCommentFiles:null,
        commentAttachment:null,
        stateModalCommentAttachment:false,
        errTicketCommentAttached:'',
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
        const allTicketSubjects=await fetchTicketSubjectData();
        let parentTicketSubjects=[];   
        allTicketSubjects.forEach((item)=>{
            if(item.parentId==null)
                parentTicketSubjects.push(item);           
        });

        console.log('kkkkkkkkkkkkkkkkkkkkkkkkkk='+JSON.stringify(parentTicketSubjects))

        this.props.dispatch(            
            ticketSubjectActions.setAllTicketSubjects({
                allTicketSubjects                     
            }),                
        );          

        this.props.dispatch(                        
            ticketSubjectActions.setTicketSubjectParents({
                parentTicketSubjects                
            })           
        ); 
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

    cmbTicketSubjectParent_onChange=(e)=>{
        const tempall=this.props.TicketSubject.allTicketSubjects
        let childTicketSubjects=[]
        tempall.forEach((item)=>{
            if(e==item.parentId)
                childTicketSubjects.push(item);
        });
        this.props.dispatch(
            ticketSubjectActions.setTicketSubjectChilds({
                childTicketSubjects
            })
        )
    }

    cmbTicketSubject_onChange=(e)=>{
        this.setState({cmbTicketSubjectValue:e})
    }
        
    btnRgisterTicket_onClick=async(e)=>{
        let errMsg="";
        let flag=true;
        document.getElementById("errTicketTitle").innerHTML = "";
        document.getElementById("errTicketSubject").innerHTML = "";
        document.getElementById("errTicketPriority").innerHTML = "";
        document.getElementById("errTicketDesc").innerHTML = "";
        if(this.state.txtTilteValue==null){            
            document.getElementById("errTicketTitle").innerHTML = "عنوان تیکت را مشخص نمائید."; 
            flag=false;
        }

        if(this.state.cmbTicketSubjectValue==null){            
            document.getElementById("errTicketSubject").innerHTML = "موضوع تیکت را انتخاب نمائید."; 
            flag=false;
        }

        if(this.state.cmbTicketPriorityValue==null){            
            document.getElementById("errTicketPriority").innerHTML = "اولویت تیکت را انتخاب نمائید."; 
            flag=false;
        }

        if(this.state.txtDescValue==null){            
            document.getElementById("errTicketDesc").innerHTML = "توضیحات تیکت را مشخص نمائید."; 
            flag=false;
        }

        if(flag){
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
            // alert(JSON.stringify(obj))
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
    }

    
    grdTicket_onClick= async (e)=>{    
        // alert(e.data.id)    
        // alert(JSON.stringify(e.data))   
        const objStatus={
            ticketId: e.data.id,
            ticketStatusId :5             
        }  
        const ticketExecuters= await getTicketExecuters(e.data.id);
        // const test=ticketExecuters.find(field=>field.userIdExec==this.props.User.userId).userIdExec;
        let tempUserNameExec=null;
        let tempUserIdExec=null;
        for(let i=0;i<ticketExecuters.length;i++)
            if(ticketExecuters[i].userIdExec==this.props.User.userId){
                tempUserNameExec=ticketExecuters[i].userNameExec;
                tempUserIdExec=ticketExecuters[i].userIdExec;
                break;                
            }

        
        if(this.props.User.userId == tempUserIdExec && e.data.ticketStatusId == 1){
            await updateTicket(objStatus,"sd");
            const rtnAllTicket= await this.fn_LoadAllTickets();                               
        }
             
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
            UserNameExec:tempUserNameExec,
            UserIdExec:tempUserIdExec,
        })
    }

    fn_UpdateGrids=async(AllTicket,tab) =>{
        const tempAllTickets=AllTicket;        
        let tempTicket=[];
        for(let i=0;i<tempAllTickets.length;i++)                            
            if(tab ==1 && (tempAllTickets[i].ticketStatusCode == 1 || tempAllTickets[i].ticketStatusCode == 5))
                tempTicket.push(tempAllTickets[i]);
            else if(tempAllTickets[i].ticketStatusCode==tab)
                tempTicket.push(tempAllTickets[i]);           
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

        if(NewCommnet!=null){
            const attachObj={
                AttachedFile:this.state.AttachedCommentFiles,
                AttachmentId:NewCommnet.id,
                AttachmentType:"tc",
                AttachmentName:"ticket"
            }
            this.state.AttachedCommentFiles && await UploadFiles(attachObj,this.props.User.token);
        }

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

        await updateTicket(obj,"sd");
        const rtnAllTicket=await this.fn_LoadAllTickets();                   
        this.tabTickets_onChange('3',rtnAllTicket)
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
        await updateTicket(obj,"sd");
        const rtnAllTicket=await this.fn_LoadAllTickets();                   
        this.tabTickets_onChange('2',rtnAllTicket)
    }

    btnRejectTicket_onClick = async ()=>{
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
        await updateTicket(obj,"sd");
        const rtnAllTicket=await this.fn_LoadAllTickets();                   
        this.tabTickets_onChange('4',rtnAllTicket)
    }

    onHidingToast=()=>{
        this.setState({ToastProps:{isToastVisible:false}})
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

    setCommentFile=(e)=> {  
        let errMsg="";        
        var commentfiles=[]; 
        for(let i=0; i<e.target.files.length; i++){
             if(e.target.files[i].size > 5000000)
                 errMsg+="فایل" + e.target.files[i].name + "بیشتر از 5 مگابایت است." + "<br>"
             else{
                commentfiles.push(e.target.files[i]);
             }      
        }       
        document.getElementById("ErrCommentTicketAttachments").innerHTML = errMsg; 
        this.setState({ 
            AttachedCommentFiles: commentfiles ,            
        });     
    }

    ModalCommentAttachment_onClickAway=()=>{
        this.setState({stateModalCommentAttachment:false,})
    }

    async btnShowAttachmentsTicketComment_onClick(CommentId){
        const obj={
            AttachmentId:CommentId
        } 
        this.setState({commentAttachment:await AttachmentList(obj,this.props.User.token)});
        this.setState({
            stateModalCommentAttachment:true
        })
    }
    
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
                            isOpen={this.state.stateModalCommentAttachment} 
                            toggle={this.ModalCommentAttachment_onClickAway} 
                            centered={true}
                            size="lg"
                        >
                            <ModalHeader  toggle={this.ModalCommentAttachment_onClickAway} >
                                فایل های ضمیمه
                            </ModalHeader>
                            <ModalBody>
                                <Row className="standardPadding" style={{overflowY:'scroll',maxHeight:'450px',background:'#ffcdcd'}}>
                                            {this.state.commentAttachment && this.state.commentAttachment.map((item,key)=> 
                                        
                                                <Card className="shadow bg-white border pointer" key={key}>
                                                    <Row className="standardPadding">
                                                        <Col xs='auto'>
                                                            {(item.ext.toLowerCase() == ".jpg" || item.ext.toLowerCase() == ".png" || item.ext.toLowerCase() == ".jpeg" || item.ext.toLowerCase() == ".ico") &&  
                                                                <img src={window.siteAddress + "/" + item.attachmentType + "/" + item.fileName + item.ext} style={{width:"100px", height:"100px"}}/>
                                                            }
                                                            <p><a href={window.siteAddress + "/" + item.attachmentType + "/" + item.fileName + item.ext} target="_blank">دانلود فایل {item.ext}</a></p>
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
                            <ModalHeader  toggle={this.ModalTicketDetail_onClickAway} >
                                پاسخ ها
                            </ModalHeader>
                            <ModalBody>
                                {this.state.TicketData!=null && (
                                    <>                                                                            
                                        <Row className="standardPadding">                                        
                                            <Col xs='auto'>شماره تیکت : {this.state.TicketData.id}</Col>
                                            <Col xs='auto'>کاربر درخواست دهنده : {this.state.TicketData.userNameInserted}</Col>
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
                                                    <Col  style={{direction:'ltr'}}>
                                                        <Button                                                            
                                                            icon={AttachmentIcon}
                                                            // type="default"
                                                            stylingMode="contained"
                                                            rtlEnabled={true}
                                                            onClick={()=>this.btnShowAttachmentsTicketComment_onClick(item.id)}
                                                        />
                                                    </Col>  
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
                                            icon={RegisterCommentIcon}
                                            text="ثبت پاسخ"
                                            type="default"
                                            stylingMode="contained"
                                            rtlEnabled={true}
                                            onClick={this.btnRegisterCommet_onClick}
                                        />
                                    </Col>    
                                    <Col xs="auto">
                                        <label for="file-AttachmentComment">   
                                            <Button                                            
                                                icon={AttachmentIcon}
                                                text="پیوست فایل"
                                                type="default"
                                                stylingMode="outlined"
                                                rtlEnabled={true}                                            
                                            />   
                                        </label>
                                        {this.state.AttachedCommentFiles && this.state.AttachedCommentFiles.map((item, key)=>
                                            <Col>{item.name}</Col>
                                        )}
                                        <input id="file-AttachmentComment" type="file" multiple style={{display:"none"}} onChange={e=>this.setCommentFile(e)}/>
                                        <p id="ErrCommentTicketAttachments" style={{ textAlign: "right", color: "red" }}></p> 
                                    </Col>      
                                                              
                                    {this.state.UserIdExec == this.props.User.userId && (<>
                                                                                                <Col xs="auto">
                                                                                                    <Button                                                                                                        
                                                                                                        icon={SendTimerIcon}                                                                                                    
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
                                    <Label id="errTicketTitle" className="standardLabelFont errMessage" />
                                </Col>
                                <Col>
                                    <Label className="standardLabelFont">بخش</Label>                            
                                    <SelectBox 
                                        dataSource={this.props.TicketSubject.parentTicketSubjects}
                                        displayExpr="subject"    
                                        placeholder="انتخاب بخش"                            
                                        valueExpr="id"
                                        searchEnabled={true}
                                        rtlEnabled={true}        
                                        on                        
                                        onValueChange={this.cmbTicketSubjectParent_onChange}
                                    />
                                </Col>
                                <Col>
                                    <Label className="standardLabelFont">موضوع</Label>                            
                                    <SelectBox 
                                        dataSource={this.props.TicketSubject.childTicketSubjects}
                                        displayExpr="subject"    
                                        placeholder="انتخاب موضوع"                            
                                        valueExpr="id"
                                        searchEnabled={true}
                                        rtlEnabled={true}        
                                        on                        
                                        onValueChange={this.cmbTicketSubject_onChange}
                                    />
                                    <Label id="errTicketSubject" className="standardLabelFont errMessage" />
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
                                    <Label id="errTicketPriority" className="standardLabelFont errMessage" />
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
                                    <Label id="errTicketDesc" className="standardLabelFont errMessage" />                          
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
                                    <label for="file-TicketAttachment">     
                                        <Button                                            
                                            icon={AttachmentIcon}
                                            text="پیوست فایل"
                                            type="default"
                                            stylingMode="outlined"
                                            rtlEnabled={true}                                            
                                        />                                     
                                    </label>

                                    {this.state.AttachedFiles && this.state.AttachedFiles.map((item, key)=>
                                       <Col>{item.name}</Col>
                                    )}
                                    <input id="file-TicketAttachment" type="file" multiple style={{display:"none"}} onChange={e=>this.setFile(e)}/>
                                    <p id="ErrTicketAttachments" className='errMessage' ></p>
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