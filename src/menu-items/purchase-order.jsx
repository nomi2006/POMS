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
    // {
    //   id: 'yarn-purchase',
    //   title: 'Yarn Purchase',
    //   type: 'collapse',
    //   icon: 'ph ph-yarn', // or 'ph ph-threads' or any icon you prefer
    //   children: [
    //     {
    //       id: 'yarn-purchase-list',
    //       title: 'Yarn Purchase List',
    //       type: 'item',
    //       url: '/yarn-purchase/list'
    //     },
    //     {
    //       id: 'add-yarn-purchase',
    //       title: 'Add Yarn Purchase',
    //       type: 'item',
    //       url: '/yarn-purchase/add'
    //     }
    //   ]
    // },
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