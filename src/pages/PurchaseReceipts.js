import React from "react";
import PurchaseReceipt from "../components/sale/PurchaseReceipt";
class PurchaseReceipts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scanValue: null,
            stateCamera: false,
        };
    }

    Barcode_onScan = (data) => {
        this.setState({ scanValue: data[0].rawValue })
    }

    btnOnOffCamera_onClick = () => {
        this.setState({ stateCamera: !this.state.stateCamera })
    }


    render() {
        return (
            <div>
                <PurchaseReceipt />               
            </div>
        )
    }
}
export default PurchaseReceipts;