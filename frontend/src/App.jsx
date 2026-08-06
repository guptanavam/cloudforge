import { useState } from "react";

function App() {
  const [idea, setIdea] = useState("");

  return (
    <div>
      <h1>CloudForge AI</h1>
      <input
        type="text"
        placeholder="Describe your app idea..."
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />
      <button>Generate</button>
    </div>
  );
}

export default App;