import { useState } from "react";
import "./index.css";

function App() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
        setIdea("");
      }
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  const pad = (id) => id.toString().padStart(4, "0");

  return (
    <div className="page">
      <header className="page__header">
        <span className="page__mark">▲</span>
        <div>
          <h1 className="page__title">CloudForge</h1>
          <p className="page__subtitle">Describe an app idea. Get a cloud architecture.</p>
        </div>
      </header>

      <main className="console">
        <label className="console__label" htmlFor="idea">&gt; describe your idea</label>
        <div className="console__input-row">
          <input
            id="idea"
            className="console__input"
            type="text"
            placeholder="I want to build Netflix"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
          />
          <button className="console__button" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating" : "Generate"}
          </button>
        </div>

        {error && <p className="console__error">{error}</p>}

        {result && (
          <div className="result">
            <span className="result__corner result__corner--tl" />
            <span className="result__corner result__corner--tr" />
            <span className="result__corner result__corner--bl" />
            <span className="result__corner result__corner--br" />
            <div className="result__id">#{pad(result.id)}</div>
            <p className="result__idea">{result.received_idea}</p>
            <p className="result__message">{result.message}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;