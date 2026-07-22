const pages = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'User Management',
      type: 'collapse',
      icon: 'ph ph-users',
      children: [
        {
          id: 'users-list',
          title: 'Users List',
          type: 'item',
          url: '/user-management/list'
        },
        {
          id: 'user-role',
          title: 'User Role',
          type: 'item',
          url: '/user-role'
        },
        {
          id: 'add-user-manual',
          title: 'Add User (Manual)',
          type: 'item',
          url: '/add-user-manual'
        }
      ]
    }
  ]
};

export default pages;
