import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';
import Paginate from '../../components/ui/Paginate';
import {
  listProducts,
  deleteProduct,
  createProduct,
  clearError,
} from '../../redux/slices/productSlice';
import { toast } from 'react-toastify';
import Meta from '../../components/ui/Meta';

const ProductListScreen = () => {
  const { pageNumber = 1 } = useParams();
  const [category, setCategory] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, products, page, pages, success } = useSelector(
    (state) => state.product
  );

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      return;
    }

    dispatch(
      listProducts({
        pageNumber,
        category,
        sortField,
        sortOrder,
      })
    );
  }, [dispatch, navigate, userInfo, pageNumber, category, sortField, sortOrder, success]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => {
          toast.success('Product deleted successfully');
        })
        .catch((err) => {
          toast.error(err || 'Failed to delete product');
        });
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct())
      .unwrap()
      .then((product) => {
        navigate(`/admin/product/${product._id}/edit`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to create product');
      });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'newest') {
      setSortField('createdAt');
      setSortOrder('desc');
    } else if (value === 'oldest') {
      setSortField('createdAt');
      setSortOrder('asc');
    } else if (value === 'priceAsc') {
      setSortField('price');
      setSortOrder('asc');
    } else if (value === 'priceDesc') {
      setSortField('price');
      setSortOrder('desc');
    } else if (value === 'nameAsc') {
      setSortField('name');
      setSortOrder('asc');
    } else if (value === 'nameDesc') {
      setSortField('name');
      setSortOrder('desc');
    }
  };

  return (
    <>
      <Meta title="ShopHub | Admin Products" />
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="category">
            <Form.Label>Filter by Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home & Kitchen</option>
              <option value="Beauty">Beauty & Personal Care</option>
              <option value="Sports">Sports & Outdoors</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="sort">
            <Form.Label>Sort By</Form.Label>
            <Form.Select
              value={
                sortField === 'createdAt' && sortOrder === 'desc'
                  ? 'newest'
                  : sortField === 'createdAt' && sortOrder === 'asc'
                  ? 'oldest'
                  : sortField === 'price' && sortOrder === 'asc'
                  ? 'priceAsc'
                  : sortField === 'price' && sortOrder === 'desc'
                  ? 'priceDesc'
                  : sortField === 'name' && sortOrder === 'asc'
                  ? 'nameAsc'
                  : 'nameDesc'
              }
              onChange={handleSortChange}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceAsc">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option>
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>STOCK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    {product.countInStock > 0 ? (
                      product.countInStock
                    ) : (
                      <span className="text-danger">Out of Stock</span>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-1">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm mx-1"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
