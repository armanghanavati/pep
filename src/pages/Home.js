import React from "react";
import { connect } from "react-redux";
import "../assets/CSS/style.css";
import "../assets/CSS/mainDrawer_style.css";
import List from "devextreme-react/list";
import { Row, Col } from "reactstrap";
import { locale } from "devextreme/localization";
import Toolbar, { Item } from "devextreme-react/toolbar";
import SelectBox from "devextreme-react/select-box";

import { companyActions } from "../redux/reducers/company/company-slice";
import { companyListCombo } from "../redux/reducers/company/company-actions";

import MainMenu from "../components/common/MainMenu";
import logo from "../assets/images/LOGO.jpg";

class Home extends React.Component {

    async componentDidMount(){
        await this.fn_SetState();
    }

    fn_SetState=async()=>{
        const companyCombo=await companyListCombo(this.props.User.token);                
        this.props.dispatch(companyActions.setCompanyCombo({
            companyCombo
        }))
    }

    cmbCompany_onChange=(e)=>{        
        let currentCompanyId=parseInt(e);
        this.props.dispatch(companyActions.setCurrentCompanyId({
            currentCompanyId
        }))
    }

  render() {
    locale("fa-IR");    
    return (
      <div className="mainRow">
        <Row>
          <Toolbar>
            <Item location="center">
              <img src={logo} style={{ width: "235px", margin: "auto" }} />
            </Item>
            <Item location="left">
              <div style={{marginLeft:'25px',width:'200px'}}>                
                <SelectBox
                  dataSource={this.props.Company.companyCombo}
                  displayExpr="label"
                  placeholder="انتخاب شرکت"
                  valueExpr="id"
                  value={this.props.Company.currentCompanyId}
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbCompany_onChange}
                />                
              </div>
            </Item>
          </Toolbar>
        </Row>
        <Row>
          <Col>
            <MainMenu />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,  
  Company:state.companies,
});

export default connect(mapStateToProps)(Home);
