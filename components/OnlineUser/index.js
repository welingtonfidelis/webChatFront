import { AccountCircle, Announcement } from '@material-ui/icons';

export default function OnlineUserItem({ item }) {
    return (
        <div id="online-user-content">
            {
                item.newMessage 
                ? <Announcement className={`online-user-icon-new`}/>
                : <AccountCircle className={`online-user-icon-normal`}/>
            }
            <span>{item.user}</span>
        </div>
    )
}