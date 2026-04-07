import React, { useState } from 'react';
import './App.css';
import { useRef } from 'react';

function App() {
  // a hook for the state of the left box
  const [isDragging, setIsDragging] = useState(false);
  // 1. Memory for the box where you type
  const [code, setCode] = useState("");
  // old input, new input(as a function) = useState converts given value to a variable 
  // and gives it to setCode()
  
  // 2. Memory for the box where the AI result will show up
  const [result, setResult] = useState("");
  //the same here

  const[code_type, setCode_type] = useState("");
  const[readme, setReadme] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null); // reference hook
  // it is referred by the input block. when browseClick activates this ref automatically gets the value of the input and clicks on it

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
      if (answer && typeof answer.code === "string") {
        console.log("4. SUCCESS! Setting result text to:", answer.code);
        setResult(answer.code);
        setCode_type(answer.code_type);
        setReadme(answer.readme);
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

  // file uploading button
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Green Check: Prevent massive files
    if (file.size > 100000) {
      alert("File is too large! Please upload a file smaller than 100KB.");
      return;
    }

    //checks if it's not a photo etc.
    if (!file.type.startsWith("text")) {
      alert("Unsupported file type. Please select a text file.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setCode(text);
      }
    };
    reader.readAsText(file);
    
    // Reset the input value so the user can upload the same file again if they want
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 4. New Function: Link the pretty button to the ugly hidden input
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (result == "" || result == "Sorry, it doesn't seem to be a valid code!" || result == "Error: Could not extract AI text." || code_type == "error") {
      alert("Nothing to download yet!"); //if bad code or nth submitted
      return;
    }
    //code file
    const codeBlob = new Blob([result], {type: "text/plain"});
    const codeUrl = URL.createObjectURL(codeBlob);
    const codeLink = document.createElement("a");
    codeLink.href  = codeUrl;
    codeLink.download = "optimized_code." + code_type;
    codeLink.click(); //begins the download
    URL.revokeObjectURL(codeUrl); //frees the memory

    //README file
    const readmeBlob = new Blob([readme], { type: "text/plain" });
    const readmeURL = URL.createObjectURL(readmeBlob);
    const readmeLink = document.createElement("a");
    readmeLink.href = readmeURL;
    readmeLink.download = "OPTIMIZATION_REPORT.md";
    readmeLink.click();
    URL.revokeObjectURL(readmeURL);
  }

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
 
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { // <HTMLDivElement> specifies that e comes from <div>
    e.preventDefault();
    setIsDragging(false);

    // Grab the first file dropped
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("text")) {
      alert("Unsupported file type. Please select a text file.");
      return;
    };
  
    // prevents dropping of too big files
    if (file.size > 100000) {
      alert("File is too large! Please upload a file smaller than 100KB.");
      return;
    };

    const reader = new FileReader();
    reader.onload = (event) => { //onload will be called after the first read
      const text = event.target?.result;
      if (typeof text === "string") {
        setCode(text);
      }
    };

    reader.readAsText(file); // reader can only read a file ONCE
  };

  return (
    <div className="main-container">
      <h1>Green Optimizer</h1>
      
      <div className="box-row">

        <div className="button-group">

            <button className="secondary-btn" onClick={handleBrowseClick}>
              📁 Browse File
            </button>
            <input 
              type="file" 
              style={{ display: 'none' }} // Hides "Datei auswählen"
              ref={fileInputRef} // Connects to the useRef hook
              onChange={handleFileUpload} 
            />
        {/* Left Box: Input */}
            <div 
              className={`input-wrapper ${isDragging ? 'dragging-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ position: 'relative', width: '100%' }}
            >
              {isDragging && (
                <div className="drag-overlay">
                  Drop file to Greenify!
                </div>
              )}

              <textarea className='box'
                placeholder="Paste code or drag & drop a file here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
        </div>

        <div className="button-group">
        {/* Right Box: Output (You cannot type here) */}
          <textarea className='box'
            placeholder="smash #greenify#!"
            value={result}
            readOnly
          />

            <button className="download-btn" onClick={handleDownload}>
              📥 Download Optimization Pack (.py + .md)
            </button>
        </div>

      </div>


      <button onClick={handleGreenify}>
        Greenify
      </button>

      <p className="counter">Total Characters: {code.length}</p>
    </div>
  );
}

export default App;