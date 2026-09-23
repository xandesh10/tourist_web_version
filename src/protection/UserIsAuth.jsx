import React from 'react'
import { useSelector } from 'react-redux'



function UserIsAuth() {

    const { status } = useSelector((state) => state.isAuth)

    if (status === true) {
        return 'isAuth';
    }else {
        return 'notAuth';
    }
}

export default UserIsAuth