import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import connectDB from "./Database/database.js";
import cors from 'cors';
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import AdminRoute from "./Routes/AdminRoute.js"

const app = express();
app.use(bodyParser.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
connectDB();
app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowing these methods
  allowedHeaders: ['Content-Type'], // Allow these headers
}));

import EmailRoute from './Routes/EmailRoute.js';
app.use('/server/email',EmailRoute)
app.use('/server/admin',AdminRoute)

import WorkerRoute from './Routes/WorkerRoute.js';
app.use('/server/worker',WorkerRoute)

import TaskRoute from './Routes/TaskRoute.js';
app.use('/server/task',TaskRoute)

app.get('/', (req, res) => {
  res.send('Hello World')
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.get("/s", (req, res) => {
  res.render("SignupSuccess", { name: "OM"});
});

const PORT = process.env.port;
app.listen(PORT, () => {
   console.log("app is listening on port 4000");
});
