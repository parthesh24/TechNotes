import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {

    const { username, isManager, isAdmin} = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long'}).format(date)

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome {username}!</h1>

            <p><Link to="notes">View Tech Notes</Link></p>

            <p><Link to="notes/new">Add New techNote</Link></p>

            {(isManager || isAdmin) && <p><Link to="users">View User Settings</Link></p>}

            {(isManager || isAdmin) &&<p><Link to="users/new">Add New User</Link></p>}
            
        </section>
    )

    return content
}

export default Welcome