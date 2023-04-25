const express = require("express")
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')
const base64 = require('js-base64')
require('dotenv').config()
const { GmailRouter } = require('./routes')

const app = express()

app.use(express.json())

app.use('/', GmailRouter)

app.listen(3000, () => console.log("Server Connected to port " + 3000))