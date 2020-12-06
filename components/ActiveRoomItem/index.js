import { Forum } from '@material-ui/icons';

export default function OnlineUserItem({ item }) {
    const [name, message] = item;
    console.log(item);

    return (
        <div id="active-room-content">
            {
                message.newMessage 
                ? <Forum className={`online-user-icon-new`}/>
                : <Forum className={`online-user-icon-normal`}/>
            }
            <span>{name}</span>
            <strong>{message.total}</strong>
        </div>
    )
}