// react-bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

// project-imports
import SalesPerformanceCard from 'components/cards/dashboard/SalesPerformanceCard';
import SocialStatsCard from 'components/cards/dashboard/SocialStatsCard';
import StatIndicatorCard from 'components/cards/dashboard/StatIndicatorCard';
import { UsersMap, EarningChart, RatingCard, RecentUsersCard } from 'sections/dashboard/default';
// import PurchaseOrderTable from 'sections/purchase-order/PurchaseOrderTable';
import { useEffect, useState } from "react";
import { db } from "config/firebase";
import { collection, getDocs } from "firebase/firestore";
import MainCard from "components/MainCard";

const salesPerformanceData = [
  { title: 'Daily Sales', icon: 'ph ph-arrow-up text-success', amount: '$ 249.95', progress: { now: 67, className: 'bg-brand-color-1' } },
  {
    title: 'Monthly Sales',
    icon: 'ph ph-arrow-down text-danger',
    amount: '$ 2,942.32',
    progress: { now: 36, className: 'bg-brand-color-2' }
  },
  { title: 'Yearly Sales', icon: 'ph ph-arrow-up text-success', amount: '$ 8,638.32', progress: { now: 80, className: 'bg-brand-color-1' } }
];


const statIndicatorData = [
  { icon: 'ph ph-lightbulb-filament', value: '235', label: 'TOTAL IDEAS', iconColor: 'text-success' },
  { icon: 'ph ph-map-pin-line', value: '26', label: 'TOTAL LOCATION', iconColor: 'text-primary' }
];


const socialStatsData = [
  {
    icon: 'ti ti-brand-facebook-filled text-primary',
    count: '12,281',
    percentage: '+7.2%',
    color: 'text-success',
    stats: [
      {
        label: 'Target',
        value: '35,098',
        progress: {
          now: 60,
          className: 'bg-brand-color-1'
        }
      },
      {
        label: 'Duration',
        value: '3,539',
        progress: {
          now: 45,
          className: 'bg-brand-color-2'
        }
      }
    ]
  },
  {
    icon: 'ti ti-brand-twitter-filled text-info',
    count: '11,200',
    percentage: '+6.2%',
    color: 'text-primary',
    stats: [
      {
        label: 'Target',
        value: '34,185',
        progress: {
          now: 40,
          className: 'bg-success'
        }
      },
      {
        label: 'Duration',
        value: '4,567',
        progress: {
          now: 70
        }
      }
    ]
  },
  {
    icon: 'ti ti-brand-google-filled text-danger',
    count: '10,500',
    percentage: '+5.9%',
    color: 'text-primary',
    stats: [
      {
        label: 'Target',
        value: '25,998',
        progress: {
          now: 80,
          className: 'bg-brand-color-1'
        }
      },
      {
        label: 'Duration',
        value: '7,753',
        progress: {
          now: 50,
          className: 'bg-brand-color-2'
        }
      }
    ]
  }
];


export default function DefaultPage() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [monthOrders, setMonthOrders] = useState(0);

  const loadDashboard = async () => {
    const orderSnap = await getDocs(collection(db, "purchaseOrders"));
    const clientSnap = await getDocs(collection(db, "clients"));

    const orders = orderSnap.docs.map((doc) => doc.data());

    setTotalOrders(orderSnap.size);
    setTotalClients(clientSnap.size);

    const today = new Date();

    const todayCount = orders.filter((o) => {
      if (!o.createdAt) return false;

      const d = o.createdAt.toDate();

      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });

    setTodayOrders(todayCount.length);

    const monthCount = orders.filter((o) => {
      if (!o.createdAt) return false;

      const d = o.createdAt.toDate();

      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });

    setMonthOrders(monthCount.length);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col md={8}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "400"
            }}
          >
            Dashboard - Admin
          </h1>

          <p className="text-muted">
            Welcome <span className="text-primary">User Name</span>, everything looks great.
          </p>
        </Col>

        <Col md={4} className="text-end">
          <Button variant="light" className="me-2">
            <i className="ph ph-gear me-1"></i>
            Settings
          </Button>

          <Button variant="light">
            <i className="ph ph-calendar me-1"></i>
            All Time
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <MainCard>
            <h2>{totalOrders}</h2>
            <p>Total Purchase Orders</p>
          </MainCard>
        </Col>

        <Col md={3}>
          <MainCard>
            <h2>{totalClients}</h2>
            <p>Total Clients</p>
          </MainCard>
        </Col>

        <Col md={3}>
          <MainCard>
            <h2>{todayOrders}</h2>
            <p>Today's Orders</p>
          </MainCard>
        </Col>

        <Col md={3}>
          <MainCard>
            <h2>{monthOrders}</h2>
            <p>This Month</p>
          </MainCard>
        </Col>
      </Row>


    </>
  );
}