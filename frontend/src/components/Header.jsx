import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { MdHome } from 'react-icons/md';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/sswm.jpg';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // NOTE: here we need to reset cart state for when a user logs out so the next
      // user doesn't inherit the previous users cart and shipping
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar
        bg='primary'
        variant='dark'
        expand='lg'
        collapseOnSelect
        className='header'
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img src={logo} alt='Iranian Shop' className='headerLogo' />
              فروشگاه ایرانیان
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <LinkContainer to='/'>
              <NavDropdown.Item>
                <div className='menuItem'>
                  <MdHome />
                  خانه
                </div>
              </NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to='/products'>
              <NavDropdown.Item>
                <div className='menuItem'>
                  <MdHome />
                  خانه
                </div>
              </NavDropdown.Item>
            </LinkContainer>
            <Nav className='me-auto'>
              <SearchBox />

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu' className='my-auto'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>محصولات</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/categorylist'>
                    <NavDropdown.Item>دسته بندی ها</NavDropdown.Item>
                  </LinkContainer>
                  {/* <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer> */}
                </NavDropdown>
              )}
              {userInfo && (
                <>
                  <NavDropdown.Item onClick={logoutHandler} className='my-auto'>
                    خروج
                  </NavDropdown.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
