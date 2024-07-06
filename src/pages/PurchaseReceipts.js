import React from "react";
import { Scanner } from '@yudiel/react-qr-scanner';
import PurchaseReceipt from "../components/itemJet/ItemJet";
class PurchaseReceipts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            QrValue: null
        };
    }

    onScanQR=(result)=>{
        this.setState({QrValue:result[0].rawValue})
        // alert(JSON.stringify(result))
    }
    render() {
        return (
            <div>
                <h3>بارکد را در کادر قرمز رنگ قرار دهید</h3>
                {this.state.QrValue}
                <Scanner
                    // onScan={(result) => this.state({ QrValue: result })}
                    onScan={this.onScanQR}
                    scanDelay={1000}
                />                
            </div>
        );
    }
}

export default PurchaseReceipts;
