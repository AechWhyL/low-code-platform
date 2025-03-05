import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router";
import Login from "./Login";
const { Header } = Layout;

const Auth: React.FC = () => {
    const HeaderStyle: React.CSSProperties = {
        height: 64,
        textAlign: 'center',
        lineHeight: 64,
        color: '#fff',
        backgroundColor: '#7dbcea',
        paddingInline: 10
    }
    return (
        <Layout>
            <Header style={HeaderStyle}>
                <Login />
            </Header>
            <Outlet />
        </Layout>
    )
}
export default Auth;