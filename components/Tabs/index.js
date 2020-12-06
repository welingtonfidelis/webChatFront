import { useState } from 'react';

export default function OnlineUserItem({ items }) {
    const [active, setActive] = useState(0);

    return (
        <div id="tabs-content">
            <ul>
                {
                    items.map((item, index) => (
                        <li 
                            onClick={() => setActive(index)}
                            className={index === active && 'tab-active'}
                        >
                            <span>
                                {item.label}
                            </span>
                        </li>
                    ))
                }
            </ul>

            {items[active].content || null}
        </div>
    )
}