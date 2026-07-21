const settings = {
  id: 'settings',
  type: 'group',
  children: [
    {
      id: 'settings',
      title: 'Settings',
      type: 'collapse',
      icon: 'ph ph-gear',
      children: [
        {
          id: 'profile-settings',
          title: 'Profile Settings',
          type: 'item',
          url: '/settings'
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
    }
  ]
};

export default settings;