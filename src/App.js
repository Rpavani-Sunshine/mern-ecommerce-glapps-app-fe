import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Homepage from './Pages/Homepage';
import Productpage from './Pages/Productpage';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Redux/Store';
import Cart from './Pages/Cart';
import SigninPage from './Pages/SigninPage';
import Shippingpage from './Pages/Shippingpage';
import SignupPages from './Pages/SignupPages';
import PaymentMethodpage from './Pages/PaymentMethodpage';
import PlaceorderPage from './Pages/PlaceorderPage';
import OrderPage from './Pages/OrderPage';
import OrderHistoryPage from './Pages/OrderHistoryPage';
import UserProfilePage from './Pages/UserProfilePage';
import { API_URL } from './config';
import axios from 'axios';
import { getError } from './Components/utils';
import SearchBox from './Components/SearchBox';
import SearchPage from './Pages/SearchPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Admin/AdminComponents/Dashboard';
import AdminRoute from './Admin/AdminComponents/AdminRoute';
import ProductListPage from './Admin/AdminPages/ProductListPage';
import EditproductPage from './Admin/AdminPages/EditproductPage';
import CreateproductPage from './Admin/AdminPages/CreateproductPage';
import OrderListPage from './Admin/AdminPages/OrderListPage';
import Userlist from './Admin/AdminPages/Userlist';
import EditUser from './Admin/AdminPages/EditUser';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  }
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(API_URL + "/products/categories");
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <div>
      <BrowserRouter>
      <div className={sidebarIsOpen ? 'site-container active-cont h-100' : 'site-container'}>
        <ToastContainer position="top-right" limit={1}></ToastContainer>
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button variant="dark" onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>GLAPPS</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {
                    userInfo ? (
                      <NavDropdown title={userInfo.username} id="basic-nav-bropdown">
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/orderhistory">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <Link className='dropdown-item' to='#signout' onClick={signoutHandler}>
                          Sign out
                        </Link>
                      </NavDropdown>
                    ) : (
                      <Link className='nav-link' to="/signin">Sign In</Link>
                    )
                  }
                  {
                  userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )
                  }
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {
              categories.map((category) =>{
                return (
                  <Nav.Item key={category}>
                  <LinkContainer
                    to={{ pathname: '/search', search: category = `${category}` }}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
                )
              })
            }
          </Nav>
        </div>
        <main>
          <Container className='p-lg-5'>
            <Routes>
              <Route path="/product/:slug" element={<Productpage />}></Route>
              <Route path="/" element={<Homepage />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/signin" element={<SigninPage />}></Route>
              <Route path="/signup" element={<SignupPages />}></Route>
              <Route path="/shipping" element={<Shippingpage />}></Route>
              <Route path="/payment" element={<PaymentMethodpage />}></Route>
              <Route path="/placeorder" element={<PlaceorderPage />}></Route>
              <Route path="/order/:id" element={<ProtectedRoute><OrderPage /></ProtectedRoute>}></Route>
              <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>}></Route>
              <Route path="/profile" element={<ProtectedRoute> <UserProfilePage /> </ProtectedRoute>}></Route>
              <Route path="/search" element={<SearchPage />}></Route>
              <Route path="/admin/dashboard" element={<AdminRoute> <Dashboard /> </AdminRoute>}></Route>
              <Route path="/admin/products" element={<AdminRoute> <ProductListPage/> </AdminRoute>}></Route>
              <Route path="/admin/product/:id" element={<AdminRoute><EditproductPage /></AdminRoute>}></Route>
              <Route path="/admin/addproduct" element={<AdminRoute><CreateproductPage /></AdminRoute>}></Route>
              <Route path="/admin/orders" element={<AdminRoute><OrderListPage /></AdminRoute>}></Route>
              <Route path="/admin/users" element={<AdminRoute><Userlist /></AdminRoute>}></Route>
              <Route path="/admin/user/:id" element={<AdminRoute><EditUser /></AdminRoute>}></Route>
            </Routes>
          </Container>
        </main>
        <footer>
        <div className='row footerDiv'>
            <a className='w-100 backtotopbtn text-center link-light' href="#homepageDiv"><p className='fs-6 mt-2'>Back to top</p></a>
            <div className="row text-center mt-lg-5 footerBlock">
                <div className="col-lg-3 col-md-4 col-sm-6 co-12 ">
                    <ul className='footerList'>
                        <li className="text-light fs-5">Get to Know Us</li>
                        <li>About Us</li>
                        <li>Careers</li>
                        <li>Press Releases</li>
                        <li>Policies</li>
                        <li>Investors</li>
                    </ul>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 co-12">
                <ul className='footerList'>
                        <li className="text-light fs-5">Connect with Us</li>
                        <li>Facebook</li>
                        <li>Twitter</li>
                        <li>Instagram</li>
                    </ul>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 co-12">
                <ul className='footerList'>
                        <li className="text-light fs-5">Shop</li>
                        <li>Gift cards</li>
                        <li>Laxmi Vijyanagar</li>
                        <li>Laxmi Vizag</li>
                        <li>Laxmi Maharashtra</li>
                        <li>Laxmi Rajmantri</li>
                    </ul>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 co-12">
                <ul className='footerList'>
                        <li className="text-light fs-5">Help</li>
                        <li>Help Centre</li>
                        <li>Mail Us</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
            </div>
            <div style={{backgroundColor:"black", marginTop:"2rem"}}>
                <div className="text-center mt-3"> 
                    <a href='https://www.instagram.com/?hl=en' className='m-2'><i className="fa-brands fa-instagram fs-5 text-white"></i></a>
                    <a href='https://www.facebook.com/' className='m-2'><i className="fa-brands fa-facebook fs-5 text-white"></i></a>
                    <a href='https://twitter.com/?lang=en-in' className='m-2'><i className="fa-brands fa-twitter fs-5 text-white"></i></a>
                    <a href='https://www.youtube.com/?app' className='m-2'><i className="fa-brands fa-youtube fs-5 text-white"></i></a>
                    <a href='https://www.pinterest.com/ideas/' className='m-2'><i className="fa-brands fa-pinterest fs-5 text-white"></i></a>
                </div>
                <div className='d-flex justify-content-between footerline mb-2 ms-3'>
                    <div className='text-white'>
                       <span className="m-2"><img className='footerImg' src="https://th.bing.com/th?id=OSK.cf276ed33322d8ef6e4b3bd0a835d4ea&w=188&h=132&c=7&o=6&dpr=1.3&pid=SANGAM" style={{height:"20px", width:"20px", marginRight:"0.3rem"}} alt="Country flag"></img>India</span>
                       <span className="m-2">|</span>
                       <span className="m-2">English(IN)</span>
                       <span className="m-2">|</span>
                       <i className="fa-solid fa-indian-rupee-sign"></i>
                       <span>(INR)</span> 
                    </div>
                    <div className='text-white'>@2023 Laxmi Collections, Inc.
                    <a href='#' className='m-2 link-light'>Terms of Use</a>
                    <a href='#' className='m-2 link-light'>Privacy</a>
                    <a href='#' className='m-2 link-light'>Local Shop</a>
                    </div>
                </div>
            </div>
        </div>
        </footer>
      </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
