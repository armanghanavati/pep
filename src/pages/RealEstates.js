import React, { Suspense } from "react";
import RealEstateRegister from "../components/realEstate/RealEstateRegister";

class RealEstates extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return(
            <div>
                <RealEstateRegister />
            </div>
        )
    }
}

export default RealEstates;