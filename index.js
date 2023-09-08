const express = require('express')
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const moment = require('moment');

//initialize express
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/data', async (request, response) => {
    try {
        const data = request.query;

        const currentDate = moment().format("DD/MM/YYYY");
        const currentTime = moment().format("HH:mm:ss")

        const values = [currentDate, currentTime,  data.strain, data.stress, data.youngsModulus];

        const auth = new google.auth.GoogleAuth({
            keyFile: "keys.json", 
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });

        const authClientObject = await auth.getClient();

        const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

        const spreadsheetId = "1fWyWSF-7v1_ccRs6rrD_IbYYDv6_QDdIaNRspiIQy40";

        await googleSheetsInstance.spreadsheets.values.append({
            auth, 
            spreadsheetId, 
            range: "Sheet1!A:E", 
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [values]
            },
        });

        response.send("success")
    } catch (error) {
        console.error(error);
    }
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server started on port localhost:${PORT}`);
});