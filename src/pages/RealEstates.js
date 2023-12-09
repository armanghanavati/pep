import React, { Suspense } from "react";
import RealEstateShow from "../components/realEstate/RealEstateShow";

class RealEstates extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return(
            <div>
                <RealEstateShow />
            </div>
        )
    }
}

export default RealEstates;