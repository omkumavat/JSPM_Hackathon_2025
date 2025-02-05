import bcrypt from 'bcryptjs';
import Worker from '../models/Worker.js';
import jwt from 'jsonwebtoken';
import Admin from '../Models/Admin.js';

export const signUpWorker = async (req, res) => {
    try {
        // Get data from the request body
        const { name, email, password } = req.body;

        // Check if worker already exists
        const existingWorker = await Worker.findOne({ email });

        if (existingWorker) {
            return res.status(400).json({
                success: false,
                message: "Worker with this email already exists",
            });
        }

        // Hash the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            });
        }

        // Create a new worker
        const newWorker = new Worker({
            name,
            email,
            password: hashedPassword,
            status: 'available',
            currentTask: null,
            lastNotifiedAt: null,
            completedTask: []
        });

        // Save the new worker to the database
        await newWorker.save();

        // Now find the admin and push the worker's ID into the workers array
        const admin = await Admin.findOne({ email: 'abc@gmail.com' }); // Replace with your admin's email or other criteria

        if (admin) {
            admin.workers.push(newWorker._id);  // Add the worker's ID to the workers array of the admin
            await admin.save();  // Save the updated admin document
        } else {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Worker created successfully and added to admin's workers list",
            data: newWorker
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Worker cannot be registered. Please try again later.",
        });
    }
};

export const loginWorker = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        // Check if worker exists
        let worker = await Worker.findOne({ email });
        if (!worker) {
            return res.status(401).json({
                success: false,
                message: "Worker does not exist",
            });
        }

        // Verify password & generate a JWT token
        const payload = {
            email: worker.email,
            id: worker._id,
            status: worker.status, // Worker status could be useful in the payload
        };

        if (await bcrypt.compare(password, worker.password)) {
            // Password matches
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h", // You can change the expiration time as needed
            });

            worker = worker.toObject();
            worker.token = token;
            worker.password = undefined; // Do not send password in response

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie expiration
                httpOnly: true, // Cookie is only accessible via HTTP (not JavaScript)
            };

            // Send token in a cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                worker,
                message: "Worker logged in successfully",
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Password does not match",
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again later",
        });
    }
};

export const setWorkerStatusOffline = async (req, res) => {
    try {
        const { workerId } = req.params;

        // Find the worker by ID
        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: 'Worker not found',
            });
        }

        // Update the worker's status to 'offline'
        worker.status = 'offline';

        // Save the updated worker document
        await worker.save();

        return res.status(200).json({
            success: true,
            message: 'Worker status updated to offline',
            worker,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error updating worker status',
        });
    }
};
