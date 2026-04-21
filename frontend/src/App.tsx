import React, { useState } from 'react';
import './App.css';
import { useRef } from 'react'

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
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // reference hook
  // it is referred by the input block. when browseClick activates this ref automatically gets the value of the input and clicks on it

  // 3. This function runs when you click the button
const handleGreenify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Absolutely prevent any accidental form submissions/refreshes
    if (e && e.preventDefault) e.preventDefault();
    
    console.log("1. Button clicked, setting to loading...");
    setIsLoading(true);
    setResult("");

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"; //deploying the website on the render host

    try {
      const response = await fetch(`${API_BASE}/gen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code })
      });

      const answer = await response.json();
      
      console.log("DEBUG: Full Backend Response Object:", answer);
      console.log("DEBUG: README Content length:", answer.readme?.length);

      // Explicitly check that the 'response' key exists and is a string
      if (answer && typeof answer.code === "string") {
        console.log("4. SUCCESS! Setting result text to:", answer.code);
        setResult(answer.code);
        setCode_type(answer.code_type);
        setReadme(answer.readme);
      } else {
        console.error("4. ERROR: The JSON doesn't have a valid 'response' key.");
        setResult("The server is overloaded, please try again later.");
      }
    } 
    catch (error) {
      console.error("Fetch Error:", error);
      setResult("error");
    }
    finally {
      setIsLoading(false);
    }
  };

  const isValidFile = (file: File ) => {
    const ext = ['java', 'py', 'js', 'ts', 'cpp', 'c', 'cs', 'html', 'css', 'go', 'rs', 'php', 'md'];
    const fileext = file.name.split(".").pop()?.toLowerCase(); // take the .java/.py/...
    return file.type.startsWith("text/") || (fileext && ext.includes(fileext)); //file.type for MIME
  }

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
    if (!isValidFile(file)) {
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

  // links the upload button to the "Datei auswählen"
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

    if (!isValidFile(file)) {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  function Header() {
    return (
      <header className='header'>
          <a href="mailto:an.malyshev2004@gmail.com" className="contact-item hidden" style={{margin: "0px 0px 0px 15px"}}>
                <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
            </a>
          <a href="https://github.com/andreymalyshev-de" className="contact-item hidden" target="_blank" rel="noopener noreferrer">
                    {/* _blank makes the link to be open in a new tab, "noopener noreferrer" prevents hacker attaks from the opened website */}
                <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
            </a>
          <a href="https://www.linkedin.com/in/andrii-malyshev" className="contact-item hidden" target="_blank" rel="noopener noreferrer">
                <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                </svg>
            </a>
          <a href="https://andreymalyshev.com/" className="contact-item hidden" target="_blank" rel="noopener noreferrer">
                <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0c2.76 0 5 4.48 5 10s-2.24 10-5 10-5-4.48-5-10 2.24-10 5-10zM2 12h20M12 2v20M5 8.5h14M5 15.5h14"></path>
                </svg>
            </a>
      </header>
    )
  }

  return (
    <>
    <Header />
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
              className={`input-wrapper ${isDragging ? 'dragging-active' : ''}`} // adds dragging-active flag to the class if isDragging
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragging && (
                <div className="drag-overlay">
                  Drop file to Greenify!
                </div>
              )}

              <textarea className='box'
                spellCheck='false'
                placeholder="Paste code or drag & drop a file here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <p className="counter">Total Characters: {code.length}</p>
        </div>

        <div className="button-group">
        {/* Right Box: Output */}
            {isLoading
              ? (
                <div className="loading-overlay">
                  <div className="spinner" />
                </div>
              )
              : (
                <textarea className='box'
                  placeholder="smash #greenify#!"
                  value={result}
                  readOnly
                />
              )
            }
            
            <button className="download-btn" onClick={handleDownload}>
              📥 <br></br>Download Optimized Code + README
            </button>
          <div className="count-copy">
            <p className="counter" style={{width: "auto", height: "auto"}}>Total Characters: {result.length}</p>
            <button className="copy-btn" onClick={handleCopy}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {/* The back square */}
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  {/* The front overlapping square */}
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            </button>
            <div className='tip-text'>copy the text</div>
          </div>
        </div>

      </div>


      <button className='green-btn' onClick={handleGreenify}>
        Greenify
      </button>

    </div>
    <footer>
      <div className="copyright">© 2026 Andrey Malyshev</div>
    </footer>
    </>
  );
}

export default App;