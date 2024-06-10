import { Entity, PrimaryGeneratedColumn, Column, getRepository } from "typeorm";
import * as crypto from "crypto";

@Entity({ name: "apikey" })
export class ApiKey {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ type: "text", name: "key" })
  key: string;

  @Column({ type: "text", name: "userid" })
  userid: string;

  constructor(data?: Partial<ApiKeyData>) {
    if (data) {
      this.key = data.key!;
      this.userid = data.userid!;
    }
  }

  public static async generateAndSave(userid: string): Promise<ApiKey> {
    const apiKeyRepository = getRepository(ApiKey);

    // Delete any existing API key for the user
    await apiKeyRepository.delete({ userid: userid });

    // Generate a new API key
    const key = crypto.randomBytes(20).toString('hex');

    // Save the new API key
    return await apiKeyRepository.save(new ApiKey({ key, userid: userid }));
  }
}

export interface ApiKeyData {
  id: number;
  key: string;
  userid: string;
}