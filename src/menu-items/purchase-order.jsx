const purchaseOrder = {
  id: 'purchase-order',
  type: 'group',
  children: [
    {
      id: 'purchase',
      title: 'Purchase Order',
      type: 'collapse',
      icon: 'ph ph-shopping-cart',
      children: [
        {
          id: 'purchase-order-list',
          title: 'Purchase Order List',
          type: 'item',
          url: '/purchase-order/list'
        },
        {
          id: 'add-purchase-order',
          title: 'Add Purchase Order',
          type: 'item',
          url: '/purchase-order/add'
        }
      ]
    },
    {
      id: 'client',
      title: 'Client',
      type: 'collapse',
      icon: 'ph ph-users',
      children: [
        {
          id: 'client-list',
          title: 'Client List',
          type: 'item',
          url: '/client/list'
        },
        {
          id: 'add-client',
          title: 'Add Client',
          type: 'item',
          url: '/client/add'
        }
      ]
    }
  ]
};

export default purchaseOrder;