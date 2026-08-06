import { useState } from "react";

function App() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    const response = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <h1>CloudForge AI</h1>
      <input
        type="text"
        placeholder="Describe your app idea..."
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />
      <button onClick={handleGenerate}>Generate</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default App;