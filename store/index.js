import { createStore } from 'redux';

const INITIAL_STATE = {
    name: '',
    socketId: '',
    onlineUsers: {}
};

function user(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'UPDATE_USER':
            return {
                ...state, ...action.user
            }

        case 'CLEAR_USER':
            return {
                name: '', socketId: '', onlineUsers: {}
            }

        case 'CREATE_ONLINE_USER_LIST':
            return {
                ...state,
                onlineUsers: action.list
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

        case 'ADD_CONVERSATION_MESSAGE':
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

        default:
            return state;
    }
}

const store = createStore(user);

export default store;
