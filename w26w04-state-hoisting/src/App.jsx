import './App.css'
import { useState } from 'react'

function App() {
  return (
      <div>
        <a href="../" className="nav-back-btn" title="메인 포털로 돌아가기">
          ← 목록으로
        </a>
        <Counter/>
        <Counter/>
      </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)

  return (
      <div>
        <h1>Counter: {count}</h1>
        <button
            onClick={ () => setCount( prev => prev + 1 ) }>
          증가
        </button>
      </div>
  )
}

export default App