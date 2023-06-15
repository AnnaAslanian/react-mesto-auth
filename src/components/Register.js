import React from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister, renderLoading }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(email, password);
  }

  return (
    <div className="auth">
        <h2 className="auth__title">Регистрация</h2>
        <form
        className="auth__form"
        onSubmit={handleSubmit}
      >
        <input
          id="auth-email"
          required=""
          className="auth__input"
          type="email"
          placeholder="Email"
          minLength="5"
          maxLength="40"
          name="email-register"
          onChange={handleEmailChange}
        />
        <input
          id="auth-password"
          required=""
          className="auth__input"
          type="password"
          placeholder="Пароль"
          minLength="5"
          maxLength="40"
          name="password-register"
          onChange={handlePasswordChange}
        />
        <button
          type="submit"
          className="auth__btn"
        >{renderLoading}
        </button>
        </form>
        <p className="auth__question">Уже зарегистрированы?{" "}<Link to="/sign-in" className="auth__link">Войти</Link></p>
    </div>
  );
}

export default Register;