import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { ApiKey } from "./ApiKey";

// Middleware to authenticate API requests
export async function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  // Extract the API key and user ID from the request headers
  const userId = req.headers.userid?.toString()!;
  const apiKey = req.headers.apikey?.toString();

  // Get the API key repository
  const apiKeyRepository = getRepository(ApiKey);

  // Find the API key in the database
  const apiKeyEntity = await apiKeyRepository.findOne({ where: {userid: userId } });

  // If the API key is not found or does not belong to the user, reject the request
  if (apiKeyEntity?.key !== apiKey) {
    res.status(401).json({ error: 'Invalid API key or user ID. Use /registerapi to get an api key' });
    return;
  }

  // If the API key is valid, allow the request to proceed
  next();
}