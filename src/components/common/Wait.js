import React from 'react';
import '../../assets/CSS/style.css';
// import '../../CSS/PUB_style.css';
// import { css } from "@emotion/core";
import '../../assets/CSS/loader.css'
import Modal from 'react-awesome-modal';
import { Container, Row, Col } from 'reactstrap';

class Wait extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ColorSpinner: "#f351ff",
            stateModalSpinner: false,
        }
    }

    render() {

        // const override = css`
        //     display: block;
        //     margin: 0 auto;
        //     border-color: red;
        // `;
        return (
            <div>
                {/* <Container style={{ flex: 1, marginTop: '4rem', minHeight: '86.5vh', direction: 'rtl', width: '100%' }}> */}
                    <Modal visible={true} effect="fadeInUp">
                        <Row className="text-center">
                            <Col>
                                <div class="lds-spinner" ><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

                            </Col>
                        </Row>
                        <Row className="text-center" style={{ marginTop: '20px', marginLeft: '10px', marginRight: '10px', marginBottom: '20px' }}>
                            <Col style={{ textAlign: 'center' }}>
                                <span class="loader"></span>
                            </Col>
                        </Row>
                    </Modal>
                {/* </Container> */}
            </div>
        );
    }
}
export default Wait;
