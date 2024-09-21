function ProtectedRoute({ component: Component, ...rest }) {
  const authHeader = document.cookie.match(/auth_token=(.*?); path=/);

  if (!authHeader) {
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
}
