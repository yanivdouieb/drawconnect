const express = require("express")
const serverless = require("serverless-http")
const app = express()
const cors = require("cors")
const path = require("path")
const editJsonFile = require("edit-json-file");

app.set("views", path.join(__dirname, "dist/html"))
app.set("view engine", "ejs")
app.use(cors())

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/mobile/', (req, res) => {
    res.render('mobile')
})
app.post('/api/id/', (req, res) => {
    const id = req.headers.id
    let db = editJsonFile(`${__dirname}/dist/data/id.json`);
    db.set(id, true)
    db.save()
    res.json({
        success: true,
    })
})
app.get('/api/id/:id', (req, res) => {
    let db = editJsonFile(`${__dirname}/dist/data/id.json`);
    if(db.get(req.params.id)){
        res.json({
            success: true,
        })
    }else{
        res.json({
            success: false,
        })
    }
})
app.post('/api/connexion/', (req, res) => {
    const id = req.headers.id
    let db = editJsonFile(`${__dirname}/dist/data/connexion.json`);
    db.set(`${id}.name`, req.headers.name)
    db.set(`${id}.progress`, req.headers.progress)
    db.save()
    res.json({
        success: true,
    })
})
app.get('/api/connexion/:id', (req, res) => {
    let db = editJsonFile(`${__dirname}/dist/data/connexion.json`);
    if(db.get(`${req.params.id}.progress`)){
        res.json({
            success: true,
            name: db.get(`${req.params.id}.name`),
            progress: db.get(`${req.params.id}.progress`),
        })
    }else{
        res.json({
            success: false,
        })
    }
})
app.get('/panel/mobile', (req, res) => {
    res.render('panelMobile.ejs')
})
app.get('/panel/desktop', (req, res) => {
    res.render('panelDesktop.ejs')
})
app.post('/api/draw/:id', (req, res) => {
    const id = req.params.id
    const json = req.headers.json
    let db = editJsonFile(`${__dirname}/dist/data/paneldata.json`);
    db.set(`${id}.json`, json)
    db.save()
    res.send('OK')
})
app.get('/api/draw/:id', (req, res) => {
    const id = req.params.id
    let db = editJsonFile(`${__dirname}/dist/data/paneldata.json`);
    if(db.get(`${id}.json`)){
        res.json({
            success: true,
            json: db.get(`${id}.json`),
        })
    }else{
        res.json({
            success: false,
        })
    }
})
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/robots.txt'))
})
module.exports.handler = serverless(app);