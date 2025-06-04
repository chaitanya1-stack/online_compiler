# 🖥️ Z_CODER - Online Code Compiler

A full-stack online code compiler built using **Node.js**, **Express**, and **CodeMirror** that allows users to write, compile, and execute code in **C++**, **Python**, and **Java** right from the browser.

---

## 📌 Features

- 💡 Write and run code in **C++**, **Python**, and **Java**
- 🧠 Syntax highlighting using **CodeMirror**
- 📥 Provide custom input
- 📤 View real-time output or errors
- 🎨 Dark theme UI with responsive layout (mobile/tablet/laptop)
- 🔒 Unique file generation for each request to avoid collisions

---

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, Bootstrap 5, CodeMirror 5
- **Backend:** Node.js, Express
- **Execution:** `child_process` for running compiled/executed code
- **Security:** Temporary files auto-deleted after execution

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/online-code-compiler.git
cd online-code-compiler
```
### 2. Install Dependencies

```bash
npm install
```

###  3. Run the Server
```bash
node Api.js
```
🔧 Make sure g++, python3, and javac are installed and accessible in your system's PATH.

### 4. Open in Browser
```bash
http://localhost:3000
```






