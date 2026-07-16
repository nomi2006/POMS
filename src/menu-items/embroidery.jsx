const embroidery = {
  id: 'embroidery',
  type: 'group',
  children: [
    {
      id: 'embroidery',
      title: 'Embroidery',
      type: 'collapse',
      icon: 'ph ph-needle',  // or 'ph ph-threads'
      children: [
        {
          id: 'embroidery-sent',
          title: 'EMB Sent',
          type: 'item',
          url: '/embroidery/sent'
        },
        {
          id: 'embroidery-received',
          title: 'EMB Received',
          type: 'item',
          url: '/embroidery/received'
        }
      ]
    }
  ]
};

export default embroidery;