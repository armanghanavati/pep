import React from "react";
import ItemLocation from "../components/itemLocation/ItemLocation";
import { connect } from "react-redux";
class ItemLocations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <ItemLocation />
      </div>
    );
  }
}

export default ItemLocations;
