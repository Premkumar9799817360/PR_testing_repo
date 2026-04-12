const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const jwt = require('jsonwebtoken')

app.use(bodyParser.json())

let users = []
let payments = []

const SECRET = "12345"

app.post('/register', (req, res) => {
    const { username, password } = req.body
    users.push({ username: username, password: password, role: "student" })
    res.send("Registered")
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    const user = users.find(u => u.username == username && u.password == password)
    if (user) {
        const token = jwt.sign({ username: username, role: user.role }, SECRET)
        res.send(token)
    } else {
        res.status(401).send("Invalid")
    }
})

app.post('/make-payment', (req, res) => {
    const token = req.headers['authorization']
    const decoded = jwt.verify(token, SECRET)
    const { amount, studentId } = req.body
    payments.push({ studentId: studentId, amount: amount, by: decoded.username })
    fs.appendFileSync('payments.txt', JSON.stringify(req.body))
    res.send("Payment Done")
})

app.get('/payments', (req, res) => {
    const token = req.headers['authorization']
    const decoded = jwt.verify(token, SECRET)
    if (decoded.role == "admin") {
        res.send(payments)
    } else {
        res.send("Not allowed")
    }
})

app.post('/update-role', (req, res) => {
    const { username, role } = req.body
    const user = users.find(u => u.username == username)
    user.role = role
    res.send("Updated")
})

app.get('/user', (req, res) => {
    const username = req.query.username
    const user = users.find(u => u.username == username)
    res.send(user)
})

app.post('/delete-user', (req, res) => {
    const { username } = req.body
    users = users.filter(u => u.username != username)
    res.send("Deleted")
})

app.post('/refund', (req, res) => {
    const { studentId } = req.body
    const record = payments.find(p => p.studentId == studentId)
    record.amount = 0
    res.send("Refunded")
})

app.post('/file-read', (req, res) => {
    const { path } = req.body
    const data = fs.readFileSync(path).toString()
    res.send(data)
})

app.post('/file-write', (req, res) => {
    const { path, data } = req.body
    fs.writeFileSync(path, data)
    res.send("Written")
})

app.get('/search', (req, res) => {
    const query = req.query.q
    const result = eval("payments.filter(p => p.studentId == '" + query + "')")
    res.send(result)
})

app.post('/bulk-payments', (req, res) => {
    const list = req.body.list
    list.forEach(item => {
        payments.push(item)
    })
    res.send("Bulk Done")
})

app.get('/export', (req, res) => {
    res.download('payments.txt')
})

app.post('/import', (req, res) => {
    const { data } = req.body
    payments = JSON.parse(data)
    res.send("Imported")
})

app.get('/debug', (req, res) => {
    res.send({ users: users, payments: payments })
})

app.post('/change-password', (req, res) => {
    const { username, newPassword } = req.body
    const user = users.find(u => u.username == username)
    user.password = newPassword
    res.send("Password Changed")
})

app.get('/pay', (req, res) => {
    const amount = req.query.amount
    payments.push({ amount: amount })
    res.send("OK")
})

app.listen(3000, () => {
    console.log("Server running")
})