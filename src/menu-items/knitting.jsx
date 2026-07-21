const knitting = {
  id: 'knitting',
  type: 'group',
  children: [
    {
      id: 'knitting',
      title: 'Knitting',
      type: 'collapse',
      icon: 'ph ph-yarn',
      children: [
        {
          id: 'knitting-sent',
          title: 'Knitting Sent',
          type: 'item',
          url: '/knitting/sent'
        },
        {
          id: 'knitting-received',
          title: 'Knitting Received',
          type: 'item',
          url: '/knitting/received'
        }
      ]
    }
  ]
};

export default knitting;