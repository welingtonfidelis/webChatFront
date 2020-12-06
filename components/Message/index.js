import utils from '../../services/utils';

export default function OnlineUserItem({ item, socketId }) {
    const receive = item.socketId && item.socketId === socketId;

    return (
        <div className={receive ? "message-receive-content" : "message-send-content"}>
            { item.user && <span className="message-user-name">{item.user}</span> }
            <span>{item.text}</span>
            <strong className="message-date">{utils.maskDate(new Date(item.date))}</strong>
        </div>
    )
}