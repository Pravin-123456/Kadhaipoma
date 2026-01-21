import mongoose, {Schema, type Document} from "mongoose";

export interface Imessage extends Document {
    chat: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<Imessage>({
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    }
},{timestamps: true});

// indexes for faster queries

MessageSchema.index({ chat: 1, createdAt: 1});

const Message = mongoose.model<Imessage>("Message", MessageSchema);
export default Message;