import { Provider } from 'react-redux';

import '../styles/globals.scss'
import '../styles/button.scss'
import '../styles/input.scss'
import '../styles/login.scss'
import '../styles/menu.scss'
import '../styles/chat.scss'
import '../styles/onlineUser.scss'
import '../styles/message.scss'
import '../styles/tabs.scss'
import '../styles/activeRoom.scss'

import store from '../store';

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}