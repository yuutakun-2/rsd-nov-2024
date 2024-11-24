import { useEffect, useMemo, useState } from "react";

function doSomething() {
    return "Do Somethings..";
}

export default function App() {
    const [count, setCount] = useState(0);
    const [result, setResult] = useState(false);

    const value = useMemo(() => {
        return doSomething();
    }, [result]);

    return (
		<div>
			<h1>Count: {count}</h1>
            <h2>{value}</h2>
			<button
				onClick={() => {
					setCount(count + 1);
				}}>
				Increase
			</button>

			<button
				onClick={() => {
					setResult(true);
				}}>
				Increase
			</button>
		</div>
	);
}
