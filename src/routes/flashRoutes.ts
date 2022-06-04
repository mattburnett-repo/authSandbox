
var express = require('express')
var router = express.Router()

module.exports = (app: any) => {
    app.use('/flash', router)

    router.get('/send', async (req: any, res: any) => {
        await req.flash('info', 'Flash message from /send route')
        res.redirect('/flash/receive')
    })

    router.get('/receive', async (req: any, res: any) => {
        const messages = await req.consumeFlash('info')
        // const response = {msg: 'hello from response var'}
        const response = ''
        res.render('flash', { messages, response })
    })
}
