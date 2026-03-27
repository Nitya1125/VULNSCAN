import express from "express";
import Scan from "../models/Scan.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// SAVE SCAN
router.post("/save", protect, async (req, res) => {
  try {
    const {
      targetUrl,
      securityScore,
      critical,
      high,
      medium,
      low,
      vulnerabilities
    } = req.body;

    const newScan = await Scan.create({
      userId: req.user.id,
      targetUrl,
      securityScore,
      critical,
      high,
      medium,
      low,
      vulnerabilities
    });

    res.status(201).json(newScan);
  } catch (error) {
    console.error("Save Scan Error:", error);
    res.status(500).json({ message: "Scan save failed" });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    await scan.deleteOne();

    res.json({ message: "Scan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

router.get("/my-scans", protect, async (req, res) => {
  try {
    const scans = await Scan.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(scans);
  } catch (error) {
    console.error("Fetch Scans Error:", error);
    res.status(500).json({ message: "Failed to fetch scans" });
  }
});

export default router;