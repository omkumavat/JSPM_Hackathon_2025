import Queue from "../Models/Queue.js";

export const getAllQueueItems = async (req, res) => {
    try {
     
      const queueItems = await Queue.find({}).populate("task");
      return res.status(200).json(queueItems);
    } catch (error) {
      console.error("Error fetching queue items:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };