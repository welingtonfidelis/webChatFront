import utils from '../../services/utils';

export default function OnlineUserItem({ item }) {
    return (
        <div className={item.receive ? "message-receive-content" : "message-send-content"}>
            <span>{item.text}</span>
            <strong className="message-date">{utils.maskDate(new Date(item.date))}</strong>
        </div>
    )
}