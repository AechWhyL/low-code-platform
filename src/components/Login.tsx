import { Button } from "antd";
import React from "react";

const Login: React.FC = () => {
    const auth = localStorage.getItem('auth')
    const name = localStorage.getItem('name')
    if (auth) {
        return <Button>{name}</Button>
    } else {
        return (
            <div style={{ height: '100%' }}>Login</div>
        )
    }

}

export default Login;