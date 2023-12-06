import React from "react";
import QuestionTypeUser from "../components/questionTypeUser/QuestionTypeUser";
class QuestionTypeUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <QuestionTypeUser />
      </div>
    );
  }
}

export default QuestionTypeUsers;
