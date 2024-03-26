import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config.js';
// React-bootstrap components
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import { Store } from '../Redux/Store';

function Product(props) {
    const { product } = props;
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart: { cartItems } } = state;

    const addToCartHandler = async (item) => {
        const ItemFound = cartItems.find(item => item._id === product._id);
        const quantity = ItemFound ? ItemFound.quantity + 1 : 1;
        const { data } = await axios.get(API_URL + "/products/" + item._id);
        if (data.count_InStock < quantity) {
            window.alert("Sorry! Product is out of stock")
            return;
        }
        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
    }
    return (
        <Card className='product'>
            <Link to={`/product/${product.slug}`}>
                <img className='card-img-top' src={product.Product_image} alt={product.Product_name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title><p>{product.Product_name}</p></Card.Title>
                </Link>
                {/* rendering Rating Component */}
                <Rating rating={product.Product_Rating} numReviews={product.numReviews} />
                <Card.Text><p><i className="fa-solid fa-indian-rupee-sign"></i> {product.Product_Price}</p></Card.Text>
                {product.count_InStock === 0 ? <Button variant='light' disabled>Out of stock</Button> :
                    <Button onClick={() => addToCartHandler(product)}>Add cart</Button>
                }
            </Card.Body>
        </Card>
    )
}

export default Product