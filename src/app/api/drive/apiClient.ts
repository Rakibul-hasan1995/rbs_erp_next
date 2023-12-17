// const { google } = require('googleapis');
import {google} from 'googleapis'
import credentials from './light-operator-407613-e89cd5c3213b.json'


const { client_email, private_key } = credentials;

const auth = new google.auth.JWT({
   email: client_email,
   key: private_key,
   scopes: ['https://www.googleapis.com/auth/drive.file'], // Adjust the scope based on your needs
});

export const drive = google.drive({ version: 'v3', auth });


