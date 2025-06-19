import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Tabs, Tab, Nav, NavDropdown } from 'react-bootstrap';
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

// Category to subcategory mapping
const CATEGORY_SUBCATEGORY_MAP = {
  [CategoryGroup.CORE_MEDICATION]: [
    SubcategoryType.PRESCRIPTION,
    SubcategoryType.OTC
  ],
  [CategoryGroup.ADDITIONAL]: [
    SubcategoryType.MEDICAL_SUPPLIES,
    SubcategoryType.VITAMINS_SUPPLEMENTS,
    SubcategoryType.PERSONAL_CARE
  ],
  [CategoryGroup.ADMINISTRATIVE]: [
    SubcategoryType.CONTROLLED_SUBSTANCES,
    SubcategoryType.INVENTORY_ATTRIBUTES
  ]
};

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
};

// Map all categories to their group
const CATEGORY_GROUP_MAP: Record<string, CategoryGroup> = {};
Object.entries(CORE_MEDICATION_CATEGORIES).forEach(([subcategory, categories]) => {
  categories.forEach(category => {
    CATEGORY_GROUP_MAP[category] = CategoryGroup.CORE_MEDICATION;
  });
});
Object.entries(ADDITIONAL_CATEGORIES).forEach(([subcategory, categories]) => {
  categories.forEach(category => {
    CATEGORY_GROUP_MAP[category] = CategoryGroup.ADDITIONAL;
  });
});
Object.entries(ADMINISTRATIVE_CATEGORIES).forEach(([subcategory, categories]) => {
  categories.forEach(category => {
    CATEGORY_GROUP_MAP[category] = CategoryGroup.ADMINISTRATIVE;
  });
});

// Map all categories to their subcategory
const CATEGORY_SUBCATEGORY_MAP_DETAILED: Record<string, SubcategoryType> = {};
Object.entries(CORE_MEDICATION_CATEGORIES).forEach(([subcategory, categories]) => {
  categories.forEach(category => {
    CATEGORY_SUBCATEGORY_MAP_DETAILED[category] = subcategory as SubcategoryType;
  });
});
Object.entries(ADDITIONAL_CATEGORIES).forEach(([subcategory, categories]) => {
  categories.forEach(category => {
    CATEGORY_SUBCATEGORY_MAP_DETAILED[category] = subcategory as SubcategoryType;
  });
});
Object.entries(ADMINISTRATIVE_CATEGORIES).forEach(([subcategory, categories]) => {
  categories.forEach(category => {
    CATEGORY_SUBCATEGORY_MAP_DETAILED[category] = subcategory as SubcategoryType;
  });
});

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
  group?: CategoryGroup;
  subcategory?: SubcategoryType;
}

const Analytics: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryAnalytics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeCategoryGroup, setActiveCategoryGroup] = useState<CategoryGroup>(CategoryGroup.CORE_MEDICATION);
  const [activeSubcategory, setActiveSubcategory] = useState<SubcategoryType | 'all'>(SubcategoryType.PRESCRIPTION);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch both category and subcategory analytics data
        const [categoryResponse, subcategoryResponse, structureResponse] = await Promise.all([
          inventoryApi.getAnalyticsByCategory(),
          inventoryApi.getAnalyticsBySubcategory(),
          inventoryApi.getCategoryStructure()
        ]);
        
        if (categoryResponse.success && subcategoryResponse.success) {
          // Process category data with proper mappings
          const categoryData = categoryResponse.data.map((item: any) => ({
            ...item,
            group: CATEGORY_GROUP_MAP[item._id],
            subcategory: CATEGORY_SUBCATEGORY_MAP_DETAILED[item._id]
          }));
          
          // Process subcategory data
          const subcategoryData = subcategoryResponse.data.map((item: any) => ({
            ...item,
            // Already has categoryGroup from backend
            // Already has subcategory metrics from backend
          }));
          
          // Combine both datasets for comprehensive analytics
          const combinedData = [...categoryData, ...subcategoryData.filter(item => 
            // Filter out any potential duplicate data
            !categoryData.some(catItem => catItem._id === item._id)
          )];
          
          setCategoryData(combinedData);
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
  }, []);

  // Set default active subcategory when category group changes
  useEffect(() => {
    if (CATEGORY_SUBCATEGORY_MAP[activeCategoryGroup]?.length > 0) {
      setActiveSubcategory(CATEGORY_SUBCATEGORY_MAP[activeCategoryGroup][0]);
    }
  }, [activeCategoryGroup]);

  // Filter data by active group and subcategory
  const filteredData = categoryData.filter(item => {
    if (item.group !== activeCategoryGroup) {
      return false;
    }
    
    if (activeSubcategory === 'all') {
      return true;
    }
    
    return item.subcategory === activeSubcategory;
  });
  
  // Chart colors
  const chartColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FFCA3A',
    '#FF6B6B', '#4ECDC4', '#1A535C', '#FFD166', '#06D6A0',
    '#118AB2', '#073B4C', '#F79256', '#7DCFB6', '#00B2CA'
  ];
  
  // Background colors with transparency
  const backgroundColors = chartColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.6)'));
  
  // Prepare sales chart data
  const salesChartData = {
    labels: filteredData.map(item => item._id),
    datasets: [
      {
        label: 'Total Sales Value ($)',
        data: filteredData.map(item => item.totalValue),
        backgroundColor: backgroundColors.slice(0, filteredData.length),
        borderColor: chartColors.slice(0, filteredData.length),
        borderWidth: 1
      }
    ]
  };

  // Prepare profit margin chart
  const profitChartData = {
    labels: filteredData.map(item => item._id),
    datasets: [
      {
        label: 'Profit Margin (%)',
        data: filteredData.map(item => item.profitMargin),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare expiry tracking chart
  const expiryChartData = {
    labels: filteredData.map(item => item._id),
    datasets: [
      {
        label: 'Expiry Rate (%)',
        data: filteredData.map(item => item.expiryRate),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare inventory turnover chart
  const turnoverChartData = {
    labels: filteredData.map(item => item._id),
    datasets: [
      {
        label: 'Inventory Turnover Rate',
        data: filteredData.map(item => item.turnoverRate),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare stockout frequency chart
  const stockoutChartData = {
    labels: filteredData.map(item => item._id),
    datasets: [
      {
        label: 'Stockout Frequency (%)',
        data: filteredData.map(item => item.stockoutFrequency),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare seasonal demand chart (for first 3 items as example)
  const seasonalDemandChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: filteredData.slice(0, 3).map((item, index) => ({
      label: item._id,
      data: item.seasonalDemand,
      borderColor: chartColors[index % chartColors.length],
      backgroundColor: 'transparent',
      tension: 0.4
    }))
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
          {/* Category Group & Subcategory Selection */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Select Category for Analysis</h5>
            </Card.Header>
            <Card.Body>
              <Nav variant="tabs" className="mb-3">
                {Object.values(CategoryGroup).map(group => (
                  <Nav.Item key={group}>
                    <Nav.Link 
                      active={activeCategoryGroup === group}
                      onClick={() => setActiveCategoryGroup(group)}
                    >
                      {group}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
              
              {/* Subcategory selection */}
              <div className="mt-3">
                <Nav variant="pills" className="mb-3">
                  {CATEGORY_SUBCATEGORY_MAP[activeCategoryGroup]?.map((subcategory) => (
                    <Nav.Item key={subcategory}>
                      <Nav.Link
                        active={activeSubcategory === subcategory}
                        onClick={() => setActiveSubcategory(subcategory)}
                      >
                        {subcategory}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                  <Nav.Item>
                    <Nav.Link
                      active={activeSubcategory === 'all'}
                      onClick={() => setActiveSubcategory('all')}
                    >
                      All Subcategories
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </Card.Body>
          </Card>
          
          {/* Metric Tabs */}
          <Card className="mb-4">
            <Card.Header>
              <h5>
                {activeSubcategory === 'all' 
                  ? `${activeCategoryGroup} Analytics` 
                  : `${activeSubcategory} Analytics`}
              </h5>
            </Card.Header>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => k && setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="overview" title="Sales & Profit">
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
                          {filteredData.length > 0 
                            ? `Showing seasonal demand for ${Math.min(3, filteredData.length)} categories`
                            : 'No data available for seasonal demand analysis'}
                        </Card.Footer>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                
                <Tab eventKey="subcategories" title="Subcategory Analysis">
                  <Row className="mb-4">
                    <Col md={12} className="mb-4">
                      <Card>
                        <Card.Header>Sales Distribution by Subcategory</Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                          <Pie 
                            data={{
                              labels: [...new Set(categoryData
                                .filter(item => item.group === activeCategoryGroup)
                                .map(item => item.subcategory))],
                              datasets: [{
                                data: [...new Set(categoryData
                                  .filter(item => item.group === activeCategoryGroup)
                                  .map(item => item.subcategory))]
                                  .map(subcategory => {
                                    const subcategoryData = categoryData
                                      .filter(item => item.subcategory === subcategory);
                                    return subcategoryData.reduce((sum, item) => sum + item.totalValue, 0);
                                  }),
                                backgroundColor: backgroundColors,
                                borderColor: chartColors,
                                borderWidth: 1
                              }]
                            }} 
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'right',
                                }
                              }
                            }} 
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col md={6} className="mb-4">
                      <Card>
                        <Card.Header>Profit Margin by Subcategory</Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                          <Bar 
                            data={{
                              labels: [...new Set(categoryData
                                .filter(item => item.group === activeCategoryGroup)
                                .map(item => item.subcategory))],
                              datasets: [{
                                label: 'Profit Margin (%)',
                                data: [...new Set(categoryData
                                  .filter(item => item.group === activeCategoryGroup)
                                  .map(item => item.subcategory))]
                                  .map(subcategory => {
                                    const subcategoryData = categoryData
                                      .filter(item => item.subcategory === subcategory);
                                    const totalValue = subcategoryData.reduce((sum, item) => sum + item.totalValue, 0);
                                    const totalCost = subcategoryData.reduce((sum, item) => sum + item.totalCost, 0);
                                    return ((totalValue - totalCost) / totalValue) * 100;
                                  }),
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                              }]
                            }}
                            options={chartOptions}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Card>
                        <Card.Header>Low Stock Items by Subcategory</Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                          <Bar 
                            data={{
                              labels: [...new Set(categoryData
                                .filter(item => item.group === activeCategoryGroup)
                                .map(item => item.subcategory))],
                              datasets: [{
                                label: 'Low Stock Items',
                                data: [...new Set(categoryData
                                  .filter(item => item.group === activeCategoryGroup)
                                  .map(item => item.subcategory))]
                                  .map(subcategory => {
                                    const subcategoryData = categoryData
                                      .filter(item => item.subcategory === subcategory);
                                    return subcategoryData.reduce((sum, item) => sum + (item.lowStockItems || 0), 0);
                                  }),
                                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1
                              }]
                            }}
                            options={chartOptions}
                          />
                        </Card.Body>
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
              <h5>
                {activeSubcategory === 'all' 
                  ? `${activeCategoryGroup} Detailed Metrics` 
                  : `${activeSubcategory} Detailed Metrics`}
              </h5>
            </Card.Header>
            <Card.Body>
              {filteredData.length === 0 ? (
                <Alert variant="info">
                  No items found in this category. Please add inventory items first.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Items</th>
                        <th>Total Value ($)</th>
                        <th>Profit Margin (%)</th>
                        <th>Turnover Rate</th>
                        <th>Stockout Freq. (%)</th>
                        <th>Expiry Rate (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
                        <tr key={item._id}>
                          <td>{item._id}</td>
                          <td>{item.subcategory}</td>
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
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Analytics;
