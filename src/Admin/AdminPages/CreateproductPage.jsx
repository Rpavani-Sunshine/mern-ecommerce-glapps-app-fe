import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../Components/LodingBox';
import MessageBox from '../../Components/MessageBox';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Store } from '../../Redux/Store';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import { getError } from '../../Components/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
          case 'ADD_REQUEST':
            return { ...state, loadingUpdate: true };
          case 'ADD_SUCCESS':
            return { ...state, loadingUpdate: false };
          case 'ADD_FAIL':
            return { ...state, loadingUpdate: false };

        default:
            return state;
    }
};

function CreateproductPage() {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, loadingUpdate }, dispatch] =
        useReducer(reducer, {
            loading: false,
            error: '',
        });
    const [Product_name, setProduct_name] = useState('');
    const [slug, setSlug] = useState('');
    const [Product_Price, setProduct_Price] = useState('');
    const [Product_image, setProduct_image] = useState('');
    const [Category, setCategory] = useState('');
    const [count_InStock, setCount_InStock] = useState('');
    const [Brand, setBrand] = useState('');
    const [Description, setDescription] = useState('');
    
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          dispatch({ type: 'ADD_REQUEST' });
          await axios.post(
            `${API_URL}/admin/addproduct`,
            {
              Product_name,
              slug,
              Product_Price,
              Product_image,
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
            type: 'ADD_SUCCESS',
          });
          toast.success('Product added successfully');
          navigate('/admin/products');
        } catch (err) {
          toast.error(getError(err));
          dispatch({ type: 'ADD_FAIL' });
        }
      };

    return (
        <div>
            <Container className="small-container">
                <Helmet>
                    <title>Add Product</title>
                </Helmet>
                <h1>Add New Product</h1>

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
                        {/* <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={uploadFileHandler} />
              {loadingUpload && <LoadingBox></LoadingBox>}
            </Form.Group> */}

                        {/* <Form.Group className="mb-3" controlId="additionalImage">
              <Form.Label>Additional Images</Form.Label>
              <ListGroup variant="flush">
                {images?.map((x) => (
                  <ListGroup.Item key={x}>
                    {x}
                    <Button variant="light" onClick={() => deleteFileHandler(x)}>
                      <i className="fa fa-times-circle"></i>
                    </Button>
                  </ListGroup.Item>
                )) || <MessageBox>No image</MessageBox>}
              </ListGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="additionalImageFile">
              <Form.Label>Upload Aditional Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => uploadFileHandler(e, true)}
              />
              {loadingUpload && <LoadingBox></LoadingBox>}
            </Form.Group> */}

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
                                Add Product
                            </Button>
                            {loadingUpdate && <LoadingBox></LoadingBox>}
                        </div>
                    </Form>
                )}
            </Container>
        </div>
    )
}

export default CreateproductPage