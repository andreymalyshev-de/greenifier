
# 🌿 Green Compute Analyzer

An AI-powered code optimization tool primarilily built for checking and optimizing the O-complexity of the given code. 

## 🧠 Goal: 
The goal of the project was to learn how to build a communication bridge between LLMs and frontend UI while analyzing user code, trying to get the best possible execution time, which potentially reduces the energy costs and CO2 emission, if the optimized code is to be used continuosly.


## 🛠️ The Tech Stack:
The "brain" of the project was implemented in python where the communication with various **LLM models** (gemini-3.1-flash-lite-preview, gemini-3.1-flash and gemini-2.0-flash) took place. For this purpose I used **FastAPI, google** and **pydentic** libraries which helped me to receive, elaborate and send back user inputs. The communication with the LLM also required a sound prompt which would be strict and understandable enough for the AI, so that it produces only relevant informations and isn't prone for malicious prompts. 
Another challenge was to establish proper **CORS security measures** between different hosts - **CORSMiddleware** library was very handy here.

The UI part contains much of logic too, as it provides the user with an ability to up/- and download files(handleFileUpload(), handleDrop(), handleDownload()), to start the code optimization(handleGreenify()) and more(handleCopy(), handleDrag()). That was realized in **TypeScript** with the **React** library, the environment was created with help of **vite**.

The whole project is deployed in **Docker** containers what provides usage simplicity and safety of sensible data like API_KEYs etc. The backend runs remotely from a **render** server, so please wait a bit till the server wakes up, if it's your first time here :)


## 💻 The UI:
I decided to set up 3 possibilities for code upload - over file upload button, manually tiping the text and dragging the file over the left textarea. The right textarea isn't writable, it serves only as an AI response representation. There you can either copy the answer text or download the optimized code file with a README, which gives some explanations on what, how and why was optimized in the given code.


## 💬 Feedback:
I am happy to hear any feedback from you, please contact me via resources you can find in the [Greenifier](https://andreymalyshev.com/greenifier/) or here: andreymalyshev.com


