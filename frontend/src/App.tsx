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
  const handleGreenify = () => {
    // For now, it just mimics an analyzer until our Java backend is ready
    setResult("Analyzing your code for CO2 efficiency...\n\nResult: " + code);
  };

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