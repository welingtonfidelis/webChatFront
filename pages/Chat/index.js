import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { Send } from '@material-ui/icons';
import { useRouter } from 'next/router';

import Menu from '../../components/Menu';
import OnlineUser from '../../components/OnlineUser';
import Message from '../../components/Message';
import Input from '../../components/Input';
import Button from '../../components/ButtonPrimary';

let socket = null;
let receiverControl = null;

export default function Chat() {
    const [receiver, setReceiver] = useState({});
    const [message, setMessage] = useState('');

    const apiUrl = process.env.API_URL;
    const dispatch = useDispatch();
    const router = useRouter();
    const { name, onlineUsers } = useSelector(state => state);

    useEffect(() => {
        if (name !== '') {
            socket = io(apiUrl, { query: { user: name } });

            socket.on("connect", () => {
                dispatch({
                    type: 'UPDATE_USER',
                    user: {
                        socketId: socket.id
                    }
                });
            });

            socket.on('receiveMessage', data => {
                dispatch({
                    type: 'ADD_CONVERSATION_MESSAGE',
                    message: data
                });

                dispatch({
                    type: 'ADD_ALERT_NEW_MESSAGE',
                    user: data.sender
                });
            });

            socket.on('receiveListOnlineUsers', data => {
                dispatch({
                    type: 'CREATE_ONLINE_USER_LIST',
                    list: data
                });
            });

            socket.on('newOnlineUser', data => {
                dispatch({
                    type: 'ADD_ONLINE_USER',
                    user: data
                });
            });

            socket.on('removeOnlineUser', data => {
                dispatch({
                    type: 'RM_ONLINE_USER',
                    user: data
                });

                if(data === receiverControl?.socketId) {
                    alert(`O usuário ${receiverControl.user} saiu do chat.`);
                    setReceiver({});
                    receiverControl = null;
                }
            });
        }
        else {
            alert('Por favor, use um nome válido');
            router.back();
        }
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        const date = new Date();

        if (socket) {
            socket.emit(
                'sendMessage',
                { receiver: receiver.socketId, message: { user: name, text: message, date, receive: true } }
            );

            dispatch({
                type: 'ADD_CONVERSATION_MESSAGE',
                message: {
                    sender: receiver.socketId,
                    message: {
                        date,
                        text: message,
                        receive: false
                    }
                }
            });

            dispatch({
                type: 'RM_ALERT_NEW_MESSAGE',
                user: receiver.socketId
            });
        }

        setMessage('');
    }

    const openConversation = (user) => {
        dispatch({
            type: 'RM_ALERT_NEW_MESSAGE',
            user: user.socketId
        });

        receiverControl = user;
        setReceiver(user);
    }
    return (
        <div id="chat-content">
            <Menu socket={socket}/>

            <div className="chat-container">
                <div className="left-card">
                    <strong>Usuários online</strong>

                    <div className="left-card-container">
                        {
                            Object.entries(onlineUsers).map(item => {
                                const [socketId, user] = item;

                                return (
                                    <div
                                        key={socketId}
                                        onClick={() => openConversation(user)}
                                    >
                                        <OnlineUser item={user} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="right-card">
                    <strong>Conversa com {receiver.user}</strong>

                    <div className="right-card-container">
                        {
                            (
                                onlineUsers[receiver.socketId]
                                    ? onlineUsers[receiver.socketId].message
                                    : []
                            ).map((item, index) => {
                                return (
                                    <Message item={item} key={index} />
                                )
                            })
                        }
                    </div>

                    <form
                        onSubmit={sendMessage}
                        className={`chat-input-content ${receiver.socketId ? '' : 'disable-div'}`}
                    >
                        <Input
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                        />
                        <Button label={<Send />} />
                    </form>
                </div>
            </div>
        </div>
    )
}