const pages = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'User Management',
      type: 'collapse',
      icon: 'ph ph-lock-key',
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          url: '/login',
          target: true
        },
        {
          id: 'register',
          title: 'Register',
          type: 'item',
          url: '/register',
          target: true
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
