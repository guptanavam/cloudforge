import { useState } from "react";
import "./index.css";

function App() {
  const [idea, setIdea] = useState("");
  const [expectedUsers, setExpectedUsers] = useState("");
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
        body: JSON.stringify({
          idea,
          expected_users: expectedUsers ? parseInt(expectedUsers, 10) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
        setIdea("");
        setExpectedUsers("");
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

        <label className="console__label console__label--secondary" htmlFor="expectedUsers">
          &gt; expected users (optional)
        </label>
        <input
          id="expectedUsers"
          className="console__input console__input--small"
          type="number"
          placeholder="e.g. 10000 — leave blank to see all tiers"
          value={expectedUsers}
          onChange={(e) => setExpectedUsers(e.target.value)}
        />

        {error && <p className="console__error">{error}</p>}

        {result && (
          <div className="results">
            <div className="results__meta">
              Project #{pad(result.id)} · {result.expected_users ? `${result.expected_users.toLocaleString()} expected users` : "No scale specified"}
            </div>

            <p className="results__summary">{result.architecture.summary}</p>

            <div className="tiers">
              {result.architecture.architecture_options.map((option, i) => (
                <div className="tier" key={i}>
                  <span className="tier__corner tier__corner--tl" />
                  <span className="tier__corner tier__corner--tr" />
                  <span className="tier__corner tier__corner--bl" />
                  <span className="tier__corner tier__corner--br" />

                  <div className="tier__header">
                    <span className="tier__name">{option.tier_name}</span>
                    <span className="tier__cost">{option.estimated_monthly_cost_usd}/mo</span>
                  </div>

                  <p className="tier__db"><strong>Database:</strong> {option.suggested_database}</p>

                  <div className="tier__services">
                    {option.key_aws_services.map((service, j) => (
                      <span className="service-pill" key={j}>{service}</span>
                    ))}
                  </div>

                  <p className="tier__notes">{option.notes}</p>
                </div>
              ))}
            </div>

            <p className="disclaimer">⚠ {result.architecture.cost_disclaimer}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;