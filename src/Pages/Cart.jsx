import React, { useContext } from 'react'
import { Store } from '../Redux/Store.js';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../Components/MessageBox.jsx';
import axios from 'axios';
import { API_URL } from '../config.js';
// React-bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';


const Cart = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart: { cartItems } } = state;
    const navigate = useNavigate();

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(API_URL + "/products/" + item._id);
        if (data.count_InStock < quantity) {
            window.alert("Sorry! Product is out of stock")
            return;
        }
        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
    }
    const removeItemHandler = async (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    }

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping')
    }
    return (
        <div>
            <Helmet>
                <title>Shopping cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <Row>
                <Col md={7}>
                    {
                        cartItems.length === 0 ? (
                            <MessageBox>
                                Cart is empty <Link to='/'>Go Shopping</Link>
                            </MessageBox>
                        ) :
                            (
                                <ListGroup>
                                    {
                                        cartItems.map((item) => {
                                            return (
                                                <ListGroup.Item key={item._id}>
                                                    <Row className="align-item-center">
                                                        <Col md={4}>
                                                            <img src={item.Product_image} alt={item.Product_name} className='img-fluid rounded img-thumbnail' />
                                                            <Link to={`/product/${item.slug}`}>{item.Product_name}</Link>
                                                        </Col>
                                                        <Col md={3}>
                                                            <Button variant="light" onClick={() => updateCartHandler(item, item.quantity - 1)} disabled={item.quantity === 1}>
                                                                <i className='fas fa-minus-circle'></i>
                                                            </Button>
                                                            <span>{item.quantity}</span>
                                                            <Button variant="light" onClick={() => updateCartHandler(item, item.quantity + 1)} disabled={item.quantity === item.count_InStock}>
                                                                <i className='fas fa-plus-circle'></i>
                                                            </Button>
                                                        </Col>
                                                        <Col md={3}>{item.Product_price}</Col>
                                                        <Col md={2}>
                                                            <Button variant="light"
                                                                onClick={() => removeItemHandler(item)}>
                                                                <i className='fas fa-trash'></i>
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )
                                        })
                                    }
                                </ListGroup>
                            )
                    }
                </Col>
                <Col md={5}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>
                                        subtotal ({cartItems.reduce((ItemCount, c) => ItemCount + c.quantity, 0)}{' '}
                                        items) : ₹ {cartItems.reduce((ItemCount, c) => ItemCount + c.Product_Price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button type="button" variant='primary' onClick={checkoutHandler} disabled={cartItems.length === 0}>
                                            Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Cart