const express = require("express");
const path = require("path");
const bodyP = require("body-parser");
const fs = require("fs");
const { exec } = require("child_process");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyP.json());
app.use(express.static(__dirname)); // Serve index.html and static files
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL"); // or SAMEORIGIN
  res.setHeader("Access-Control-Allow-Origin", "*"); // optional for CORS
  next();
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/compile", (req, res) => {
    const code = req.body.code;
    const input = req.body.input || "";
    const lang = req.body.lang;

    // Generate a unique ID for this request to avoid conflicts
    const id = crypto.randomBytes(8).toString("hex");

    if (lang === "cpp") {
        const filename = `main_${id}.cpp`;
        const execFile = `a_${id}.out`;

        fs.writeFileSync(filename, code);

        exec(`g++ ${filename} -o ${execFile}`, (compileErr, stdout, stderr) => {
            if (compileErr) {
                cleanupFiles();
                return res.send({ error: stderr });
            }

            const run = exec(`./${execFile}`, (runErr, runStdout, runStderr) => {
                cleanupFiles();
                if (runErr) return res.send({ error: runStderr });
                res.send({ output: runStdout });
            });

            if (input) {
                run.stdin.write(input + "\n");
                run.stdin.end();
            }
        });

        function cleanupFiles() {
            fs.unlink(filename, () => {});
            fs.unlink(execFile, () => {});
        }
    }

    else if (lang === "python") {
        const filename = `main_${id}.py`;
        fs.writeFileSync(filename, code);

        const run = exec(`python3 ${filename}`, (err, stdout, stderr) => {
            cleanupFiles();
            if (err) return res.send({ error: stderr });
            res.send({ output: stdout });
        });

        if (input) {
            run.stdin.write(input + "\n");
            run.stdin.end();
        }

        function cleanupFiles() {
            fs.unlink(filename, () => {});
        }
    }

    else if (lang === "java") {
        const filename = `Main_${id}.java`;
        fs.writeFileSync(filename, code);

        exec(`javac ${filename}`, (compileErr, stdout, stderr) => {
            if (compileErr) {
                cleanupFiles();
                return res.send({ error: stderr });
            }

            const run = exec(`java Main_${id}`, (runErr, runStdout, runStderr) => {
                cleanupFiles();
                if (runErr) return res.send({ error: runStderr });
                res.send({ output: runStdout });
            });

            if (input) {
                run.stdin.write(input + "\n");
                run.stdin.end();
            }
        });

        function cleanupFiles() {
            // Delete java source and class files
            fs.unlink(filename, () => {});
            fs.unlink(`Main_${id}.class`, () => {});
        }
    }

    else {
        res.status(400).send({ error: "Unsupported language" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
