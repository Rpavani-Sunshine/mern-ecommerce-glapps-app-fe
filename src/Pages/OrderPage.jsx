import React, { useContext, useEffect, useReducer } from 'react'
import LoadingBox from '../Components/LodingBox.jsx';
import MessageBox from '../Components/MessageBox.jsx';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import { API_URL } from '../config.js';
import { Store } from '../Redux/Store.js';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import { getError } from '../Components/utils.js';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, error: action.payload, loading: false };
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true};
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true};
        case 'PAY_FAIL':
            return { ...state,loadingPay: false };
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false };
        default:
            return state;
    }
}
function OrderPage() {
    const navigate = useNavigate()
    const { state } = useContext(Store);
    const { userInfo } = state;
    const params = useParams();
    const { id: orderId } = params
    const [{ loading, error, order, successPay, loadingPay }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false
    })

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer()
    const createOrder = (data, actions) =>{
        return actions.order
        .create({
            purchase_units:[
                {
                  amount:{value: order.totalPrice}  
                }
            ]
        })
        .then((orderID) =>{
            return orderID;
        })
    }
    const onApprove = (data, actions) =>{
        return actions.order.capture().then(async (details) =>{
            try{
                dispatch({type: 'PAY_REQUEST'});
                const {data} = await axios.put(API_URL +`/orders/${order._id}/pay`,
                details,
                { headers: { authorization: 'Bearer ' + userInfo.token }}
                );
                dispatch({type: 'PAY_SUCCESS', payload: data});
                toast.success('Order is paid')
            }
            catch(err){
                dispatch({type: "PAY_FAIL", payload: getError(err)});
                toast.error(getError(err));
            }
        });
    }
    function onError(err) {
        toast.error(getError(err));
    }
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(API_URL + "/orders/" + orderId, { headers: { authorization: 'Bearer ' + userInfo.token } });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                console.log("ORDER :",order)
            }
            catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        }
        if (!userInfo) {
            return navigate('/login');
        }
        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            fetchOrder();
            if(successPay) {
                dispatch({type: 'PAY_RESET'})
            }
        }else{
            const loadPaypalScript = async ()=>{
            const {data : clientId} = await axios.get(API_URL + "/key/paypal", { headers: { authorization: 'Bearer ' + userInfo.token } });
            paypalDispatch({
                type: 'resetOptions',
                value:{
                    clientId: clientId,
                    currency: 'USD',
                }
            });
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
            loadPaypalScript();
        }
    }, [order, orderId, userInfo, navigate, paypalDispatch, successPay])
    return (
        loading ? (<LoadingBox></LoadingBox>) :
            error ? (<MessageBox variant="danger">{error}</MessageBox>) :
                (<div>
                    <Helmet>
                        <title>Order {orderId}</title>
                    </Helmet>
                    <h1 className='my-3'>Order {orderId}</h1>
                    <Row>
                        <Col md={8}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Shipping</Card.Title>
                                    <Card.Text>
                                        <b>Name: </b> {order.shippingAddress.fullname} <br />
                                        <b>Address: </b> {order.shippingAddress.address}, {order.shippingAddress.city},
                                        {order.shippingAddress.postalcode}, {order.shippingAddress.country}<br />
                                    </Card.Text>
                                    {order.isDelivered ? (<MessageBox variant='success'>Delivered at {order.deliveredAt}</MessageBox>) :
                                        (<MessageBox variant='danger'>not Delivered</MessageBox>)}
                                </Card.Body>
                            </Card>
                            <Card className='mb-3'>
                                <Card.Body>
                                    <Card.Title>Payment</Card.Title>
                                    <Card.Text>
                                        <b>Method: </b> {order.paymentMethod}
                                    </Card.Text>
                                    {order.isPaid ? (<MessageBox variant='success'>Paid at {order.paidAt}</MessageBox>) :
                                        (<MessageBox variant='danger'>not Paid</MessageBox>)}
                                </Card.Body>
                            </Card>
                            <Card className='mb-3'>
                                <Card.Body>
                                    <Card.Title>Items</Card.Title>
                                    <ListGroup variant="flash">
                                        {
                                            order.orderItems.map((item) => {
                                                return (
                                                    <ListGroup.Item key={item._id}>
                                                        <Row className='align-items-center'>
                                                            <Col md={6}>
                                                                <img src={item.Product_image} alt={item.Product_name} className='img-fluid rounded img-thumbnail' />
                                                                <Link to={`/product/${item.slug}`}>{item.Product_name}</Link>
                                                            </Col>
                                                            <Col md={3}>
                                                                <span>{item.quantity}</span>
                                                            </Col>
                                                            <Col md={3}>
                                                                <span>₹ {item.Product_Price}</span>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                )
                                            })
                                        }
                                    </ListGroup>
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
                                                <Col>₹ {order.itemsPrice?.toFixed(2)?? '0.00'}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Shipping</Col>
                                                <Col>₹ {order.shippingPrice?.toFixed(2)?? '0.00'}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Tax</Col>
                                                <Col>₹ {order.taxPrice?.toFixed(2)?? '0.00'}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><strong>Order Total</strong></Col>
                                                <Col>₹ {order.totalPrice?.toFixed(2)?? '0.00'}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {
                                            !order.isPaid && (
                                                <ListGroup.Item>
                                                    {isPending ? (<LoadingBox />) :
                                                    (<div>
                                                        <PayPalButtons createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}></PayPalButtons>
                                                    </div>)
                                                    }
                                                    {loadingPay && <LoadingBox></LoadingBox>}
                                                </ListGroup.Item>
                                            )
                                        }
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </div>)
    )
}

export default OrderPage