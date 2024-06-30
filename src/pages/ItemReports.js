import React from "react";
import ItemReport from "../components/item/ItemReport";
class ItemReports extends React.Component {
    constructor(props) {
        super(props);
        this.state={ };
    }

    render() {
        return (
            <div>
                <ItemReport />
            </div>
        )
    }
}
export default ItemReports;