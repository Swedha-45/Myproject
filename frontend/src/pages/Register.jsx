import Form from "../components/Form"
import { Link } from 'react-router-dom'
function Register() {
    return(
    <>
        <Form route="/api/user/register/" method="register" />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link to="/login">Already registered? Please login!</Link>
        </div>
    </>)
}

export default Register