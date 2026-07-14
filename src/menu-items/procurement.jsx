const procurement = {
  id: 'procurement',
  type: 'group',
  children: [
    {
      id: 'procurement',
      title: 'Procurement',
      type: 'collapse',
      icon: 'ph ph-shopping-bag',
      children: [
        // 🧶 YARN PURCHASE
        {
          id: 'yarn-purchase',
          title: 'Yarn Purchase',
          type: 'collapse',
          icon: 'ph ph-yarn',
          children: [
            {
              id: 'yarn-purchase-list',
              title: 'Yarn Purchase List',
              type: 'item',
              url: '/yarn-purchase/list'
            },
            {
              id: 'add-yarn-purchase',
              title: 'Add Yarn Purchase',
              type: 'item',
              url: '/yarn-purchase/add'
            }
          ]
        },
        // 🧶 ACCESSORIES PURCHASE
        {
          id: 'accessories-purchase',
          title: 'Accessories Purchase',   
          type: 'collapse',
          icon: 'ph ph-package',
          children: [
            {
              id: 'accessories-purchase-list',
              title: 'Accessories Purchase List',
              type: 'item',
              url: '/accessories-purchase/list'
            },
            {
              id: 'add-accessories-purchase',
              title: 'Add Accessories Purchase',
              type: 'item',
              url: '/accessories-purchase/add'
            }
          ]
        }
        // 🗑️ "Purchase" wala extra block HATA DEIN
      ]
    }
  ]
};

export default procurement;