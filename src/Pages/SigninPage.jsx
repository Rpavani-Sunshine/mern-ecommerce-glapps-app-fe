import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Store } from '../Redux/Store.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config.js';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify';
import { getError } from '../Components/utils.js';


function SigninPage() {
    const {search}= useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl? redirectInUrl : '/';

    const { state,dispatch:ctxDispatch}=useContext(Store)
    const {userInfo}=state
    const navigate = useNavigate();
    const [email, setEmail]= useState('')
    const [password, setPassword]= useState('')
    const submitHandler = async (event)=>{
        event.preventDefault();
        try {
            const body = {email, password}
            const {data}=   await axios.post(API_URL+"/users/signin",body);
            ctxDispatch({type:'USER_SIGNIN',payload:data});
            localStorage.setItem('userInfo',JSON.stringify(data));
            navigate(redirect || '/');
        } catch (error) {
            toast.error(getError(error));
        }
    }
    useEffect(()=>{
        if(userInfo){
          navigate(redirect);
        }
      },[navigate, redirect, userInfo]);
  return (
    <Container className='small-container'>
        <Helmet>
            <title>Signin</title>
        </Helmet>
        <h1 className='my-3'>Sign In</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required onChange={(e)=>setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" required onChange={(e)=>setPassword(e.target.value)} />
            </Form.Group>

            <div className='mb-3'>
                <Button type="submit">Sign In</Button>
            </div>

            <div className='mb-3'>
                New Custormer ? {' '}
                <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
            </div>
        </Form>
    </Container>
  )
}

export default SigninPage