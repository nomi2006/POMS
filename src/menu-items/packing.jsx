const packing = {
  id: 'packing',
  type: 'group',
  children: [
    {
      id: 'packing',
      title: 'Packing',
      type: 'collapse',
      icon:'ph ph-package',
      children: [
        {
          id: 'packing-sent',
          title: 'Packing Sent',
          type: 'item',
          url: '/packing/sent'
        },
        {
          id: 'packing-received',
          title: 'Packing Received',
          type: 'item',
          url: '/packing/received'
        }
      ]
    }
  ]
};

export default packing;