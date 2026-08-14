// const dotenv = require('dotenv');
// const express = require('express');
// const mongoose = require('mongoose');
// const { HoldingsModel } = require("./model/HoldingsModel");
// const { PositionsModel } = require('./model/PositionsModel');
// const {OrdersModel} = require('./model/OrdersModel');
// const cookieParser = require("cookie-parser");
// const authRoute = require("./Routes/AuthRoute");
// dotenv.config();
// const bodyParser  =require("body-parser");
// const cors= require("cors");
// mongoose.connect(process.env.MONGO_URL,{  
// }).then(()=>{
// console.log("connected to mongodb");
// }).catch((err)=>{
//     console.error('Error connecting to MongoDB:', err); 
// })

// const app = express();

// app.use(cors({
//     origin: "https://zerodha-dashboard-chgd.onrender.com"
// }));
// app.use(bodyParser.json());


// app.get("/allHoldings",async(req,res)=>{
//   let allHoldings = await HoldingsModel.find({});
//   res.json(allHoldings);
// });

// app.get("/allPositions",async(req,res)=>{
//   let allPositions = await PositionsModel.find({});
//   res.json(allPositions);
// });

// app.post("/newOrder",async(req,res)=>{
// let newOrder =new OrdersModel({
//   name:req.body.name,
//   qty:req.body.qty,
//   price:req.body.price,
//   mode:req.body.mode,
// });
// newOrder.save();
// res.send("order saved!!");
// });

// const uploadRoute = require("./rag/routes/uploadRoute");
// app.use("/rag",uploadRoute);

// const chatRoute = require("./rag/routes/chat");
// app.use("/rag/chat", chatRoute);


// app.listen(3000,()=>{
//     console.log('Server is running on port 3000');
// })


// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
// app.use(cookieParser());

// app.use(express.json());

// app.use("/", authRoute);



const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Models
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

// Routes
const authRoute = require("./Routes/AuthRoute");
const uploadRoute = require("./rag/routes/uploadRoute");
const chatRoute = require("./rag/routes/chat");

const app = express();


// =========================
// Middleware
// =========================

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://zerodha-dashboard-chgd.onrender.com"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true
    })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());


// =========================
// MongoDB
// =========================

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });


// =========================
// Normal Routes
// =========================

app.get("/allHoldings", async (req, res) => {
    try {
        const allHoldings = await HoldingsModel.find({});
        res.json(allHoldings);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


app.get("/allPositions", async (req, res) => {
    try {
        const allPositions = await PositionsModel.find({});
        res.json(allPositions);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


app.post("/newOrder", async (req, res) => {
    try {
        const newOrder = new OrdersModel({
            name: req.body.name,
            qty: req.body.qty,
            price: req.body.price,
            mode: req.body.mode
        });

        await newOrder.save();

        res.send("order saved!!");
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// =========================
// RAG Routes
// =========================

app.use("/rag/upload", uploadRoute);

app.use("/rag/chat", chatRoute);


// =========================
// Auth
// =========================

app.use("/", authRoute);


// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Zerodha backend is running"
    });
});


// =========================
// Server
// =========================

// IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

