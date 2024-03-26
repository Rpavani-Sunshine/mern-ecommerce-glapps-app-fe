import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../Components/LodingBox'
import MessageBox from '../Components/MessageBox'
import { Store } from '../Redux/Store';
import { useNavigate } from 'react-router-dom';
import { getError } from '../Components/utils';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { API_URL } from '../config';

// define Reducer
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, orders: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function OrderHistoryPage() {

    const { state } = useContext(Store);
    const { userInfo } = state;
    const Navigate = useNavigate()

    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        // orders: {}
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(API_URL + '/orders/orderhistory',
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`
                        },
                    }
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }
            catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            }
        }
        fetchData();

    }, [userInfo]);

    return (
        <div className='row'>
            <div className='col-12'>
                <Helmet>
                    <title>Order History</title>
                </Helmet>
                {
                    loading ? (<LoadingBox></LoadingBox>) :
                        error ? (<MessageBox variant='danger'>{error}</MessageBox>)
                            : (
                                <div className="table-responsive p-2">
                                    <table className='table w-100'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>DATE</th>
                                            <th>TOTAL</th>
                                            <th>PAID</th>
                                            <th>DELIVERED</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            orders.map((order) => {
                                                return (
                                                    <tr key={order._id}>
                                                        <td>{order._id}</td>
                                                        <td>{order.createdAt.substring(0, 10)}</td>
                                                        <td>{order.totalPrice.toFixed(2)}</td>
                                                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                                        <td>
                                                            {
                                                                order.isDelivered ?
                                                                    order.deliveredAt.substring(0, 10)
                                                                    :
                                                                    'No'
                                                            }
                                                        </td>
                                                        <td>
                                                            <Button type='button' variant='light'
                                                                onClick={() => {
                                                                    Navigate(`/order/${order._id}`);
                                                                }}
                                                            >Details</Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }

                                    </tbody>

                                </table>
                                </div>
                            )
                }

            </div>
        </div>
    )
}

export default OrderHistoryPage