import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { API_URL } from '../config.js';
import { useNavigate, useParams } from 'react-router-dom'
import Rating from '../Components/Rating.jsx';
// React-bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Components/LodingBox.jsx';
import MessageBox from '../Components/MessageBox.jsx';
import { getError } from '../Components/utils.js';
import { Store } from '../Redux/Store.js';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

function Productpage() {
  // using useParams hook from react-router-dom to get slug value
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    // calling get method API
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(API_URL + "/products/slug/" + slug)
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: getError(error) });
      }
    };
    fetchProducts();
  }, [slug]);

  const {state, dispatch : ctxDispatch} = useContext(Store);
  const {cart} = state;
  const navigate = useNavigate();
  const addToCartHandler= async ()=>{
    const ItemFound = cart.cartItems.find(item=>item._id === product._id);
    const quantity = ItemFound ? ItemFound.quantity+1 : 1;
    const {data} = await axios.get(API_URL + "/products/" + product._id);
    if(data.count_InStock < quantity){
      window.alert("Sorry! Product is out of stock")
      return;
    }
    ctxDispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}})
    navigate('/cart')
  }
  return (
    loading ? <div className='text-center'><LoadingBox /></div> :
      error ? <div className='text-center'><MessageBox variant="danger">{error}</MessageBox></div> :
        <Container>
          <Row >
            <Col md={6}>
              <div className='w-lg-50 '>
                <img className='img-large w-100' src={product.Product_image} alt={product.Product_name}></img>
              </div>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Helmet>
                  <title>{product.Product_name}</title>
                  </Helmet>
                  <h1>{product.Product_name}</h1>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.Product_rating}
                    numReviews={product.numReviews} />
                </ListGroup.Item>
                <ListGroup.Item>
                  Price : <span> <i className="fa-solid fa-indian-rupee-sign"></i> </span> {product.Product_Price}
                </ListGroup.Item> 
                <ListGroup.Item>
                  Description :
                  <p>{product.Description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <Row>
                        <Col>Price : </Col>
                        <Col><span> <i className="fa-solid fa-indian-rupee-sign"></i> </span> {product.Product_Price} </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status : </Col>
                        <Col>
                          {product.count_InStock > 0 ?
                            <Badge bg="success">In Stock</Badge>
                            : <Badge bg="danger">Stock Out</Badge>
                          }
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {product.count_InStock > 0 && (
                      <ListGroup.Item>
                        <div className="d-grid">
                          <Button variant="primary" onClick={addToCartHandler}>
                            Add to Cart
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )
                    }
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
  )
}

export default Productpage