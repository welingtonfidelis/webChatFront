import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Add, Cancel } from '@material-ui/icons';
import { useRouter } from 'next/router';

import Menu from '../../components/Menu';
import OnlineUser from '../../components/OnlineUserItem';
import ActiveRoomItem from '../../components/ActiveRoomItem';
import Message from '../../components/Message';
import Input from '../../components/Input';
import Button from '../../components/ButtonPrimary';
import Tabs from '../../components/Tabs';

let socket = null;
let receiverControl = null;
let roomControl = {};

export default function Chat() {
    const [receiver, setReceiver] = useState({});
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [newRoom, setNewRoom] = useState('');

    const apiUrl = process.env.API_URL;
    const dispatch = useDispatch();
    const router = useRouter();
    const { name, socketId, onlineUsers, activeRooms } = useSelector(state => state);

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
                    type: 'ADD_USER_MESSAGE',
                    message: data
                });

                dispatch({
                    type: 'ADD_ALERT_NEW_MESSAGE',
                    user: data.sender
                });
            });

            socket.on('receiveMessageFromRoom', data => {
                dispatch({
                    type: 'ADD_ROOM_MESSAGE',
                    message: data
                });

                dispatch({
                    type: 'ADD_ROOM_ALERT_NEW_MESSAGE',
                    room: data.room
                });
            });

            socket.on('receiveListOnlineUsers', data => {
                dispatch({
                    type: 'CREATE_ONLINE_USER_LIST',
                    list: data
                });
            });

            socket.on('receiveListRooms', data => {
                dispatch({
                    type: 'CREATE_ACTIVE_ROOMS_LIST',
                    list: data
                });
            });

            socket.on('receiveNewRoom', data => {
                dispatch({
                    type: 'ADD_NEW_ROOM',
                    room: data
                });
            });

            socket.on('removeRoom', data => {
                dispatch({
                    type: 'RM_ROOM',
                    room: data.room
                });
            });

            socket.on('newOnlineUser', data => {
                dispatch({
                    type: 'ADD_ONLINE_USER',
                    user: data
                });
            });

            socket.on('newUserInRoom', data => {
                dispatch({
                    type: 'ADD_USER_ROOM',
                    room: data.room
                });
            });

            socket.on('removeUserRoom', data => {
                dispatch({
                    type: 'RM_USER_ROOM',
                    room: data.room
                });
            });

            socket.on('removeOnlineUser', data => {
                dispatch({
                    type: 'RM_ONLINE_USER',
                    user: data
                });

                if (data === receiverControl?.socketId) {
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

    const sendMessageRoom = (e) => {
        e.preventDefault();
        const date = new Date();

        if (socket) {
            socket.emit(
                'sendMessageToRoom',
                { room, message: { user: name, text: message, date, receive: true } }
            );

            dispatch({
                type: 'ADD_ROOM_MESSAGE',
                message: {
                    room,
                    message: {
                        user: name,
                        date,
                        text: message,
                        socketId
                    }
                }
            });

            dispatch({
                type: 'RM_ROOM_ALERT_NEW_MESSAGE',
                room
            });

            setMessage('');
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();
        const date = new Date();

        if (socket) {
            socket.emit(
                'sendMessage',
                { receiver: receiver.socketId, message: { text: message, date } }
            );

            dispatch({
                type: 'ADD_USER_MESSAGE',
                message: {
                    sender: receiver.socketId,
                    message: {
                        date,
                        text: message,
                        socketId
                    }
                }
            });

            dispatch({
                type: 'RM_ALERT_NEW_MESSAGE',
                user: receiver.socketId
            });
            setMessage('');
        }
    }

    const joinRomm = (room) => {
        setRoom(room);

        dispatch({
            type: 'RM_ROOM_ALERT_NEW_MESSAGE',
            room
        });

        dispatch({
            type: 'ADD_IN_ROOM',
            room
        });

        if (socket && !roomControl[room]) {
            roomControl[room] = true;

            socket.emit('joinRoom', { room, user: name });
        }
    }

    const exitRoom = () => {
        if (socket) {
            roomControl[room] = false;

            socket.emit('exitRoom', { room, user: name });

            dispatch({
                type: 'EXIT_ROOM',
                room
            });

            setRoom('');
        }
    }

    const openConversation = (user) => {
        setRoom('');

        dispatch({
            type: 'RM_ALERT_NEW_MESSAGE',
            user: user.socketId
        });

        receiverControl = user;
        setReceiver(user);
    }

    const handleNewRoom = (e) => {
        e.preventDefault();

        if (socket) {
            socket.emit('newRoom', { room: newRoom });
            socket.emit('joinRoom', { room: newRoom, user: name });
            roomControl[newRoom] = true;
        }

        setNewRoom('');
    }

    const OnlineUsers = () => (
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
    );

    const ActiveRooms = () => (
        Object.entries(activeRooms).map((item, index) => {
            const [name] = item;

            return (
                <div
                    key={index}
                    onClick={() => joinRomm(name)}
                >
                    <ActiveRoomItem item={item} />
                </div>
            )
        })
    );

    return (
        <div id="chat-content">
            <Menu socket={socket} />

            <div className="chat-container">
                <div className="left-card">
                    <strong>Usuários online</strong>

                    <div className="left-card-container">
                        <Tabs items={[
                            {
                                label: 'Usuários',
                                content: <OnlineUsers />
                            },
                            {
                                label: 'Salas',
                                content: <>
                                    <form onSubmit={handleNewRoom} className="chat-new-room-content">
                                        <strong>Criar sala</strong>

                                        <div className="chat-new-room-container">
                                            <Input
                                                value={newRoom}
                                                onChange={e => setNewRoom(e.target.value)}
                                                required
                                            />

                                            <Button label={<Add />} />
                                        </div>
                                    </form>

                                    <ActiveRooms />
                                </>
                            }
                        ]} />
                    </div>
                </div>

                <div className="right-card">
                    <strong>{
                        room !== ''
                            ? `Sala ${room}`
                            : `${receiver.user || '.'}`
                    }</strong>

                    <div className="right-card-container">
                        {
                            room !== ''
                                ?
                                <>
                                    <div className="right-card-exit-room">
                                        <span title="Sair da sala">
                                            <Cancel onClick={exitRoom} />
                                        </span>
                                    </div>

                                    {(
                                        activeRooms[room]
                                            ? activeRooms[room].message
                                            : []
                                    ).map((item, index) => {
                                        return (
                                            <Message item={item} socketId={socketId} key={index} />
                                        )
                                    })}
                                </>

                                : (
                                    onlineUsers[receiver.socketId]
                                        ? onlineUsers[receiver.socketId].message
                                        : []
                                ).map((item, index) => {
                                    return (
                                        <Message item={item} socketId={socketId} key={index} />
                                    )
                                })
                        }
                    </div>

                    <form
                        onSubmit={room !== '' ? sendMessageRoom : sendMessage}
                        className={
                            `chat-input-content ${(receiver.socketId || room !== '') ? '' : 'disable-div'}`
                        }
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