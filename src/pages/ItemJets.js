import React from "react";
import ItemJet from "../components/itemJet/ItemJet";
class ItemJets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>                
        <ItemJet />
      </div>
    );
  }
}

export default ItemJets;
