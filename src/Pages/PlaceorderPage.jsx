import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import ChekoutSteps from '../Components/ChekoutSteps'
import axios from 'axios';
import { API_URL } from '../config.js';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { Store } from '../Redux/Store'
import { Link, useNavigate } from 'react-router-dom'
import LoadingBox from '../Components/LodingBox.jsx';
import { toast } from 'react-toastify';
import { getError } from '../Components/utils.js';


const reducer = (state, action)=>{
    switch (action.type){
        case 'CREATE_REQUEST':
            return {...state, loading: true};
        case 'CREATE_SUCESS':
            return {...state, loading: false};
        case 'CREATE_FAIL':
            return {...state, loading: false};
        default:
            return state;
    }
};

function PlaceorderPage() {
    const navigate = useNavigate();
    const [{loading}, dispatch] = useReducer(reducer, {
        loading: false
    })
    const {state, dispatch:ctxDispatch} = useContext(Store)
    const {cart, userInfo } = state;

    const round2 = (num)=> Math.round(num * 100 + Number.EPSILON)/100;
    cart.itemsPrice = round2(cart.cartItems.reduce((sum, item)=> sum + item.quantity * item.Product_Price, 0));
    cart.shippingPrice = cart.itemPrice>100 ? round2(0) : round2(10);
    cart.taxPrice =round2(0.18 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const placeOrderHandler = async ()=>{
        try{
            dispatch({type : "CREATE_REQUEST"})
            const {data}= await axios.post(API_URL + "/orders",{
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            },
            {
                headers: {
                    authorization : `Bearer ${userInfo.token}`,
                }
            }
            );
            ctxDispatch({type: 'CART_CLEAR'});
            dispatch({type: 'CREATE_SUCCESS'});
            localStorage.removeItem('cartItems');
            navigate(`/order/${data.order._id}`);
        }
        catch(err){
            dispatch({type : "CREATE_FAIL"})
            toast.error(getError(err));
        }
    }
    useEffect(()=>{
        if (!cart.paymentMethod){
            navigate('/payment')
        }
    },[cart,navigate])
  return (
    <div>
        <Helmet>
            <title>payment</title>
        </Helmet>
        <ChekoutSteps step1 step2 step3 step4></ChekoutSteps>
        <h1 className='my-3'>Preview Order</h1>
        <Row>
            <Col md={8}>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Shipping</Card.Title>
                        <Card.Text>
                            <b>Name: </b> {cart.shippingAddress.fullname} <br />
                            <b>Address: </b> {cart.shippingAddress.address}, {cart.shippingAddress.city},
                            {cart.shippingAddress.postalcode}, {cart.shippingAddress.country}<br />
                        </Card.Text>
                        <Link to="/shipping">Edit</Link>
                    </Card.Body>
                </Card>
                <Card className='mb-3'>
                    <Card.Body>
                    <Card.Title>Payment</Card.Title>
                    <Card.Text>
                        <b>Method: </b> {cart.paymentMethod}
                    </Card.Text>
                    <Link to="/payment">Edit</Link>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Card.Title>Items</Card.Title>
                        <ListGroup variant='flush'>
                            {
                                cart.cartItems.map((item)=>{
                                    return(
                                        <ListGroup.Item key={item._id}>
                                            <Row className='align-items-center'>
                                                <Col md={6}>
                                                    <img className='img-fluid rounded img-thumbnail' src={item.Product_image} alt={item.Product_name}></img>
                                                    <Link to={`/product/${item.slug}`}>{item.Product_name}</Link>
                                                </Col>
                                                <Col md={3}><span>{item.quantity}</span></Col>
                                                <Col md={3}><span> ₹ {item.Product_Price}</span></Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                        <Link to="/cart">Edit</Link>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <Card.Title>Order Summary</Card.Title>
                        <ListGroup variant='flush'>
                          <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>₹ {cart.itemsPrice.toFixed(2)}</Col>
                            </Row>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>₹ {cart.shippingPrice.toFixed(2)}</Col>
                            </Row>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>₹ {cart.taxPrice.toFixed(2)}</Col>
                            </Row>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <Row>
                                <Col><strong>Order Total</strong></Col>
                                <Col>₹ {cart.totalPrice.toFixed(2)}</Col>
                            </Row>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <div className="d-grid">
                                <Button type="button" onClick={placeOrderHandler} disabled={cart.cartItems.length === 0}>
                                    Place Order
                                </Button>
                            </div>
                            {loading && <LoadingBox></LoadingBox>}
                          </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default PlaceorderPage