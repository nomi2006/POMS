// ==============================|| MENU ITEMS - CHARTS & MAPS ||============================== //

const chartsMaps = {
  id: 'charts-maps',
  title: 'Charts-maps',
  type: 'group',
  children: [
    {
      id: 'charts',
      title: 'QC',
      type: 'collapse',
      icon: 'ph ph-chart-donut',
      children: [
        {
          id: 'apex-chart',
          title: 'Apex chart',
          type: 'item',
          url: '/charts/apex-chart'
        }
      ]
    },
    {
      id: 'map',
      title: 'Packing',
      type: 'collapse',
      icon: 'ph ph-map-trifold',
      children: [
        {
          id: 'google-map',
          title: 'Google map',
          type: 'item',
          url: '/map/google-map'
        }
      ]
    }
  ]
};

export default chartsMaps;
