import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Simulated Social Media Environment</h1>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate('/feed/a')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
        >
          Start Condition A
        </button>
        <button
          onClick={() => navigate('/feed/b')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
        >
          Start Condition B
        </button>
      </div>
    </div>
  );
}
