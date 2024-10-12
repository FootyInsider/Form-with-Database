// We use require to import packages
const express = require('express')  // Make Backend possible
const path = require('path')  // To format path properly
const bodyParser = require('body-parser')
const { google } = require('googleapis')//For data


// Initializing express app
const app = express()

app.use(express.static(path.join(__dirname, 'public'))) // Telling express to use public folder as HTML root path
app.use(bodyParser.urlencoded({ extended: true }))  // To be able to parse data from form

// Loading Environment Variables
require('dotenv').config()


// Function to add user data to Google Sheets
async function appendToGoogleSheet(data) {
const credentials = JSON.parse(
  Buffer.from(process.env.CRED, "base64").toString()
)
  console.log(process.env.sheet_id)
  console.log(credentials)
  // Inserting credentials.json Into Parser
  const auth = new google.auth.GoogleAuth({
    // keyFile: path.join(__dirname,'credentials.json'),
      credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  // Getting authentication For Parsed Object 
  const authClient = await auth.getClient()

  // Google Sheets setup
  const sheets = google.sheets({version:'v4',auth:authClient})

  // Our Request to Google sheets
  const request = {
    spreadsheetId: process.env.sheet_id,
    range: 'Sheet1!A1:A',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [data],//Data must be in can array
    },
    auth: authClient,
  }

  try {
    const response = await sheets.spreadsheets.values.append(request)
    console.log('Data added to Google Sheet:', response)
  } catch (err) {
    console.error('Error adding data to Google Sheet:', err)
    throw err
  }
}

// This displays the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))// This sends a file to our home page
})

// Submit route for when the submit button is clicked
app.post('/submit-form', async (req, res) => {
  const formData = req.body

  // Prepare data array for Google Sheets
  // You can change this to fix your HTML form names
  const data = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.password,
    formData.confirmPassword,
    formData.phone,
    formData.dob,
    formData.gender,
    formData.nationality,
    formData.nonNigerianNationality,
    formData.stateOfOrigin,
    formData.profilePicture,
    formData.agreement,
  ]

  // Append the data to Google Sheets
  try {
    await appendToGoogleSheet(data)
    res.status(200).json({ message: 'Form data submitted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit data to Google Sheets' })
  }
})

// For when people try to go to sub-URLs that don't exist
app.use((req, res) => {
  res.status(404).send(`Page not found.`);
})

// This starts an express server
const port = 1012;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Open http://localhost:${port} in your browser.`);
});
