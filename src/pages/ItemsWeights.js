import React from "react";
import ItemWeight from '../components/item/ItemWeight'
class ItemsWeights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <ItemWeight />        
      </div>
    );
  }
}

export default ItemsWeights;