import { useRouter } from 'next/router';
import { ExitToApp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';

export default function Menu({socket}) {
    const router = useRouter();
    const store = useSelector(state => state);
    const dispatch = useDispatch();

    const handleExit = () => {
        dispatch({
            type: 'CLEAR_USER'
        });

        if(socket) socket.disconnect();
        
        router.back();
    }

    return (
        <nav id="menu-content">
            <div>
                <span>Seja bem vindo, </span>
                <strong>{store.name || 'sem usuario'}</strong>
            </div>

            <div onClick={handleExit} title="Sair do chat">
                <ExitToApp />
            </div>
        </nav>
    )
}