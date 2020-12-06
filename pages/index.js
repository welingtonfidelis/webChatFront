import { useState } from 'react';
import { useRouter } from 'next/router';
import { AccountCircle } from '@material-ui/icons';
import { useDispatch } from 'react-redux';

import Button from '../components/ButtonPrimary';
import Input from '../components/Input';

export default function Home() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    try {
      dispatch({
        type: 'UPDATE_USER',
        user: {
          name
        }
      });

      router.push('/Chat');
      return

    } catch (error) {
      console.log(error);
      alert('Erro ao entrar. Tente novamente por favor.');
    }
  }

  return (
    <div id="main">
      <form onSubmit={handleLogin} className="login-content">
        <div className="login-user-icon">
          <AccountCircle />
        </div>

        <div className="login-welcome-text">
          <span>Seja bem vindo ao nosso chat. Abaixo, digite seu usuário para começarmos.</span>
        </div>

        <div className="login-content-input">
          <div className="login-user-input">
            <Input
              label="Usuário"
              name="username"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="login-button">
            <Button label="Entrar" loading={loading} />
          </div>
        </div>
      </form>
    </div>
  )
}