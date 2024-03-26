import React, { useContext, useReducer, useState } from 'react'
import { Store } from '../Redux/Store';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify';
import { getError } from '../Components/utils';
import axios from 'axios';
import { API_URL } from '../config';

const reducer = (state, action) =>{
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false};
        default:
            return state;
    }
}

function UserProfilePage() {
    const { state , dispatch:ctxDispatch} = useContext(Store);
    const { userInfo } = state;
    const [username, setUsername] = useState(userInfo.username);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    });
    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.put(API_URL + '/users/profile',
            {
                username,
                email,
                password
            },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    },
                }
            );
            dispatch({ type: 'UPDATE_SUCCESS' });
            ctxDispatch({type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("User updated successfully");
        }
        catch (error) {
            dispatch({ type: 'FETCH_FAIL' });
            toast.error(getError(error));
        }
     };
    return (
        <div className='container small-container'>
            <Helmet>
                <title>profile</title>
            </Helmet>
            <h1 className='my-3'>User Profile</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={username} onChange={(e) => { setUsername(e.target.value) }} require />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control value={email} onChange={(e) => { setEmail(e.target.value) }} require />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control value={password} onChange={(e) => { setPassword(e.target.value) }} require />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} require />
                </Form.Group>
                <div className='mb-3'>
                    <Button type="submit">Update</Button>
                </div>
            </Form>
        </div>
    )
}

export default UserProfilePage