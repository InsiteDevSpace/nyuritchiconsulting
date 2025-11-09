import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Test Hosting App</h1>
        <p>Welcome to your React application!</p>
        
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </button>
        </div>
      </header>
    </div>
  )
}

export default App

