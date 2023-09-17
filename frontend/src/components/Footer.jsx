// import { blue } from "colors";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
    const currentYear = new Date().getFullYear();

   
    // const footerStyles = {
    //     backgroundColor: 'blue' ,
    // }

    
    return(
        
            <footer>
                <Container>
                    <Row>
                        <Col className="text-center py-3">
                            <p>E-commerce &copy; {currentYear} </p>
                        </Col>
                    </Row>
                </Container>
            </footer>
            
    )
}

export default Footer;