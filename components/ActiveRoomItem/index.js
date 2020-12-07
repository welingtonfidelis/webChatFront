import { Forum, PersonPin } from '@material-ui/icons';

export default function OnlineUserItem({ item }) {
    const [name, message] = item;

    return (
        <div id="active-room-content">
            {
                message.newMessage
                    ? <Forum className={`online-user-icon-new`} />
                    : <Forum className={`online-user-icon-normal`} />
            }
            <span>{name}</span>

            <div className="active-room-info">
                <div title="Você está na sala">{message.in && <PersonPin />}</div>
                <strong title="Total de usuários na sala">{message.total}</strong>
            </div>
        </div>
    )
}