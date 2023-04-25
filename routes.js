const GmailRouter = require("express").Router()
const { authorize, listLabels } = require("./controller")


GmailRouter.get("/", async (req, res) => {
  try {
    const auth = await authorize()
    const mails = await listLabels(auth)
    return res.status(200).send({ auth, mails })
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({ err })
  }
})

module.exports = { GmailRouter }