const dying = {
  id: 'dying',
  type: 'group',
  children: [
    {
      id: 'dying',
      title: 'Dying',
      type: 'collapse',
      icon: 'ph ph-palette',
      children: [
        {
          id: 'dying-sent',
          title: 'Dying Sent',
          type: 'item',
          url: '/dying/sent'
        },
        {
          id: 'dying-received',
          title: 'Dying Received',
          type: 'item',
          url: '/dying/received'
        }
      ]
    }
  ]
};

export default dying;