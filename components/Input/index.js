export default function InputComponent ({ label, name, ...rest }) {
    return (
        <div className="input-block">
            <span>{label || ''}</span>
            
            <input 
                label={label} 
                id={name} 
                { ...rest } 
            />
        </div>
    )
}