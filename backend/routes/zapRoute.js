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

    // STEP 1: Access URL
    await axios.get(
      `${ZAP_BASE}/JSON/core/action/accessUrl/?url=${encodedTarget}&followRedirects=true&apikey=${API_KEY}`
    );

    await delay(5000);

    // STEP 2: Spider Scan
    const spiderRes = await axios.get(
      `${ZAP_BASE}/JSON/spider/action/scan/?url=${encodedTarget}&apikey=${API_KEY}`
    );

    const spiderId = spiderRes.data.scan;
    let spiderStatus = 0;

    while (spiderStatus < 100) {
      const s = await axios.get(
        `${ZAP_BASE}/JSON/spider/view/status/?scanId=${spiderId}&apikey=${API_KEY}`
      );

      spiderStatus = parseInt(s.data.status);
      console.log("Spider:", spiderStatus);

      await delay(2000);
    }

    console.log("Spider finished");

    await delay(3000);

    // STEP 3: Active Scan
    const activeRes = await axios.get(
      `${ZAP_BASE}/JSON/ascan/action/scan/?url=${encodedTarget}&recurse=true&inScopeOnly=false&apikey=${API_KEY}`
    );

    const activeId = activeRes.data.scan;
    let activeStatus = 0;

    while (activeStatus < 100) {
      const s = await axios.get(
        `${ZAP_BASE}/JSON/ascan/view/status/?scanId=${activeId}&apikey=${API_KEY}`
      );

      activeStatus = parseInt(s.data.status);
      console.log("Active Scan:", activeStatus);

      await delay(5000);
    }

    console.log("Active scan finished");

    await delay(5000);

    // STEP 4: Get Alerts
    const alertsRes = await axios.get(
      `${ZAP_BASE}/JSON/alert/view/alerts/?baseurl=${encodedTarget}&start=0&count=9999&apikey=${API_KEY}`
    );

    const allAlerts = alertsRes?.data?.alerts || [];

    console.log("TOTAL ALERTS:", allAlerts.length);

    // ✅ REMOVE DUPLICATES
    const uniqueMap = new Map();

    allAlerts.forEach((a) => {
      const key = a.name + a.risk;

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, a);
      }
    });

    const uniqueAlerts = Array.from(uniqueMap.values());

    console.log("UNIQUE ALERTS:", uniqueAlerts.length);

    // ✅ COUNT RISKS
    let high = 0;
    let medium = 0;
    let low = 0;
    let critical = 0;

    uniqueAlerts.forEach((a) => {
      const risk = a.risk?.toString().toLowerCase().trim();

      if (risk === "high" || risk === "3") high++;
      else if (risk === "medium" || risk === "2") medium++;
      else if (risk === "low" || risk === "1") low++;
      else if (risk === "critical" || risk === "4") critical++;
    });

    console.log("CRITICAL:", critical);
    console.log("HIGH:", high);
    console.log("MEDIUM:", medium);
    console.log("LOW:", low);

    // ✅ SCORE CALCULATION
    let score = Math.max(
      0,
      100 - (critical * 25 + high * 18 + medium * 10 + low * 5)
    );

    console.log("FINAL SCORE:", score);

    // ✅ FINAL RESPONSE (CORRECT)
    res.json({
      score,
      summary: { critical, high, medium, low },
      vulnerabilities: uniqueAlerts.map((a) => ({
        name: a.name,
        risk: a.risk,
        url: a.url,
        description: a.description || "No description",
      })),
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