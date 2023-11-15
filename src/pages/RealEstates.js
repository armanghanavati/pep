import React, { Suspense } from "react";
import RealEstate from "../components/realEstate/RealEstate";

class RealEstates extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return(
            <div>
                <RealEstate />
            </div>
        )
    }
}

export default RealEstates;