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

function EditproductPage() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [Product_name, setProduct_name] = useState('');
  const [slug, setSlug] = useState('');
  const [Product_Price, setProduct_Price] = useState('');
  const [Product_image, setProduct_image] = useState('');
  const [images, setImages] = useState([]);
  const [Category, setCategory] = useState('');
  const [count_InStock, setCount_InStock] = useState('');
  const [Brand, setBrand] = useState('');
  const [Description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${API_URL}/products/${productId}`);
        setProduct_name(data.Product_name);
        setSlug(data.slug);
        setProduct_Price(data.Product_Price);
        setProduct_image(data.Product_image);
        setImages(data.images);
        setCategory(data.Category);
        setCount_InStock(data.count_InStock);
        setBrand(data.Brand);
        setDescription(data.Description);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${API_URL}/admin/editproduct/${productId}`,
        {
          _id: productId,
          Product_name,
          slug,
          Product_Price,
          Product_image,
          images,
          Category,
          Brand,
          count_InStock,
          Description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  return (
    <div>
      <Container className="small-container">
        <Helmet>
          <title>Edit Product ${productId}</title>
        </Helmet>
        <h1>Edit Product {productId}</h1>

        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="Product_name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={Product_name}
                onChange={(e) => setProduct_name(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="slug">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Product_Price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                value={Product_Price}
                onChange={(e) => setProduct_Price(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Product_image">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                value={Product_image}
                onChange={(e) => setProduct_image(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={Category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                value={Brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="count_InStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                value={count_InStock}
                onChange={(e) => setCount_InStock(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
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

export default EditproductPage



