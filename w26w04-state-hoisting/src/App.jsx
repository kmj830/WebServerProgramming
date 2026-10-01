import './App.css'
import { useState } from 'react'

function App() {

    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);

    return (
        <div>
            <a
                href="../"
                className="nav-back-btn"
                title="메인 포털로 돌아가기"
                onClick={(e) => {
                    if (window.location.pathname.includes('/dist')) {
                        e.preventDefault();
                        window.location.href = '../../';
                    }
                }}
            >
                ← 목록으로
            </a>
            <Counter count={count1} onIncrement={() => setCount1(prev => prev + 1)}/>
            <Counter count={count2} onIncrement={() => setCount2(prev => prev + 1)}/>
        </div>
    );
}
/*{} : 객체*/
function Counter({count, onIncrement}) {
  return (
      <div>
        <h1>Counter: {count}</h1>
        <button onClick={onIncrement}>
            증가
        </button>
      </div>
  )
}

export default App