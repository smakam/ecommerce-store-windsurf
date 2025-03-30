import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart({ id: product._id, quantity: 1 }));
  };

  return (
    <Card className="my-3 p-3 rounded product-card">
      <Link to={`/product/${product._id}`}>
        <Card.Img 
          src={product.images && product.images.length > 0 ? 
            (product.images[0].url ? product.images[0].url : 
              (typeof product.images[0] === 'object' && Object.keys(product.images[0]).length > 100 ? 
                Object.keys(product.images[0])
                  .filter(key => !isNaN(parseInt(key)))
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map(key => product.images[0][key])
                  .join('') : 
                product.images[0])) : 
            '/images/placeholder.jpg'} 
          variant="top" 
          className="product-image"
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <Card.Text as="h3" className="mb-0">
            {product.discountPrice > 0 ? (
              <>
                <span className="text-danger">${product.discountPrice.toFixed(2)}</span>{' '}
                <small className="text-muted text-decoration-line-through">
                  ${product.price.toFixed(2)}
                </small>
              </>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </Card.Text>
          
          {product.countInStock > 0 ? (
            <Button 
              onClick={addToCartHandler} 
              variant="primary" 
              size="sm"
              disabled={product.countInStock === 0}
            >
              Add to Cart
            </Button>
          ) : (
            <Button variant="light" size="sm" disabled>
              Out of Stock
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
