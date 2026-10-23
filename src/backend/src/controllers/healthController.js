import { getHealthStatus } from "../models/healthModel.js";

export function getHealth(req, res) {
  res.json(getHealthStatus());
}
