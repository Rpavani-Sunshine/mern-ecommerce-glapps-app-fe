import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Redux/Store';
import { useNavigate } from 'react-router-dom';
import ChekoutSteps from '../Components/ChekoutSteps';

function Shippingpage() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart: { shippingAddress }, userInfo } = state;

    const [fullname, setFullname] = useState(shippingAddress.fullname || '')
    const [address, setAddress] = useState(shippingAddress.address || '')
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalcode, setPostalcode] = useState(shippingAddress.postalcode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const navigate = useNavigate();

    const submitHandler = (event) => {
        event.preventDefault();
        ctxDispatch({
            type: "SAVE_SHIPPING_ADDRESS",
            payload: {
                fullname,
                address,
                city,
                postalcode,
                country
            }
        });
        localStorage.setItem('shippingAddress', JSON.stringify({
            fullname,
            address,
            city,
            postalcode,
            country
        })
        );
        navigate('/payment');
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/shipping');
        }
    }, [userInfo, navigate])
    return (
        <div>
            <Helmet>
                <title>Shipping</title>
            </Helmet>
            <ChekoutSteps step1 step2></ChekoutSteps>
            <div className='container small-container'>
                <h1 className='my-3'>Shipping Address</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='mb-3' controlId='fullName'>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control value={fullname} onChange={(e) => setFullname(e.target.value)} required></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='address'>
                        <Form.Label>Address</Form.Label>
                        <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} required></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='city'>
                        <Form.Label>City</Form.Label>
                        <Form.Control value={city} onChange={(e) => setCity(e.target.value)} required></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='postalcode'>
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control value={postalcode} onChange={(e) => setPostalcode(e.target.value)} required></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='country'>
                        <Form.Label>Country</Form.Label>
                        <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} required></Form.Control>
                    </Form.Group>
                    <div className="mb-3">
                        <Button variant="primary" type="submit">
                            Continue
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Shippingpage