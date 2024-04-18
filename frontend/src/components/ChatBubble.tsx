import { cn } from "@/lib/utils";
import React from "react";

const styles = {
  chatBubble: {
    // Positioning
    display: "flex",
    flexDirection: "column",
    padding: "8px",
    margin: "4px",

    // Styling
    borderRadius: "8px",
    // backgroundColor: "#3f51b5",
    color: "white",
    maxWidth: "70%", // Max width of the bubble
  },
};

const ChatBubble = ({ message, user }: { message: string; user: string }) => {
  return (
    <div
      style={styles.chatBubble}
      className={cn(
        user === "user" ? "self-end bg-slate-600" : "self-start bg-slate-500"
      )}
    >
      {message}
    </div>
  );
};

export default ChatBubble;
