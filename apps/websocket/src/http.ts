import { Express } from "express";
import { copyS3Folder } from "./awt";
import express from "express";

export function initHttp(app: Express) {
  app.use(express.json());

  app.post("/project", async (req, res) => {
    const { roomId, language } = req.body;

    if (!roomId) {
      res.status(400).send("Bad request");
      return;
    }

    await copyS3Folder(`base/${language}`, `code/${roomId}`);

    res.send("Project created");
  });
}
