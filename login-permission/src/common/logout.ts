import routes from '@/routes';

export default () => {
  localStorage.clear();
  routes.navigate('/login');
};
