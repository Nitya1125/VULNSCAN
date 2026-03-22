import express from "express";
import axios from "axios";

const router = express.Router();

const ZAP_BASE = "http://127.0.0.1:8080";
const API_KEY = "";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

router.post("/start", async (req, res) => {
  try {
    const { target } = req.body;

    if (!target) {
      return res.status(400).json({ message: "Target URL required" });
    }

    const encodedTarget = encodeURIComponent(target);

    console.log("Target:", target);

    await axios.get(
      `${ZAP_BASE}/JSON/core/action/accessUrl/?url=${encodedTarget}&followRedirects=true&apikey=${API_KEY}`,
    );

    await delay(5000);

    const spiderRes = await axios.get(
      `${ZAP_BASE}/JSON/spider/action/scan/?url=${encodedTarget}&apikey=${API_KEY}`,
    );

    const spiderId = spiderRes.data.scan;

    let spiderStatus = 0;

    while (spiderStatus < 100) {
      const s = await axios.get(
        `${ZAP_BASE}/JSON/spider/view/status/?scanId=${spiderId}&apikey=${API_KEY}`,
      );

      spiderStatus = parseInt(s.data.status);
      console.log("Spider:", spiderStatus);

      await delay(2000);
    }

    console.log("Spider finished");

    await delay(3000);

    const activeRes = await axios.get(
      `${ZAP_BASE}/JSON/ascan/action/scan/?url=${encodedTarget}&recurse=true&inScopeOnly=false&apikey=${API_KEY}`,
    );

    const activeId = activeRes.data.scan;

    let activeStatus = 0;

    while (activeStatus < 100) {
      const s = await axios.get(
        `${ZAP_BASE}/JSON/ascan/view/status/?scanId=${activeId}&apikey=${API_KEY}`,
      );

      activeStatus = parseInt(s.data.status);
      console.log("Active Scan:", activeStatus);

      await delay(5000);
    }

    console.log("Active scan finished");

    await delay(5000);

    const alertsRes = await axios.get(
      `${ZAP_BASE}/JSON/alert/view/alerts/?baseurl=${encodedTarget}&start=0&count=9999&apikey=${API_KEY}`,
    );

    const allAlerts = alertsRes?.data?.alerts || [];

    const uniqueMap = new Map();
    allAlerts.forEach((a) => {
      if (!uniqueMap.has(a.name)) {
        uniqueMap.set(a.name, a);
      }
    });

    const uniqueAlerts = Array.from(uniqueMap.values());
    const normalize = (r) => r?.toLowerCase().trim();

    const high = uniqueAlerts.filter(
      (a) => normalize(a.risk) === "high",
    ).length;
    const medium = uniqueAlerts.filter(
      (a) => normalize(a.risk) === "medium",
    ).length;
    const low = uniqueAlerts.filter((a) => normalize(a.risk) === "low").length;

    console.log("HIGH:", high);
    console.log("MEDIUM:", medium);
    console.log("LOW:", low);

    let score = 100;

    score -= high * 20;
    score -= medium * 10;
    score -= low * 5;

    if (score < 0) score = 0;

    console.log("FINAL SCORE:", score);

    res.json({
      score,
      summary: { high, medium, low },
      vulnerabilities: uniqueAlerts,
    });
  } catch (error) {
    console.log("ZAP ERROR");

    if (error.response) {
      console.log(error.response.data);
    }

    console.log(error.message);

    res.status(500).json({
      message: "Scan failed",
      error: error.message,
    });
  }
});

export default router;
