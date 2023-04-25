const { authenticate } = require('@google-cloud/local-auth');
const { scope } = require("./locals/local")
const path = require('path');
const process = require('process');
const { google } = require('googleapis');
const base64 = require('js-base64')


const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

async function authorize() {
  console.log(scope, '-----> scope')
  client = await authenticate({
    scopes: ['https://mail.google.com/'],
    keyfilePath: CREDENTIALS_PATH,
  });
  return client;
}

async function listLabels(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    q:'subject:itr'
  });
  const msg = res.data.messages
  const mails = []
  for (let message of msg) {
    let body1, body2, attachment
    txt = await gmail.users.messages.get({ userId: 'me', id: message['id'] })
    if (txt.data.payload?.parts[0]){
      body1 = base64.decode(txt.data.payload?.parts[0]?.parts[0]?.body?.data)?.replace(/-/g, '+')?.replace(/_/g, '/')
      body2 = base64.decode(txt.data.payload?.parts[0]?.parts[1]?.body?.data).replace(/-/g, '+')?.replace(/_/g, '/')
    }
    if (txt.data.payload?.parts[1]?.body?.attachmentId !== undefined) {
     let attachmentId = txt.data.payload?.parts[1]?.body?.attachmentId
     attachment = await gmail.users.messages.attachments.get({userId: 'me', id: attachmentId, messageId:message['id']})
    }
    mails.push({ body1, body2, attachment, txt })
  }
  return { mail: mails };
}

module.exports = {
  authorize,
  listLabels
}