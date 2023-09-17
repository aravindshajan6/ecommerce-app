import { Navbar, Nav, Container , Badge, NavDropdown} from 'react-bootstrap';
import { FaShoppingCart, FaUser} from 'react-icons/fa'; //icons
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch} from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import logo from '../assets/logo-nb.png';
import SearchBox from './SearchBox';
import '../assets/styles/Header.css';

const  Header = () => {

    const { cartItems } = useSelector( (state) => state.cart);
    const { userInfo } = useSelector( (state) => state.auth);
    // console.log(cartItems);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall ] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }

   const logoStyle = {
    height: '60px',
    width: '140px',
   }

    return(
        <header>
            {/* 'lg' provides hamburger menu on min-width */}
            <Navbar className='navbar' variant='dark' expand='lg'  collapseOnSelect > 
                <Container> 
                    <LinkContainer to='/' >
                        <Navbar.Brand  > <img src={logo} style={logoStyle}  alt='e-commerce'></img> </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'></Navbar.Toggle>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                        <SearchBox />
                            <LinkContainer to='/cart'>
                                <Nav.Link  > <FaShoppingCart/> Cart
                                {
                                    cartItems.length > 0 &&  <Badge pill bg='success' style={{marginLeft:'5px'}}>
                                        { cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </Badge>
                                } </Nav.Link>
                            </LinkContainer>
                            { userInfo ? (
                                <NavDropdown title={userInfo.name} id='username' >
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item >
                                            Profile
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>
                                            Logout
                                        </NavDropdown.Item>
                                </NavDropdown>
                            ) : (<LinkContainer to='/login'>
                                <Nav.Link href='/login' > 
                                    <FaUser/> Sign In 
                                </Nav.Link>
                            </LinkContainer>) }
                            { userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <LinkContainer to='/admin/productlist'>
                                        <NavDropdown.Item>
                                            Products
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/userlist'>
                                        <NavDropdown.Item>
                                            Users
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/orderlist'>
                                        <NavDropdown.Item>
                                            Orders
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;