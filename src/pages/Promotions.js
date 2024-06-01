import React from "react";
import Promotion from "../components/promotion/Promotion";

class Promotions extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div>
                <Promotion />
            </div>
        );
    }
}

export default Promotions;