const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

// Greeting 
app.get('/greeting', (req, res) => {
    return res.send('Hello world!');
});

// Register Employee
app.post('/employee', (req, res) => {
    return res.send();
});

// Get Employee details
app.get('/employee/:id', (req, res) => {
    return res.send();
});

// Get all Employee details
app.get('/employees/all', (req, res) => {
    return res.send();
});


app.post('/employees/search', (req, res) => {
    return res.send();
});

app.listen(PORT, () => {
    console.log("Server running at PORT", PORT);
});