import React from "react";
import ItemLocationSnapp from "../components/itemLocation/ItemLocationSnapp";
import { connect } from "react-redux";
class ItemLocationSnapps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <ItemLocationSnapp />
      </div>
    );
  }
}

export default ItemLocationSnapps;
