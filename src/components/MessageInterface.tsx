// src/interfaces/Message.ts

import { Document } from 'mongoose';

export interface MessageInterface extends Document {
  content: string;
  createdAt: Date;
}
