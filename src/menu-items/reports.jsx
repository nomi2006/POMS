const reports = {
  id: 'reports',
  type: 'group',
  children: [
    {
      id: 'reports',
      title: 'Reports',
      type: 'collapse',
      icon: 'ph ph-chart-bar',
      children: [
        { id: 'purchase-order-report', title: 'Purchase Order Report', type: 'item', url: '/reports/purchase-order' },
        { id: 'yarn-purchase-report', title: 'Yarn Purchase Report', type: 'item', url: '/reports/yarn-purchase' },
        { id: 'accessories-purchase-report', title: 'Accessories Purchase Report', type: 'item', url: '/reports/accessories-purchase' },
        { id: 'knitting-report', title: 'Knitting Report', type: 'item', url: '/reports/knitting' },
        { id: 'dying-report', title: 'Dying Report', type: 'item', url: '/reports/dying' },
        { id: 'embroidery-report', title: 'Embroidery Report', type: 'item', url: '/reports/embroidery' },
        { id: 'qc-report', title: 'QC Report', type: 'item', url: '/reports/qc' },
        { id: 'packing-report', title: 'Packing Report', type: 'item', url: '/reports/packing' }
      ]
    }
  ]
};

export default reports;