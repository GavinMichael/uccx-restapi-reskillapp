const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

app.get('/', (req, res) => {
    res.send('home')
})

app.listen(port, () => {
    console.log(`Reskill app started on http://localhost:${port}`)
})

// CORS
app.use(cors());

// Routes
app.use('/api', require('./routes/api.js'));
