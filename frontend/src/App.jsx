import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/HomePage'
import { Route,BrowserRouter,Routes } from 'react-router-dom'
import RecorderComponent from './pages/Recorder'
import UploadComponent from './pages/upload'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/live-recording/' element={<RecorderComponent/>} />
        <Route path='/upload/' element={<UploadComponent/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
