import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './redux/features/slice';

function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-3xl font-bold">Redux Counter: {count}</h1>

      <div className="flex gap-4">
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          +
        </button>

        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          -
        </button>

        <button
          onClick={() => dispatch(incrementByAmount(5))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          +5
        </button>
      </div>
    </div>
  );
}

export default App;
