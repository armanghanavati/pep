import React from "react";
import Answer from "../components/answer/Answer";
class Answers extends React.Component {
    constructor(props) {
        super(props);
        this.state={ };
    }

    render() {
        return (
            <div>
                <Answer />
            </div>
        )
    }
}
export default Answers;