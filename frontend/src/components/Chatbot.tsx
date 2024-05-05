  // @ts-nocheck

import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ModalWindow from "./ModalWindow";
import { useUserContext } from "@/context/User";

const styles = {
  chatWidget: {
    // Position
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#3f51b5",
    // Padding
    paddingLeft: "18px",
    paddingRight: "18px",
    paddingTop: "7px",
    paddingBottom: "7px",
    // Border
    borderRadius: "10px",
    cursor: "pointer",
  },

  chatWidgetText: {
    color: "white",
    fontSize: "15px",
    marginLeft: "5px",
  },
};
function Chatbot() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const widgetRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [widgetRef]);
  const { user } = useUserContext();
  if (!user) {
    return null;
  }
  return (
    <div ref={widgetRef}>
      <ModalWindow visible={visible} setVisible={setVisible} />

      {/* Chat Button Component */}
      <div
        onClick={() => setVisible(!visible)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...styles.chatWidget,
          ...{ border: hovered ? "1px solid black" : "" },
          position: "fixed",
        }}
      >
        {/* Inner Container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Button Text */}
          <MessageSquare size={20} color="white" />
          <span style={styles.chatWidgetText}>Chat Now!!</span>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
