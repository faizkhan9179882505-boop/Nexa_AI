import express from "express";
import Thread from "../models/Thread.js";
const router = express.Router();
import getGemini from "../utils/getGemini.js";
import auth from "../middleware/auth.js";


//test
router.post("/test", auth, async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc123",
            title: "Testing New Thread2",
            user: req.user._id
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get all threads
router.get("/thread", auth, async(req, res) => {
    try {
        const threads = await Thread.find({user: req.user._id}).sort({updatedAt: -1});
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", auth, async(req, res) => {
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId, user: req.user._id});

        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});


router.delete("/thread/:threadId", auth, async (req, res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId, user: req.user._id});

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({success : "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", auth, async (req, res) => {
  try {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
      return res.status(400).json({ error: "missing required fields" });
    }

    let thread = await Thread.findOne({ threadId, user: req.user._id });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
        user: req.user._id
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // ✅ Gemini call
    const reply = await getGemini(message);

    // ✅ bot reply bhi save kar
    thread.messages.push({ role: "assistant", content: reply });

    // ✅ save in DB
    await thread.save();

    // ✅ single response
    return res.json({
      success: true,
      reply,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

export default router;