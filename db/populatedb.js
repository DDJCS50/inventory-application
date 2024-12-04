const { Client } = require("pg");

let currentDate = new Date().toString();

// TODO: write table creation script after db initialization
const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ),
  textInput VARCHAR ( 255 ),
  added VARCHAR ( 255 ),
  details VARCHAR ( 255 )
);

INSERT INTO messages (username, textInput, added, details) 
VALUES 
  ('Bryan', 'Hello from Bryan', '${currentDate}', 'I just wanted to say hello first'),
  ('Odin', 'Hello from Odin', '${currentDate}', 'I just wanted to say hello second');
`;

// Reset table
const resetTableSQL = `
DROP TABLE messages;
`;

async function main(dbConnection) {
  console.log("seeding...");
  const client = new Client({
    connectionString: dbConnection,
  });
  await client.connect();
  console.log(currentDate);
  console.log("connected");
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main(process.argv[2]);

// use script: npm run createdb "Local/ remote db url"
