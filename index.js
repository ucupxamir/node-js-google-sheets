const express = require('express')
const { google } = require('googleapis');
const bodyParser = require('body-parser');

//initialize express
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/data', async (request, response) => {
    try {
        const data = request.query;

        const auth = new google.auth.GoogleAuth({
            keyFile: "keys.json", //the key file
            //url to spreadsheets API
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });

        //Auth client Object
        const authClientObject = await auth.getClient();

        //Google sheets instance
        const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

        // spreadsheet id
        const spreadsheetId = "1fWyWSF-7v1_ccRs6rrD_IbYYDv6_QDdIaNRspiIQy40";

        //write data into the google sheets
        await googleSheetsInstance.spreadsheets.values.append({
            auth, //auth object
            spreadsheetId, //spreadsheet id
            range: "Sheet1!A:B", //sheet name and range of cells
            valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
            resource: {
                values: [Object.values(data)]
            },
        });

        response.send("success")
    } catch (error) {
        console.error(error);
    }
});

const PORT = 3000;

//start server
app.listen(PORT, () => {
    console.log(`Server started on port localhost:${PORT}`);
});