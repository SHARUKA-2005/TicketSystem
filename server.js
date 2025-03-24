const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // For generating ticket IDs
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Configure AWS DynamoDB
AWS.config.update({
  region: "us-east-1", // Change this to your AWS region
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Tickets";

// Book a Ticket
app.post("/book", async (req, res) => {
  const { name, email, seatNumber } = req.body;
  const ticketId = uuidv4(); // Generate a unique ticket ID

  const params = {
    TableName: TABLE_NAME,
    Item: { ticketId, name, email, seatNumber },
  };

  try {
    await dynamoDB.put(params).promise();
    res.send({ message: "Ticket booked successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get All Tickets
app.get("/tickets", async (req, res) => {
  const params = { TableName: TABLE_NAME };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
