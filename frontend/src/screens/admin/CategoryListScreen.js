import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';
import Paginate from '../../components/ui/Paginate';
import {
  listCategories,
  deleteCategory,
  createCategory,
  updateCategory,
} from '../../redux/slices/categorySlice';
import Meta from '../../components/ui/Meta';

const CategoryListScreen = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, categories, page, pages } = useSelector(
    (state) => state.category
  );

  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.category);

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = useSelector((state) => state.category);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(listCategories({ keyword, pageNumber }));
  }, [dispatch, successDelete, successCreate, successUpdate, keyword, pageNumber]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  const createCategoryHandler = () => {
    setName('');
    setDescription('');
    setShowCreateModal(true);
  };

  const submitCreateHandler = () => {
    dispatch(createCategory({ name, description }));
    setShowCreateModal(false);
  };

  const editCategoryHandler = (category) => {
    setCurrentCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setShowEditModal(true);
  };

  const submitEditHandler = () => {
    dispatch(
      updateCategory({
        id: currentCategory._id,
        name,
        description,
      })
    );
    setShowEditModal(false);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    setPageNumber(1);
    dispatch(listCategories({ keyword, pageNumber: 1 }));
  };

  return (
    <>
      <Meta title="ShopHub | Admin Categories" />
      <Row className="align-items-center">
        <Col>
          <h1>Categories</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createCategoryHandler}>
            <FaPlus /> Create Category
          </Button>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-3">
        <Col md={6}>
          <Form onSubmit={searchHandler}>
            <Form.Group controlId="search" className="d-flex">
              <Form.Control
                type="text"
                placeholder="Search categories..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              ></Form.Control>
              <Button type="submit" variant="outline-success" className="ms-2">
                Search
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

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
                <th>DESCRIPTION</th>
                <th>PRODUCT COUNT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>{category.productCount || 0}</td>
                  <td>
                    <Button
                      variant="light"
                      className="btn-sm mx-1"
                      onClick={() => editCategoryHandler(category)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      className="btn-sm mx-1"
                      onClick={() => deleteHandler(category._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} keyword={keyword ? keyword : ''} />
        </>
      )}

      {/* Create Category Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter category description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={submitCreateHandler}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="editDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter category description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={submitEditHandler}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CategoryListScreen;
