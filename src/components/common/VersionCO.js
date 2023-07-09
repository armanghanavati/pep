import {    
    Row,
    Col,    
} from 'reactstrap';

function Footer(){
    return(
        <Row className="copyright text-center  text-muted ">
            <Col>                                       
                © 1401,
                واحد فناوری اطلاعات شرکت پیوند
                <br />
                Version: {localStorage.getItem('LocalVersion')}                        
            </Col>
        </Row>  
    )
}

export default Footer;