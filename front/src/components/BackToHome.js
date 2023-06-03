import React from 'react'
import '../App.css'
import {Link} from 'react-router-dom'

const BackToHome = () => {
  return (
    <p>
      <Link to={'/'} className='App-button'>
        Back to Home Page
      </Link>
    </p>
  )
}

export default BackToHome