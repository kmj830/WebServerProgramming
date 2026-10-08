import './App.css'
import { useState } from 'react'

function App() {
    // counts 상태를 배열로 관리
    const [counts, setCounts] = useState([0, 0, 0])

    const onIncrement = (index) => {
        setCounts(prevCounts =>
            prevCounts.map((count, i) =>
                i === index ? count + 1 : count
            )
        )
    }

    // 배열에 새로운 카운터 값을 추가 (초기값 0)
    const onAddCounter = () => {
        setCounts(prevCounts => [...prevCounts, 0])
    }

    // counts 배열의 모든 값을 더함
    const total = counts.reduce((sum, current) => sum + current, 0)

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
            <button onClick={onAddCounter}>
                카운터 추가
            </button>
            {
                // map 메서드로 counts 배열을 순회하며 Counter 컴포넌트 렌더링
                counts.map((count, index) => (
                    <Counter
                        // key는 React에서 항목을 식별하고 렌더링할 때 필요하지만,
                        // Counter 컴포넌트에는 전달되지 않음
                        key={index} // index를 key로 사용 (실제 앱에서는 고유한 id 사용 권장)
                        count={count}
                        onIncrement={() => { onIncrement(index) }}
                    />
                ))
            }
        </div>
    )
}

function Counter({ count, onIncrement }) {
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