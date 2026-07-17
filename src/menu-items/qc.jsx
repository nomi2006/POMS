const qc = {
  id: 'qc',
  type: 'group',
  children: [
    {
      id: 'qc',
      title: 'QC',
      type: 'collapse',
      icon: 'ph ph-check-circle',
      children: [
        {
          id: 'qc-sent',
          title: 'QC Sent',
          type: 'item',
          url: '/qc/sent'
        },
        {
          id: 'qc-received',
          title: 'QC Received',
          type: 'item',
          url: '/qc/received'
        }
      ]
    }
  ]
};

export default qc;