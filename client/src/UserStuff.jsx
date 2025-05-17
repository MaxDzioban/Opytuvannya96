import React from 'react'

export const UserIcon = ({ username }) => {
    return (
        <div className="user-label">
            <img src="/User_with_computer.ico" alt="User Icon" id="user-icon" />
            <p id="user-name">{username}</p>
        </div>
    )
}

export const Statistics = ({ username }) => {

}
