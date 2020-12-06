import { CircularProgress } from '@material-ui/core';

export default function ButtonPrimary({ label, loading, ...rest }) {
    return (
        <button className="button-primary-block" {...rest}>
            <b>{label}</b>
            { loading && <CircularProgress /> }
        </button>
    )
}