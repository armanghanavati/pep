import React, { Suspense } from "react";
import RealEstateRegister from "../components/realEstate/RealEstateRegister";

class RealEstateRegisters extends React.Component{
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

export default RealEstateRegisters;