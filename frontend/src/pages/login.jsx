const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:8888/auth/login';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Spotifeed</h1>
        <p className="login-subtitle">Log in with your Spotify account to continue</p>
        <button className="login-button" onClick={handleLogin}>
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login;