export let routes = [
  {
    path: '/register',
    handler: 'register',
    helper: '',
    type: 'post',
    params: '',
  },
  {
    path: '/login',
    handler: 'login',
    helper: 'login',
    type: 'post',
    params: '',
  },
  {
    path: '/logout',
    handler: 'logout',
    helper: '',
    type: 'post',
    params: '',
  },
  {
    path: '/check',
    handler: 'check',
    helper: 'auth',
    type: 'get',
  },
];
