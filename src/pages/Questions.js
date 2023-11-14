import React from "react";
import Question from "../components/question/Question";
class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <Question />
      </div>
    );
  }
}

export default Questions;
