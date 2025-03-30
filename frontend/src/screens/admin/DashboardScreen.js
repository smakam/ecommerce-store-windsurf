import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUsers, FaShoppingCart, FaBoxOpen, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';
import Meta from '../../components/ui/Meta';
import { getAdminDashboard } from '../../redux/slices/adminSlice';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'

  const { loading, error, dashboard } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminDashboard(timeRange));
  }, [dispatch, timeRange]);

  // Sample data for charts (in a real app, this would come from the API)
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  const productCategoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Books', value: 200 },
    { name: 'Home', value: 278 },
    { name: 'Beauty', value: 189 },
  ];

  return (
    <>
      <Meta title="ShopHub | Admin Dashboard" />
      <h1>Dashboard</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="dashboard-card bg-primary text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="card-title mb-0">Total Sales</h6>
                      <h3 className="mt-2 mb-0">${dashboard?.totalSales || '0.00'}</h3>
                    </div>
                    <div className="dashboard-icon">
                      <FaDollarSign size={30} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={dashboard?.salesGrowth >= 0 ? 'text-success' : 'text-danger'}>
                      {dashboard?.salesGrowth || 0}% {dashboard?.salesGrowth >= 0 ? 'increase' : 'decrease'}
                    </span>{' '}
                    from last period
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="dashboard-card bg-success text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="card-title mb-0">Total Orders</h6>
                      <h3 className="mt-2 mb-0">{dashboard?.totalOrders || 0}</h3>
                    </div>
                    <div className="dashboard-icon">
                      <FaShoppingCart size={30} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={dashboard?.ordersGrowth >= 0 ? 'text-light' : 'text-danger'}>
                      {dashboard?.ordersGrowth || 0}% {dashboard?.ordersGrowth >= 0 ? 'increase' : 'decrease'}
                    </span>{' '}
                    from last period
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="dashboard-card bg-warning text-dark">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="card-title mb-0">Total Products</h6>
                      <h3 className="mt-2 mb-0">{dashboard?.totalProducts || 0}</h3>
                    </div>
                    <div className="dashboard-icon">
                      <FaBoxOpen size={30} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={dashboard?.productsGrowth >= 0 ? 'text-success' : 'text-danger'}>
                      {dashboard?.productsGrowth || 0}% {dashboard?.productsGrowth >= 0 ? 'increase' : 'decrease'}
                    </span>{' '}
                    from last period
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="dashboard-card bg-info text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="card-title mb-0">Total Users</h6>
                      <h3 className="mt-2 mb-0">{dashboard?.totalUsers || 0}</h3>
                    </div>
                    <div className="dashboard-icon">
                      <FaUsers size={30} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={dashboard?.usersGrowth >= 0 ? 'text-light' : 'text-danger'}>
                      {dashboard?.usersGrowth || 0}% {dashboard?.usersGrowth >= 0 ? 'increase' : 'decrease'}
                    </span>{' '}
                    from last period
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Time Range Selector */}
          <div className="mb-4 d-flex justify-content-end">
            <div className="btn-group">
              <Button
                variant={timeRange === 'day' ? 'primary' : 'outline-primary'}
                onClick={() => setTimeRange('day')}
              >
                Day
              </Button>
              <Button
                variant={timeRange === 'week' ? 'primary' : 'outline-primary'}
                onClick={() => setTimeRange('week')}
              >
                Week
              </Button>
              <Button
                variant={timeRange === 'month' ? 'primary' : 'outline-primary'}
                onClick={() => setTimeRange('month')}
              >
                Month
              </Button>
              <Button
                variant={timeRange === 'year' ? 'primary' : 'outline-primary'}
                onClick={() => setTimeRange('year')}
              >
                Year
              </Button>
            </div>
          </div>

          {/* Charts */}
          <Row className="mb-4">
            <Col md={8}>
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Sales Overview</h5>
                  <FaChartLine />
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Product Categories</h5>
                  <FaBoxOpen />
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={productCategoryData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Orders */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Orders</h5>
                  <Link to="/admin/orderlist" className="btn btn-sm btn-outline-primary">
                    View All
                  </Link>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Delivered</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard?.recentOrders?.length > 0 ? (
                        dashboard.recentOrders.map((order) => (
                          <tr key={order._id}>
                            <td>{order._id.substring(0, 8)}...</td>
                            <td>{order.user?.name || 'N/A'}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>${order.totalPrice.toFixed(2)}</td>
                            <td>
                              {order.isPaid ? (
                                <span className="badge bg-success">Paid</span>
                              ) : (
                                <span className="badge bg-danger">Not Paid</span>
                              )}
                            </td>
                            <td>
                              {order.isDelivered ? (
                                <span className="badge bg-success">Delivered</span>
                              ) : (
                                <span className="badge bg-danger">Not Delivered</span>
                              )}
                            </td>
                            <td>
                              <Link to={`/order/${order._id}`} className="btn btn-sm btn-light">
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No recent orders
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Top Products */}
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Top Selling Products</h5>
                  <Link to="/admin/productlist" className="btn btn-sm btn-outline-primary">
                    View All
                  </Link>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard?.topProducts?.length > 0 ? (
                        dashboard.topProducts.map((product) => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>{product.sold}</td>
                            <td>${(product.price * product.sold).toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Low Stock Products</h5>
                  <Link to="/admin/productlist" className="btn btn-sm btn-outline-primary">
                    View All
                  </Link>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard?.lowStockProducts?.length > 0 ? (
                        dashboard.lowStockProducts.map((product) => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>
                              <span className="text-danger fw-bold">{product.countInStock}</span>
                            </td>
                            <td>
                              <Link to={`/admin/product/${product._id}/edit`} className="btn btn-sm btn-warning">
                                Update Stock
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No low stock products
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default DashboardScreen;
