import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Tabs, Tab, Nav } from 'react-bootstrap';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import { inventoryApi } from '../api/inventoryApi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

// Category groups
enum CategoryGroup {
  CORE_MEDICATION = 'Core Medication',
  ADDITIONAL = 'Additional',
  ADMINISTRATIVE = 'Administrative'
}

// Subcategory types
enum SubcategoryType {
  PRESCRIPTION = 'Prescription Medications',
  OTC = 'Over-the-Counter (OTC) Medications',
  MEDICAL_SUPPLIES = 'Medical Supplies',
  VITAMINS_SUPPLEMENTS = 'Vitamins and Supplements',
  PERSONAL_CARE = 'Personal Care Products',
  CONTROLLED_SUBSTANCES = 'Controlled Substances',
  INVENTORY_ATTRIBUTES = 'Inventory Attributes'
}

// Core medication categories with subcategories
const CORE_MEDICATION_CATEGORIES = {
  [SubcategoryType.PRESCRIPTION]: [
    'Antibiotics',
    'Antihypertensives',
    'Antidiabetics',
    'Cardiovascular',
    'Pain Management',
    'Psychiatric',
    'Anticoagulants',
    'Gastrointestinal',
    'Respiratory',
    'Dermatological'
  ],
  [SubcategoryType.OTC]: [
    'Pain Relievers',
    'Cough and Cold',
    'Allergy',
    'Digestive Aids',
    'Sleep Aids',
    'Topical Treatments'
  ]
};

// Additional categories with subcategories
const ADDITIONAL_CATEGORIES = {
  [SubcategoryType.MEDICAL_SUPPLIES]: [
    'First Aid',
    'Bandages and Dressings',
    'Syringes and Needles',
    'Glucose Monitoring',
    'Mobility Aids'
  ],
  [SubcategoryType.VITAMINS_SUPPLEMENTS]: [
    'Multivitamins',
    'Minerals',
    'Herbal Supplements',
    'Protein Supplements',
    'Specialty Supplements'
  ],
  [SubcategoryType.PERSONAL_CARE]: [
    'Skin Care',
    'Dental Care',
    'Eye Care',
    'Baby Care',
    'Feminine Hygiene'
  ]
};

// Administrative categories with subcategories
const ADMINISTRATIVE_CATEGORIES = {
  [SubcategoryType.CONTROLLED_SUBSTANCES]: [
    'Schedule II',
    'Schedule III',
    'Schedule IV',
    'Schedule V'
  ],
  [SubcategoryType.INVENTORY_ATTRIBUTES]: [
    'Temperature-controlled',
    'Refrigerated',
    'Specialty',
    'Recall-affected',
    'Expiring'
  ]
  'Schedule V'
];

interface CategoryAnalytics {
  _id: string;
  count: number;
  totalValue: number;
  avgPrice: number;
  totalQuantity: number;
  profitMargin?: number;
  turnoverRate?: number;
  stockoutFrequency?: number;
  expiryRate?: number;
  seasonalDemand?: number[];
}

const Analytics: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryAnalytics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeCategoryGroup, setActiveCategoryGroup] = useState<CategoryGroup>(CategoryGroup.CORE_MEDICATION);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await inventoryApi.getAnalyticsByCategory();
        
        if (response.success) {
          // Enhanced data with calculated metrics for the hackathon demo
          const enhancedData = response.data.map(item => ({
            ...item,
            // Calculate profit margin based on price and cost (assuming a cost of 70% of price for demo)
            profitMargin: ((item.avgPrice - (item.avgPrice * 0.7)) / item.avgPrice) * 100,
            // Mock turnover rate (times inventory is sold and replaced in a period)
            turnoverRate: Math.random() * 10 + 1,
            // Mock stockout frequency (percentage of time item is out of stock)
            stockoutFrequency: Math.random() * 20,
            // Mock expiry rate (percentage of items that expire before being sold)
            expiryRate: Math.random() * 15,
            // Mock seasonal demand pattern (values representing demand by month)
            seasonalDemand: Array.from({ length: 12 }, () => Math.random() * 100 + 50)
          }));
          
          setCategoryData(enhancedData);
        } else {
          setError('Failed to fetch analytics data');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('An error occurred while fetching analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);  // Helper function to flatten subcategory arrays
  const flattenCategories = (categoryObj: Record<string, string[]>): string[] => {
    return Object.values(categoryObj).reduce((acc, val) => [...acc, ...val], []);
  };

  // Filter data by category group
  const filterDataByGroup = (group: CategoryGroup): CategoryAnalytics[] => {
    switch (group) {
      case CategoryGroup.CORE_MEDICATION:
        return categoryData.filter(item => 
          flattenCategories(CORE_MEDICATION_CATEGORIES).includes(item._id)
        );
      case CategoryGroup.ADDITIONAL:
        return categoryData.filter(item => 
          flattenCategories(ADDITIONAL_CATEGORIES).includes(item._id)
        );
      case CategoryGroup.ADMINISTRATIVE:
        return categoryData.filter(item => 
          flattenCategories(ADMINISTRATIVE_CATEGORIES).includes(item._id)
        );
      default:
        return categoryData;
    }
  };

  // Get data for the active category group
  const activeData = filterDataByGroup(activeCategoryGroup);
  
  // Chart colors
  const chartColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FFCA3A',
    '#FF6B6B', '#4ECDC4', '#1A535C', '#FFD166', '#06D6A0',
    '#118AB2', '#073B4C', '#F79256', '#7DCFB6', '#00B2CA'
  ];
  
  // Background colors with transparency
  const backgroundColors = chartColors.map(color => color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
  
  // Prepare sales data chart
  const salesChartData = {
    labels: activeData.map(item => item._id),
    datasets: [
      {
        label: 'Total Sales Value ($)',
        data: activeData.map(item => item.totalValue),
        backgroundColor: backgroundColors,
        borderColor: chartColors,
        borderWidth: 1
      }
    ]
  };

  // Prepare profit margin chart
  const profitChartData = {
    labels: activeData.map(item => item._id),
    datasets: [
      {
        label: 'Profit Margin (%)',
        data: activeData.map(item => item.profitMargin),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare expiry tracking chart
  const expiryChartData = {
    labels: activeData.map(item => item._id),
    datasets: [
      {
        label: 'Expiry Rate (%)',
        data: activeData.map(item => item.expiryRate),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare inventory turnover chart
  const turnoverChartData = {
    labels: activeData.map(item => item._id),
    datasets: [
      {
        label: 'Inventory Turnover Rate',
        data: activeData.map(item => item.turnoverRate),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare stockout frequency chart
  const stockoutChartData = {
    labels: activeData.map(item => item._id),
    datasets: [
      {
        label: 'Stockout Frequency (%)',
        data: activeData.map(item => item.stockoutFrequency),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare seasonal demand chart (for first item in active data as example)
  const seasonalDemandChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: activeData.slice(0, 3).map((item, index) => ({
      label: item._id,
      data: item.seasonalDemand,
      borderColor: chartColors[index % chartColors.length],
      backgroundColor: 'transparent',
      tension: 0.4
    }))
  };
          '#6A4C93',
          '#FFCA3A'
        ]
      }
    ]
  };

  const quantityChartData = {
    labels: categoryData.map(item => item._id),
    datasets: [
      {
        label: 'Total Quantity',
        data: categoryData.map(item => item.totalQuantity),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Pharmacy Inventory Analytics</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {!loading && categoryData.length === 0 ? (
        <Alert variant="info">
          No data available for analytics. Please add inventory items first.
        </Alert>
      ) : (
        <>
          {/* Category Group Selection */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Select Category Group</h5>
            </Card.Header>
            <Card.Body>
              <Nav variant="pills" className="mb-3">
                <Nav.Item>
                  <Nav.Link 
                    active={activeCategoryGroup === CategoryGroup.CORE_MEDICATION}
                    onClick={() => setActiveCategoryGroup(CategoryGroup.CORE_MEDICATION)}
                  >
                    Core Medication Categories
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeCategoryGroup === CategoryGroup.ADDITIONAL}
                    onClick={() => setActiveCategoryGroup(CategoryGroup.ADDITIONAL)}
                  >
                    Additional Categories
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeCategoryGroup === CategoryGroup.ADMINISTRATIVE}
                    onClick={() => setActiveCategoryGroup(CategoryGroup.ADMINISTRATIVE)}
                  >
                    Administrative Categories
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
          
          {/* Metric Tabs */}
          <Card className="mb-4">
            <Card.Header>
              <h5>{activeCategoryGroup} Analytics</h5>
            </Card.Header>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => k && setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="overview" title="Overview">
                  <Row className="mb-4">
                    <Col md={6} className="mb-4">
                      <Card>
                        <Card.Header>Sales by Category</Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                          <Bar data={salesChartData} options={chartOptions} />
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={6} className="mb-4">
                      <Card>
                        <Card.Header>Profit Margin by Category</Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                          <Bar data={profitChartData} options={chartOptions} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                
                <Tab eventKey="inventory" title="Inventory Metrics">
                  <Row className="mb-4">
                    <Col md={6} className="mb-4">
                      <Card>
                        <Card.Header>Inventory Turnover Rate</Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                          <Bar data={turnoverChartData} options={chartOptions} />
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={6} className="mb-4">
                      <Card>
                        <Card.Header>Stockout Frequency</Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                          <Bar data={stockoutChartData} options={chartOptions} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                
                <Tab eventKey="expiry" title="Expiry Analysis">
                  <Row className="mb-4">
                    <Col md={12}>
                      <Card>
                        <Card.Header>Expiry Rate by Category</Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                          <Bar data={expiryChartData} options={chartOptions} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                
                <Tab eventKey="seasonal" title="Seasonal Demand">
                  <Row className="mb-4">
                    <Col md={12}>
                      <Card>
                        <Card.Header>Seasonal Demand Patterns</Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                          <Line data={seasonalDemandChartData} options={lineChartOptions} />
                        </Card.Body>
                        <Card.Footer className="text-muted">
                          Showing seasonal demand for the top 3 categories in {activeCategoryGroup} group
                        </Card.Footer>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
          
          {/* Detailed Data Table */}
          <Card>
            <Card.Header>
              <h5>{activeCategoryGroup} Detailed Metrics</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Items Count</th>
                      <th>Total Value ($)</th>
                      <th>Profit Margin (%)</th>
                      <th>Turnover Rate</th>
                      <th>Stockout Freq. (%)</th>
                      <th>Expiry Rate (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeData.map((item) => (
                      <tr key={item._id}>
                        <td>{item._id}</td>
                        <td>{item.count}</td>
                        <td>${item.totalValue.toFixed(2)}</td>
                        <td>{item.profitMargin?.toFixed(2)}%</td>
                        <td>{item.turnoverRate?.toFixed(2)}</td>
                        <td>{item.stockoutFrequency?.toFixed(2)}%</td>
                        <td>{item.expiryRate?.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Analytics;
