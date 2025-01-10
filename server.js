const express = require("express");
const bodyParser = require("body-parser");
const prisma = require("./prisma");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to the Prismatic Employees API.");
});

// Get All Employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving employees" });
  }
});

// Create New Employee
app.post("/employees", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const employee = await prisma.employee.create({
      data: { name },
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Error creating employee" });
  }
});

// Get Employee by ID
app.get("/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving employee" });
  }
});

// Update Employee by ID
app.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: "Error updating employee" });
  }
});

// Delete Employee by ID
app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send(); // No content to return
  } catch (error) {
    res.status(500).json({ error: "Error deleting employee" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
