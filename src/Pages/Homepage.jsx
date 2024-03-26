import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { API_URL } from '../config.js';
import logger from 'use-reducer-logger';
import Product from '../Components/Product.jsx';
// React-bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';
import LodingBox from '../Components/LodingBox.jsx';
import MessageBox from '../Components/MessageBox.jsx';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

function Homepage() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    // calling get method API
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(API_URL + "/products")
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };
    fetchProducts();
  }, [])
  return (
    <div>
      <Helmet>
        <title>glapps</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div>
        {
          loading ? <div><LodingBox /></div> : error ? <MessageBox variant="danger">{error}</MessageBox>
            : <Row>
              {
                products.map(product => {
                  return (
                    <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
                      <Product product={product} />
                    </Col>
                  )
                })
              }
            </Row>
        }
      </div>
    </div>
  )
}

export default Homepage