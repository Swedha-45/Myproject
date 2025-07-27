import Form from "../components/Form"
import { Link } from 'react-router-dom';

function Login() {
    return( 
    <>
        <Form route="/api/token/" method="login" />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link to="/">No account yet? Please register!</Link>
        </div>
    </>)
              
}

export default Login