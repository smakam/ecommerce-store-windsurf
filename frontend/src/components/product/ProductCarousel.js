import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../ui/Loader';
import Message from '../ui/Message';
import { getTopProducts } from '../../redux/slices/productSlice';

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const { topProducts, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getTopProducts());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : topProducts && topProducts.length > 0 ? (
    <Carousel pause="hover" className="bg-dark mb-4 product-carousel">
      {topProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fluid 
              className="carousel-image"
            />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.discountPrice > 0 ? product.discountPrice.toFixed(2) : product.price.toFixed(2)})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  ) : null;
};

export default ProductCarousel;
