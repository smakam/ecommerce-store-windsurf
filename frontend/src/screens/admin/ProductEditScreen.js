import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';
import FormContainer from '../../components/ui/FormContainer';
import {
  getProductDetails,
  updateProduct,
  clearError,
  clearSuccess,
} from '../../redux/slices/productSlice';
import { toast } from 'react-toastify';
import Meta from '../../components/ui/Meta';

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [uploading, setUploading] = useState(false);

  const { loading, error, product, success } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      return;
    }

    if (success) {
      dispatch(clearSuccess());
      toast.success('Product updated successfully');
      navigate('/admin/productlist');
    } else {
      if (!product || !product.name || product._id !== id) {
        dispatch(getProductDetails(id));
      } else {
        setName(product.name);
        setPrice(product.price);
        setDiscountPrice(product.discountPrice || 0);
        setImage(product.image);
        setImages(product.images || []);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setSpecifications(
          product.specifications && product.specifications.length > 0
            ? product.specifications
            : [{ key: '', value: '' }]
        );
      }
    }
  }, [dispatch, navigate, id, product, success, userInfo]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImage(data.image);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleFilesHandler = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images', file);
    });
    
    setUploading(true);

    try {
      const response = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImages([...images, ...data.images]);
        toast.success('Images uploaded successfully');
      } else {
        throw new Error(data.message || 'Failed to upload images');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImageHandler = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
  };

  const addSpecificationField = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecificationField = (index) => {
    const updatedSpecs = [...specifications];
    updatedSpecs.splice(index, 1);
    setSpecifications(updatedSpecs);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Filter out empty specifications
    const filteredSpecs = specifications.filter(spec => spec.key.trim() !== '' && spec.value.trim() !== '');
    
    dispatch(
      updateProduct({
        _id: id,
        name,
        price,
        discountPrice,
        image,
        images,
        brand,
        category,
        description,
        countInStock,
        specifications: filteredSpecs,
      })
    );
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <Meta title="ShopHub | Edit Product" />
        <h1>Edit Product</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="price" className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="discountPrice" className="mb-3">
                  <Form.Label>Discount Price (Optional)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter discount price"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Main Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              ></Form.Control>
              <Form.Control
                type="file"
                label="Choose File"
                onChange={uploadFileHandler}
                className="mt-2"
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="additionalImages" className="mb-3">
              <Form.Label>Additional Images</Form.Label>
              <div className="d-flex flex-wrap mb-2">
                {images.map((img, index) => (
                  <div key={index} className="position-relative me-2 mb-2">
                    <img
                      src={img}
                      alt={`Product ${index}`}
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      onClick={() => removeImageHandler(index)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                ))}
              </div>
              <Form.Control
                type="file"
                multiple
                onChange={uploadMultipleFilesHandler}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="brand" className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="countInStock" className="mb-3">
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter countInStock"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home & Kitchen</option>
                <option value="Beauty">Beauty & Personal Care</option>
                <option value="Sports">Sports & Outdoors</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="specifications" className="mb-3">
              <Form.Label>Specifications</Form.Label>
              {specifications.map((spec, index) => (
                <Row key={index} className="mb-2">
                  <Col md={5}>
                    <Form.Control
                      type="text"
                      placeholder="Key (e.g., Color)"
                      value={spec.key}
                      onChange={(e) =>
                        handleSpecificationChange(index, 'key', e.target.value)
                      }
                    />
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      type="text"
                      placeholder="Value (e.g., Blue)"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecificationChange(index, 'value', e.target.value)
                      }
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="danger"
                      onClick={() => removeSpecificationField(index)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={addSpecificationField}
                className="mt-2"
              >
                <FaPlus /> Add Specification
              </Button>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
