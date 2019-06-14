const { Client } = require('pg');
const client = new Client();

export async function writeToDB(dataObject) {
    client.connect();
    client.query('')
    client.end();
}