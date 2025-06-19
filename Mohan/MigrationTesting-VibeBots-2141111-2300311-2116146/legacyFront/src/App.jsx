import { useState } from 'react'
import './App.css'
import ListAccountComponent from './components/ListAccountComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ListAccountComponent/>
    </>
  )
}

export default App
