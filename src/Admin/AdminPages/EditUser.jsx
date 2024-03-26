import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../Redux/Store';
import { getError } from '../../Components/utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import LoadingBox from '../../Components/LodingBox';
import MessageBox from '../../Components/MessageBox';
import { API_URL } from '../../config';

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      case 'UPDATE_REQUEST':
        return { ...state, loadingUpdate: true };
      case 'UPDATE_SUCCESS':
        return { ...state, loadingUpdate: false };
      case 'UPDATE_FAIL':
        return { ...state, loadingUpdate: false };
      default:
        return state;
    }
  };

function EditUser() {
    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
      });
    
      const { state } = useContext(Store);
      const { userInfo } = state;
    
      const params = useParams();
      const { id: userId } = params;
      const navigate = useNavigate();
    
      const [User_name, setUser_name] = useState('');
      const [email, setEmail] = useState('');
      const [isAdmin, setIsAdmin] = useState(false);
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`${API_URL}/admin/getuser/${userId}`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            setUser_name(data.User_name);
            setEmail(data.email);
            setIsAdmin(data.isAdmin);
            dispatch({ type: 'FETCH_SUCCESS' });
          } catch (err) {
            dispatch({
              type: 'FETCH_FAIL',
              payload: getError(err),
            });
          }
        };
        fetchData();
      }, [userId, userInfo]);
    
      const submitHandler = async (e) => {
        e.preventDefault();
        try {
          dispatch({ type: 'UPDATE_REQUEST' });
          await axios.put(
            `${API_URL}/admin/updateuser/${userId}`,
            { _id: userId, User_name, email, isAdmin },
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          dispatch({
            type: 'UPDATE_SUCCESS',
          });
          toast.success('User updated successfully');
          navigate('/admin/users');
        } catch (error) {
          toast.error(getError(error));
          dispatch({ type: 'UPDATE_FAIL' });
        }
      };
  return (
    <div>
         <Container className="small-container">
      <Helmet>
        <title>Edit User ${userId}</title>
      </Helmet>
      <h1>Edit User {userId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="User_name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={User_name}
              onChange={(e) => setUser_name(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
    </div>
  )
}

export default EditUser