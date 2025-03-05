import React, { useState } from 'react'

const ListPage: React.FC = () => {
    const [list, setList] = useState([])
    const refreshList = () => {
        getCanvasList().then((res: unknown) => {
            const list = res.content
            setList(list)
        })
    }
    return (
        <div>ListPage</div>
    )
}
export default ListPage