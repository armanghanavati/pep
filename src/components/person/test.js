import * as React from 'react';
import { Button } from "devextreme-react/button";
class test extends React.Component{
    constructor(props){
        super(props);  
        this.state={
            newData:this.props.p1,
        }      
        
    }
    async componentDidMount(){
        this.setState({newData:this.props.p1})
    }
    btnSearch_onClick=(p)=>{
        alert(p)
    }
    render(){
        this.btnSearch_onClick(this.props.p1)
        return(
            <div>
                Props:{this.props.p1}
                <p></p>
                state:{this.state.newData}
                <Button                    
                    text="جستجو"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnSearch_onClick}
                  />
            </div>
        )
    }
}
export default test;