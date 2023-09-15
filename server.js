const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join('/home/', 'employees.json');

app.use(express.json());

// Greeting
app.get('/greeting', (req, res) => {
  return res.status(200).send('Hello world!');
});

// Create Employee
app.post('/employee', (req, res) => {
  const { name, city } = req.body;
  if (!name || !city) {
    return res.status(400).send({ message: 'Name and city are required in the request body' });
  }

  const employeeId = uuidv4();
  const employeeData = {
    employeeId,
    name,
    city,
  };

  let employees = [];
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    employees = JSON.parse(data);
  }

  employees.push(employeeData);
  fs.writeFileSync(DATA_FILE, JSON.stringify(employees, null, 2), 'utf8');

  return res.status(201).json({ employeeId });
});

// Get Employee details by ID
app.get('/employee/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ message: 'Employee ID is required as a URL parameter' });
  }

  if (!fs.existsSync(DATA_FILE)) {
    return res.status(404).send({ message: `Employee with ID ${id} was not found` });
  }

  const data = fs.readFileSync(DATA_FILE, 'utf8');
  const employees = JSON.parse(data);
  const employee = employees.find((emp) => emp.employeeId === id);

  if (!employee) {
    return res.status(404).send({ message: `Employee with ID ${id} was not found` });
  }

  return res.status(200).json(employee);
});

// Search Employees
app.post('/employees/search', (req, res) => {
  const { fields, condition } = req.body;
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).send({ message: 'Invalid fields array in the request body' });
  }

  let employees = [];
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    employees = JSON.parse(data);
  }

  let filteredEmployees = employees;
  for (const filter of fields) {
    if (!filter.fieldName || (!filter.eq && !filter.neq)) {
      return res.status(400).send({ message: 'Invalid filter criteria in the request body' });
    }

    if (filter.eq) {
      filteredEmployees = filteredEmployees.filter((emp) => emp[filter.fieldName] === filter.eq);
    } else if (filter.neq) {
      filteredEmployees = filteredEmployees.filter((emp) => emp[filter.fieldName] !== filter.neq);
    }
  }

  if (condition === 'OR') {
    filteredEmployees = [...new Set(filteredEmployees)];
  }

  return res.status(200).json(filteredEmployees);
});

// Get all Employee details
app.get('/employees/all', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.status(200).json([]);
  }

  const data = fs.readFileSync(DATA_FILE, 'utf8');
  const employees = JSON.parse(data);

  return res.status(200).json(employees);
});

app.listen(PORT, () => {
  console.log('Server running at PORT', PORT);
});
