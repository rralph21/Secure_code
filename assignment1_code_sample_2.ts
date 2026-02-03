import * as readline from 'readline';
import * as mysql from 'mysql';
import * as http from 'https'; // using https for security

// instead of hard coding sensitive infor. using environmental variable
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "app_writer", 
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "mydb",
};

function isValidName(name: string): boolean {
  return /^[a-zA-Z -]{1,50}$/.test(name.trim());
}

function getUserInput(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question("Enter your name: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function sendEmail(to: string, subject: string, body: string) {
  console.log("\n--- Email (simulated) ---");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Body:", body);
  console.log("-------------------------\n");
}

// using https
function getData(): Promise<string> {
    return new Promise((resolve, reject) => {
        http.get('https://secure-api.com/get-data', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function saveToDb(data: string) {
  const connection = mysql.createConnection(dbConfig);

  const query = "INSERT INTO mytable (column1, column2) VALUES (?, ?)";
  const values = [data, "Another Value"];

  connection.query(query, values, (error) => {
    if (error) console.error("Error executing query:", error);
    else console.log("Data saved safely");

    connection.end();
  });
}

(async () => {
    const userInput = await getUserInput();

    if (!isValidName(userInput)) {
    console.log("Invalid name. Use only letters/spaces/hyphen (1–50 chars).");
    return;
  }

    try {
        const data = await getData();
        saveToDb(data);
        sendEmail('admin@example.com', 'User Input', userInput.trim());
        } catch (err) {
            console.error("Request failed:", err);
}});