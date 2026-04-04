import { useState } from 'react';
import './App.css';

function App() {
  // 1. Memory for the box where you type
  const [code, setCode] = useState("");
  // old input, new input(as a function) = useState converts given value to a variable 
  // and gives it to setCode()
  
  // 2. Memory for the box where the AI result will show up
  const [result, setResult] = useState("");
  //the same here

  // 3. This function runs when you click the button
const handleGreenify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Absolutely prevent any accidental form submissions/refreshes
    if (e && e.preventDefault) e.preventDefault();
    
    console.log("1. Button clicked, setting to loading...");
    setResult("loading...");

    try {
      const response = await fetch("http://localhost:8000/gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code })
      });

      console.log("2. Response received with status:", response.status);
      const answer = await response.json();
      console.log("3. Parsed JSON object:", answer);

      // Explicitly check that the 'response' key exists and is a string
      if (answer && typeof answer.response === "string") {
        console.log("4. SUCCESS! Setting result text to:", answer.response);
        setResult(answer.response);
      } else {
        console.error("4. ERROR: The JSON doesn't have a valid 'response' key.");
        setResult("Error: Could not extract AI text.");
      }
    } 
    catch (error) {
      console.error("Fetch Error:", error);
      setResult("error");
    }
  };

/*     const click = () => {
    if (code =="Paste your code here...") {
      setCode("");
    }
  }

  const blurr = () => {
    if (code == "") {
      setCode("Paste your code here...");
    }
  } */

  return (
    <div className="main-container">
      <h1>Green Optimizer</h1>
      
      <div className="box-row">
        {/* Left Box: Input */}
        <textarea className='box'
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {/* Right Box: Output (You cannot type here) */}
        <textarea className='box'
          placeholder="smash #greenify#!"
          value={result}
          readOnly
        />
      </div>

      <button onClick={handleGreenify}>
        Greenify
      </button>

      <p className="counter">Total Characters: {code.length}</p>
    </div>
  );
}

export default App;