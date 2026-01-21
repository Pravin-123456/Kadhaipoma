import mongoose, { Schema } from "mongoose";

export interface IChat {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId | null;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;