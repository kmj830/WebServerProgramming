import './App.css'
import { useState } from 'react'

function App() {

    const [counts, setCounts] = useState([0, 0, 0]);

    const onIncrement = (index) => {
        setCounts(prevCounts =>
            prevCounts.map((count, i) => i === index ? count + 1 : count)
        )
    }

    const total = counts.reduce((sum, current) => sum + current, 0);

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
            <h1>총합: {total}</h1>
            {
                counts.map((count, index) => (
                    <Counter
                        key={index}
                        count={count}
                        onIncrement={() => onIncrement(index)}
                        idx={index}
                    />
                ))
            }
        </div>
    );
}
/*{} : 객체*/
function Counter({idx, count, onIncrement}) {
  return (
      <div>
        <h1>Counter {idx+1} : {count}</h1>
        <button onClick={onIncrement}>
            증가
        </button>
      </div>
  )
}

export default App