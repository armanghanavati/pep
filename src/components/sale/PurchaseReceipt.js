import React from "react";
import { Scanner } from '@yudiel/react-qr-scanner';
import { connect } from "react-redux";
import { Button } from 'devextreme-react/button';
import OnOffIcon from '../../assets/images/icon/onOff.png';
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
    Input,
} from "reactstrap";
import { itemListOfPromotionsNotFactor } from "../../redux/reducers/item/item-action";
class PurchaseReceipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scanValue: null,
            stateCamera: false,
        };
    }

    Barcode_onScan = async (data) => {
        this.setState({ scanValue: data[0].rawValue })
        // const obj={
        //     personId:869
        // }
        // const RESULT = await itemListOfPromotionsNotFactor(obj, this.props.User.token);
    }

    btnOnOffCamera_onClick = async () => {
        this.setState({ stateCamera: !this.state.stateCamera })
        const DATA={
            personId:869
        }
        const RESULT = await itemListOfPromotionsNotFactor(DATA, this.props.User.token);
    }


    render() {
        return (
            <div>
                <Card className="shadow bg-white border pointer">
                    <Row className="standardPadding">
                        <Col>
                            <Button
                                icon={OnOffIcon}
                                onClick={this.btnOnOffCamera_onClick}
                                text="دوربین"
                                type="default"
                                stylingMode="contained"
                                rtlEnabled={true}
                                className="fontStyle"
                            />
                        </Col>
                    </Row>
                    <p>{this.state.scanValue}</p>
                </Card>
                {this.state.stateCamera &&
                    <Row className="standardPadding">
                        <Scanner
                            onScan={this.Barcode_onScan}
                        />
                    </Row>
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    User: state.users,
    Company: state.companies,
  });
  
export default connect(mapStateToProps)(PurchaseReceipt);