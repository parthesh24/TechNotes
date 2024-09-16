import { Link } from 'react-router-dom'
import React from 'react'


const Public = () => {
  const content = (
    <section className="public">
        <header>
            <h1>Welcome to <span className="nowrap">Tech Notes!</span></h1>
        </header>
        <main className="public__main">
            <p>Assign notes to your colleagues, students, or anyone as a reminder.</p>
            <address className="public_mail">
                For any queries, contact: partheshptl994@gmail.com<br/>
            </address>
        </main>
        <footer>
            <Link to="/login">Login</Link>
        </footer>
    </section>
  )
  return content
}

export default Public