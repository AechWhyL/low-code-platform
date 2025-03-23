import React from "react";
import LeftSider from "./LeftSider";
import RightSider from "./RightSider";
import Center from "./Center";
import Header from "./Header";
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
      <div style={layoutStyle} className={editpageClass}>
        <LeftSider />
        <Center />
        <RightSider />
      </div>
    </>
  )
}

export default EditPage
