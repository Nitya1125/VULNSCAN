import express from "express";
import User from "../models/User.js";
import Scan from "../models/Scan.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const data = await Promise.all(
      users.map(async (user) => {
        const scanCount = await Scan.countDocuments({
          userId: user._id,
        });

        return {
          ...user._doc,
          scanCount,
        };
      }),
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
    });
  }
});

export default router;
