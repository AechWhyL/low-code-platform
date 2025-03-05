import React from "react";
import LeftSider from "./LeftSider";
import RightSider from "./RightSider";
import Center from "./Center";
import Header from "./Header";
import { Layout } from "antd";
import styles from "./index.module.scss";
const editpageClass = styles['edit-page']

const layoutStyle: React.CSSProperties = {
  overflow: 'auto',
  width: '100%',
  height: 'calc(100vh - 64px)',
  position: 'relative',

};

const EditPage: React.FC = () => {
  return (
    <>
      <Header />
      <Layout style={layoutStyle} className={editpageClass}>
        <LeftSider />
        <Center />
        <RightSider />
      </Layout>
    </>
  )
}

export default EditPage
