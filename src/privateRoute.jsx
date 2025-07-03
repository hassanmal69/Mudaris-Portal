import { UserAuth } from './context/authContext'
import { Navigate } from 'react-router-dom'
const PrivateRoute = ({ children }) => {
    const { session } = UserAuth();
    if (session === undefined) {
        <p>loading.......</p>
    }
    return (
        <> {session ? <>{children}</> : <><Navigate to='/' /></>}</>
    )
}
export default PrivateRoute