import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTimes, FaCheck } from 'react-icons/fa';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';
import { listOrders } from '../../redux/slices/orderSlice';
import Meta from '../../components/ui/Meta';

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const { loading, error, orders } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.role === 'admin') {
      dispatch(listOrders({ status: filterStatus, sort: sortOrder }));
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, filterStatus, sortOrder]);

  const getStatusVariant = (order) => {
    if (order.isCancelled) return 'danger';
    if (order.isDelivered) return 'success';
    if (order.isPaid) return 'primary';
    return 'warning';
  };

  const getStatusText = (order) => {
    if (order.isCancelled) return 'Cancelled';
    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Processing';
    return 'Pending';
  };

  const filteredOrders = orders ? [...orders] : [];

  return (
    <>
      <Meta title="ShopHub | Admin Orders" />
      <h1>Orders</h1>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="filterStatus">
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="sortOrder">
            <Form.Label>Sort By</Form.Label>
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceHighest">Price: High to Low</option>
              <option value="priceLowest">Price: Low to High</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <span className={`badge bg-${getStatusVariant(order)}`}>
                    {getStatusText(order)}
                  </span>
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      <FaEye />
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
