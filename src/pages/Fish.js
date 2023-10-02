import * as React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter, Switch } from "react-router-dom";
import { Form, Container, Row, Col, Card, Button, Input } from 'reactstrap';
import Select from 'react-select';
import { width } from '@mui/system';
import {
    Gfn_num3Seperator,
} from "../utiliy/GlobalMethods";
import '../assets/CSS/fishStyle.css';
import FishLogo from '../assets/images/payvandLogo.png'
var ResponseOBJ = '';
class PrintData1 extends React.Component {
    render() {
        return (
            <tr>
                <td className="fishBorderData">
                    {this.props.resTitle}
                </td>
                <td className="fishBorderData">
                    {this.props.resValue}
                </td>
            </tr>
        );
    }
}

class PrintData2 extends React.Component {
    render() {
        return (
            <tr>
                <td className="fishBorderData">
                    {this.props.resTitle}
                </td>
                <td className="fishBorderData">
                    {this.props.resValue}
                </td>
                {/* <td style={{borderLeft:'0px'}}>
                    {this.props.resMande}
                </td> */}
            </tr>
        );
    }
}

class PrintData3 extends React.Component {
    render() {
        return (
            <tr>
                <td className="fishBorderData">
                    {this.props.resTitle}
                </td>
                <td className="fishBorderData">
                    {this.props.resValue}
                </td>
            </tr>
        );
    }
}

class PrintData4 extends React.Component {
    render() {
        return (
            <tr>
                <td className="fishBorderData">
                    {this.props.resTitle}
                </td>
                <td className="fishBorderData">
                    {this.props.resValue}
                </td>
                <td className="fishBorderData">
                    {this.props.resMande}
                </td>
            </tr>
        );
    }
}

class SeperateData extends React.Component {
    render() {
        return (
            <div>
                <p></p>
            </div>
        );
    }
}


class Fish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateShowFish: false,
            responseFish: null,
            responseOBJ2: null,
            statePrint:false,
            stateShowParameter: true,
            Years: [
                { label: '1400', value: 1400 },
                { label: '1401', value: 1401 },
                { label: '1402', value: 1402 },
                { label: '1403', value: 1403 },
                { label: '1404', value: 1404 },
                { label: '1405', value: 1405 },
                { label: '1406', value: 1406 },
                { label: '1407', value: 1407 },
                { label: '1408', value: 1407 },
                { label: '1409', value: 1407 },
                { label: '1410', value: 1407 },
                { label: '1411', value: 1407 },
                { label: '1412', value: 1407 },
                { label: '1413', value: 1407 },
                { label: '1414', value: 1407 },
                { label: '1415', value: 1407 },
            ],
            Months: [
                { label: 'فروردین', value: 1 },
                { label: 'اردیبهشت', value: 2 },
                { label: 'خرداد', value: 3 },
                { label: 'تیر', value: 4 },
                { label: 'مرداد', value: 5 },
                { label: 'شهریور', value: 6 },
                { label: 'مهر', value: 7 },
                { label: 'آبان', value: 8 },
                { label: 'آذر', value: 9 },
                { label: 'دی', value: 10 },
                { label: 'بهمن', value: 11 },
                { label: 'اسفند', value: 12 },
            ],
            YearValue: null,
            MonthValue: null,
            MobileValue: '',
            AuthCodeValue: '',
        }
        this.YearHandleChange = this.YearHandleChange.bind(this);
        this.MonthHandleChange = this.MonthHandleChange.bind(this);
    }


    // componentDidMount(){
    //   this.api_ShowFish();
    // }

    api_ShowFish = async () => {
        let url = window.confirmPayment + '/Person/showFish'
        let flagShow = true;
        if (this.state.YearValue == null || this.state.MonthValue == null) {
            flagShow = false;
            alert('سال یا ماه را انتخاب نمائید.')
        }
        if (flagShow) {
            let data = {
                mobile: this.state.MobileValue,
                authenticationCode: this.state.AuthCodeValue,
                year: this.state.YearValue,
                month: this.state.MonthValue,

                // mobile: '09120598039',
                // authCode: this.state.AuthCodeValue,
                // year: 1402,
                // month: 5,
            }
            // alert(JSON.stringify(data))
            await fetch(url, {
                method: 'POST'
                , body: JSON.stringify(data)
                , headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(JSON.stringify(responseJson));
                    if (Object.keys(responseJson.Table).length > 0) {
                        this.setState({
                            responseOBJ2: responseJson,
                            responseFish: responseJson,
                            stateShowFish: true,
                            stateShowParameter: false,
                            ErrorAuth: true
                        });
                    }
                    else
                        alert('رمز یکبار مصرف اشتباه می باشد.')
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    }

    async api_SendAuthCode() {
        let url = window.confirmPayment + '/AuthCode/sendFishAuthCode';
        let data = {
            Mobile: this.state.MobileValue,
            Message: ''
        }
        alert(JSON.stringify(data))
        await fetch(url, {
            method: 'POST'
            , body: JSON.stringify(data)
            , headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {              
                    alert('درصورتی که شماره موبایل صحیح باشد، پیامکی حاوی رمز یکبار مصرف به تلفن همراه شما ارسال می شود.')               
            })
            .catch((error) => {
                console.error(error);
            })
    }

    onClick_btnShowFish = () => {
        this.api_ShowFish();
    }

    onClick_btnGetAuthCode = () => {
        this.api_SendAuthCode()
    }

    MonthConvert(Month) {
        let rtn = '';
        switch (Month) {
            case 1: rtn = 'فروردین'; break;
            case 2: rtn = 'اردیبهشت'; break;
            case 3: rtn = 'خرداد'; break;
            case 4: rtn = 'تیر'; break;
            case 5: rtn = 'مرداد'; break;
            case 6: rtn = 'شهریور'; break;
            case 7: rtn = 'مهر'; break;
            case 8: rtn = 'آبان'; break;
            case 9: rtn = 'آذر'; break;
            case 10: rtn = 'دی'; break;
            case 11: rtn = 'بهمن'; break;
            case 12: rtn = 'اسفند'; break;
        }
        return rtn
    }

    YearHandleChange(val) {
        this.setState({ YearValue: val.value });
    }

    MonthHandleChange(val) {
        this.setState({ MonthValue: val.value });
    }

    MobileHandleChange = (event) => {
        this.setState({ MobileValue: event.target.value })
    }

    AuthCodeHandleChange = (event) => {
        this.setState({ AuthCodeValue: event.target.value })
    }

    onClick_btnPrint=()=>{
      this.setState({statePrint:true})

      setTimeout(function() {
        window.print();
      }, 1000);
    }

    render() {
        let i, j;
        let resPardakhti = [];
        let resKosoorat = [];
        let resSharheKarkerd = [];
        let resVam = [];
        if (this.state.stateShowFish) {
            for (j = 0; j < this.state.responseOBJ2.Table2.length; j++) {
                resPardakhti.push(<PrintData1
                    resTitle={Object.values(this.state.responseOBJ2.Table2[j])[0]}
                    resValue={Gfn_num3Seperator(parseInt(Object.values(this.state.responseOBJ2.Table2[j])[1]).toString(), 3).toString()}
                />);
            }

            for (j = 0; j < this.state.responseOBJ2.Table3.length; j++) {
                resKosoorat.push(<PrintData2
                    resTitle={Object.values(this.state.responseOBJ2.Table3[j])[0]}
                    resValue={Gfn_num3Seperator(parseInt(Object.values(this.state.responseOBJ2.Table3[j])[1]).toString(), 3).toString()}
                // resMande={Gfn_num3Seperator(parseInt( Object.values(this.state.responseOBJ2.Table[j])[22]).toString(),3).toString()}
                />);
            }

            for (j = 0; j < this.state.responseOBJ2.Table1.length; j++) {
                resSharheKarkerd.push(<PrintData3
                    resTitle={Object.values(this.state.responseOBJ2.Table1[j])[0]}
                    resValue={Gfn_num3Seperator(parseInt(Object.values(this.state.responseOBJ2.Table1[j])[1]).toString(), 3).toString()}
                />);
            }
            for (j = 0; j < this.state.responseOBJ2.Table4.length; j++) {
                resVam.push(<PrintData4
                    resTitle={Object.values(this.state.responseOBJ2.Table4[j])[0]}
                    resValue={Gfn_num3Seperator(parseInt(Object.values(this.state.responseOBJ2.Table4[j])[1]).toString(), 3).toString()}
                    resMande={Gfn_num3Seperator(parseInt(Object.values(this.state.responseOBJ2.Table4[j])[2]).toString(), 3).toString()}
                />);
            }
        }
        return (
            <div style={{ paddingTop: '1%', minHeight: '100vh', direction: 'rtl' }}>
                <div class="fish" >
                {!this.state.statePrint &&
                  <div>
                        <Row className="text-center">
                            <Col>
                                <Select options={this.state.Years} placeholder="سال" id="selectYear" onChange={(values) => this.YearHandleChange(values)} />
                            </Col>
                            <Col>
                                <Select options={this.state.Months} placeholder="ماه" id="selectMonth" onChange={(values) => this.MonthHandleChange(values)} />
                            </Col>
                        </Row>
                        <Row className="text-center" style={{ paddingTop: '10px' }}>
                            <Col>
                                <Input type='"text' inputmode="numeric" pattern="\d{11}" value={this.state.MobileValue} onChange={this.MobileHandleChange} placeholder="شماره موبایل" />
                            </Col>
                            <Col>
                                <Button
                                    // variant="contained"
                                    sx={{ fontFamily: 'Tahoma', marginTop: '10px', width: '100%' }}
                                    onClick={this.onClick_btnGetAuthCode}
                                >
                                    دریافت رمز یکبار مصرف
                                    {/* دریافت رمز یکبار مصرفدریافت رمز یکبار مصرفدریافت رمز یکبار مصرفدریافت رمز یکبار مصرفدریافت رمز یکبار مصرفدریافت رمز یکبار مصرفدریافت رمز یکبار مصرفدریافت رمز یکبار مصرفدریافت رمز یکبار مصرف */}
                                </Button>
                            </Col>
                        </Row>
                        <Row className="text-center" style={{ paddingTop: '10px' }}>
                            <Col>
                                <Input type='"text' inputmode="numeric" pattern="\d{11}" value={this.state.AuthCodeValue} onChange={this.AuthCodeHandleChange} placeholder="رمز یکبار مصرف" />
                            </Col>
                            <Col>
                                <Button
                                    // variant="contained"
                                    sx={{ fontFamily: 'Tahoma', marginTop: '10px', width: '100%' }}
                                    onClick={this.onClick_btnShowFish}
                                >
                                    مشاهده فیش حقوقی
                                </Button>
                            </Col>
                        </Row>
                        {this.state.stateShowFish &&
                          <Row className="text-center" style={{ paddingTop: '10px' }}>
                              <Button
                                  // variant="contained"
                                  sx={{ fontFamily: 'Tahoma', marginTop: '10px', width: '100%' }}
                                  onClick={this.onClick_btnPrint}
                              >
                                  چاپ فیش حقوقی
                              </Button>
                          </Row>
                        }
                      </div>
                    }
                        <Row className="text-center" style={{ paddingTop: '50px' }}>
                            {this.state.stateShowFish ?
                                <div>
                                    <Row>
                                        <Col>
                                        </Col>
                                        <Col>
                                            <p style={{ textAlign: 'center', direction: 'rtl', fontWeight: 'bold', fontSize: '15px' }}>صورت حساب حقوق و مزایای{' ' + this.state.responseFish.Table[0].VahedeTejariDS}</p>
                                            <p style={{ textAlign: 'center', direction: 'rtl' }}>{this.MonthConvert(this.state.responseFish.Table[0].Month)}{'  ' + this.state.responseFish.Table[0].Year}</p>
                                        </Col>
                                        <Col>
                                            <img src={FishLogo} style={{width:'200px',margin:'auto',alignItems:'center',textAlign:'center'}} />
                                        </Col>
                                    </Row>


                                    <Row>
                                        <table className="table table2 table-hover rtl ttt">
                                            <tbody>
                                                <tr>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}>
                                                        <p>نام و نام خانوادگی:&emsp;{this.state.responseFish.Table[0].Name + '  ' + this.state.responseFish.Table[0].Famili}</p>
                                                    </td>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}>
                                                        <p>شماره کارگزینی:&emsp;{this.state.responseFish.Table[0].PersonelCode}</p>
                                                    </td>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}>
                                                        <p>شماره بیمه:&emsp;{this.state.responseFish.Table[0].BemehNo}</p>
                                                    </td>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}>
                                                        <p>نام مرکز هزینه:&emsp;{this.state.responseFish.Table[0].MarkazHazineDS}</p>
                                                    </td>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}>
                                                        <p>شماره مرکز هزینه:&emsp;{this.state.responseFish.Table[0].MarkazHazineNo}</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Row>


                                    <Row>
                                        <table className="table" >
                                            <thead>
                                                <tr>
                                                    <th className="fishHeader">شرح کارکرد</th>
                                                    <th className="fishHeader">پرداختی(ریال)</th>
                                                    <th className="fishHeader">کسورات(ریال)</th>
                                                    <th className="fishHeader">وضعیت وام</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="fishBody">{resSharheKarkerd}</td>
                                                    <td className="fishBody">{resPardakhti} </td>
                                                    <td className="fishBody">{resKosoorat} </td>
                                                    <td className="fishBody">{resVam}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}></td>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}>
                                                        ناخالص حقوق و مزایا:&emsp;{Gfn_num3Seperator(parseInt(this.state.responseFish.Table5[0].Jam_Mazaya).toString(), 3).toString()}
                                                    </td>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}>
                                                        جمع کسورات:&emsp;{Gfn_num3Seperator(parseInt(this.state.responseFish.Table5[0].Jam_Kosoorat).toString(), 3).toString()}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Row>

                                    <Row>
                                        <table className="table table2 table-hover rtl ttt">
                                            <tbody>
                                                <tr>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}>
                                                        <p>مبلغ خالص دریافتی :&emsp;{Gfn_num3Seperator(parseInt(this.state.responseFish.Table5[0].KhalesehDaryafti).toString(), 3).toString()}&emsp; ریال</p>
                                                        <p>بانک :&emsp;{this.state.responseFish.Table[0].BankDS}</p>
                                                        <p>شغل :&emsp;{this.state.responseFish.Table[0].JobDS}</p>
                                                        <p>کد شغل :&emsp;{this.state.responseFish.Table[0].JobNo}</p>
                                                    </td>
                                                    <td className="fishBody" style={{ fontWeight: 'bold' }}>
                                                        <p>درآمد سال تا کنون :&emsp;{Gfn_num3Seperator(parseInt(this.state.responseFish.Table[0].DaramadSalTaKonon).toString(), 3).toString()}&emsp; ریال</p>
                                                        <p>مالیات سال تا کنون :&emsp;{Gfn_num3Seperator(parseInt(this.state.responseFish.Table[0].MaleyatSalTaKonon).toString(), 3).toString()}&emsp; ریال</p>
                                                        <p>حقوق ثابت ماهیانه :&emsp;{Gfn_num3Seperator(parseInt(this.state.responseFish.Table[0].HoghoghSabetehMaheyaneh).toString(), 3).toString()}&emsp;  ریال</p>
                                                        <p>درآمد مشمول بیمه :&emsp;{Gfn_num3Seperator(parseInt(this.state.responseFish.Table[0].DaramadehMashomolBimeh).toString(), 3).toString()}&emsp;  ریال</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Row>
                                    <Row>
                                      <p style={{fontSize:'15px',fontWeight:'bold',color:'red'}}>***بدون مهر و امضای شرکت فاقد اعتبار می باشد***</p>
                                    </Row>
                                </div>
                                : null}
                        </Row>
                </div>
            </div>
        );
    }
}

export default Fish;
