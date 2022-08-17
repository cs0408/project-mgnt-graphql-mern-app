import React from 'react'
import Clients from '../components/Clients'
import AddClient from '../components/modals/AddClient'
import AddProject from '../components/modals/AddProject'
import Projects from '../components/Projects'

const Home = () => {
  return (
    <>
      <div className='d-flex gap-3 mb-4'>
        <AddClient />
        <AddProject />
      </div>
      <Projects />
      <hr />
      <Clients />
    </>
  )
}

export default Home
