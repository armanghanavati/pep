import React from "react";
import AnswerReport from "../components/answer/AnswerReport";
class AnswerReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <AnswerReport />
      </div>
    );
  }
}
export default AnswerReports;