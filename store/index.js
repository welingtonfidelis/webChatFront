import { createStore } from 'redux';

const INITIAL_STATE = {
    name: ``,
    socketId: '',
    onlineUsers: {},
    activeRooms: {}
};

function user(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'UPDATE_USER':
            return {
                ...state, ...action.user
            }

        case 'CLEAR_USER':
            return {
                name: '', socketId: '', onlineUsers: {}, activeRooms: {}
            }

        case 'CREATE_ONLINE_USER_LIST':
            return {
                ...state,
                onlineUsers: action.list
            }

        case 'CREATE_ACTIVE_ROOMS_LIST':
            return {
                ...state,
                activeRooms: action.list
            }

        case 'ADD_ONLINE_USER':
            return {
                ...state,
                onlineUsers: { ...state.onlineUsers, [action.user.socketId]: action.user }
            }

        case 'RM_ONLINE_USER':
            const onlineUserTmp = state.onlineUsers;
            delete onlineUserTmp[action.user];

            return {
                ...state,
                onlineUsers: onlineUserTmp
            }

        case 'ADD_NEW_ROOM':
            const newActiveRoomsTmp = Object.assign(state.activeRooms, action.room);

            return {
                ...state,
                activeRooms: newActiveRoomsTmp
            }

        case 'RM_ROOM':
            const rmActiveRoomsTmp = state.activeRooms;
            delete rmActiveRoomsTmp[action.room]

            return {
                ...state,
                activeRooms: rmActiveRoomsTmp
            }
            
        case 'ADD_USER_ROOM':
            return {
                ...state,
                activeRooms: {
                    ...state.activeRooms,
                    [action.room]: {
                        ...state.activeRooms[action.room],
                        total: state.activeRooms[action.room].total + 1
                    }
                }
            }

        case 'RM_USER_ROOM':
            return {
                ...state,
                activeRooms: {
                    ...state.activeRooms,
                    [action.room]: {
                        ...state.activeRooms[action.room],
                        total: state.activeRooms[action.room].total - 1
                    }
                }
            }

        case 'ADD_USER_MESSAGE':
            const { message, sender } = action.message;

            if (state.onlineUsers[sender]) {
                return {
                    ...state,
                    onlineUsers: {
                        ...state.onlineUsers,
                        [sender]: {
                            ...state.onlineUsers[sender],
                            message: [...state.onlineUsers[sender].message, message]
                        }
                    }
                }
            }
            else {
                return {
                    ...state,
                    onlineUsers: {
                        ...state.onlineUsers,
                        [sender]: {
                            message: [message],
                            user: message.user,
                            socketId: sender
                        }
                    }
                }
            }

        case 'ADD_ROOM_MESSAGE':
            const { message: msgFromRoom, room } = action.message;

            if (state.activeRooms[room]) {
                return {
                    ...state,
                    activeRooms: {
                        ...state.activeRooms,
                        [room]: {
                            ...state.activeRooms[room],
                            message: [...state.activeRooms[room].message, msgFromRoom]
                        }
                    }
                }
            }
            else {
                return {
                    ...state,
                    activeRooms: {
                        ...state.activeRooms,
                        [room]: {
                            message: [message]
                        }
                    }
                }
            }

        case 'ADD_ALERT_NEW_MESSAGE':
            return {
                ...state,
                onlineUsers: {
                    ...state.onlineUsers,
                    [action.user]: {
                        ...state.onlineUsers[action.user],
                        newMessage: true
                    }
                }
            }

        case 'RM_ALERT_NEW_MESSAGE':
            return {
                ...state,
                onlineUsers: {
                    ...state.onlineUsers,
                    [action.user]: {
                        ...state.onlineUsers[action.user],
                        newMessage: false
                    }
                }
            }

        case 'ADD_ROOM_ALERT_NEW_MESSAGE':
            return {
                ...state,
                activeRooms: {
                    ...state.activeRooms,
                    [action.room]: {
                        ...state.activeRooms[action.room],
                        newMessage: true
                    }
                }
            }

        case 'RM_ROOM_ALERT_NEW_MESSAGE':
            return {
                ...state,
                activeRooms: {
                    ...state.activeRooms,
                    [action.room]: {
                        ...state.activeRooms[action.room],
                        newMessage: false
                    }
                }
            }

        case 'ADD_IN_ROOM':
            if(!state.activeRooms[action.room].in) {
                return {
                    ...state,
                    activeRooms: {
                        ...state.activeRooms,
                        [action.room]: {
                            ...state.activeRooms[action.room],
                            in: true
                        }
                    }
                }
            }
            else return state;

        case 'EXIT_ROOM':
            return {
                ...state,
                activeRooms: {
                    ...state.activeRooms,
                    [action.room]: {
                        ...state.activeRooms[action.room],
                        message: [],
                        in: false
                    }
                }
            }

        default:
            return state;
    }
}

const store = createStore(user);

export default store;
