import React, { useEffect, useRef, useState } from "react";
import { request } from "@/lib/Request";
import ChatBubble from "./ChatBubble";
import { Button } from "./ui/button";
import { BASE_API_URL } from "@/lib/Constants";
import { useUserContext } from "@/context/User";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "./ui/dialog";
import { DialogHeader } from "./ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";

// Styling for modal window
const styles = {
  modalWindow: {
    // Position
    bottom: "70px",
    right: "20px",
    // Size
    width: "370px",
    padding: "16px",
    height: "65vh",
    maxWidth: "calc(100% - 48px)",
    maxHeight: "calc(100% - 48px)",
    // Border
    borderRadius: "12px",
    border: `2px solid ${"#3f51b5"}`,
    overflow: "hidden",
    // Shadow
    boxShadow: "0px 0px 16px 6px rgba(0, 0, 0, 0.33)",
  },
};

function ModalWindow(props) {
  const { user } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dialog, setDialogVisible] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [filterRestaurant, setFilterRestaurant] = useState([]);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const buttons = [
    {
      text: "Hello",
      action: "hello",
    },
    {
      text: "Get Restaurants",
      action: "get_all_restaurants",
    },

    {
      text: "Bye",
      action: "bye",
    },
  ];

  const sendMessage = async (messagep, role, action) => {
    // Append user's message to the messages state
    const newUserMessage = { message: messagep, user: role };
    setMessages([...messages, newUserMessage]);

    // Send message to the backend
    const response = await request({
      method: "POST",
      url: "chats",
      data: {
        message: messagep,
        url:
          BASE_API_URL +
          `lat=${user?.latitude}&lng=${user?.longitude}&page_type=DESKTOP_WEB_LISTING`,
        action: action,
      },
      headers: { "Content-Type": "application/json" },
    }).catch((error) => {
      console.error("Error sending message:", error);
    });

    // Update messages state with chatbot's response
    if (response && response.data) {
      if (response.data.message) {
        const newBotMessage = { message: response.data.message, user: "bot" };
        console.log("Restaurant : ", response.data);
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      }
      if (response.data.length >= 2) {
        console.log(response.data);
        setRestaurants(response.data);
        for (let i = 0; i < 5; i++) {
          const newBotMessage = {
            message: response.data[i].name + ", " + response.data[i].locality,
          };
          console.log(response.data[i].id);
          setMessages((prevMessages) => [...prevMessages, newBotMessage]);
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: response.data.locality,
            user: "bot",
          },
        ]);
      }
    }
  };

  const handleUserMessage = (message, action) => {
    if (action === "get_restaurant") {
      setDialogVisible(true);

      return;
    }
    const newMessages = [...messages, { message, user: "user" }];
    if (action !== "get_restaurant") {
      setMessages(newMessages);
      sendMessage(message, "user", action);
    }
  };

  const sendRestaurant = async (restaurant) => {
    const newMessages = [...messages, { message: restaurant, user: "user" }];
    setMessages(newMessages);
    sendMessage(restaurant, "user", "get_restaurant");
  };

  console.log(messages);
  return (
    <div
      style={{
        ...styles.modalWindow,
        opacity: props.visible ? "1" : "0",
      }}
      className={cn(
        "bg-slate-800 text-white ease-in transition-all fixed flex ",
        props.visible ? "flex" : "hidden"
      )}
    >
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <h1 className="text-xl font-bold">Chatbot</h1>
          <button
            className="p-2 rounded-md cursor-pointer"
            onClick={() => props.setVisible(false)}
          >
            X
          </button>
        </div>
        <ScrollArea
          className="py-5 px-2 flex-1"
          onAnimationStart={
            // Scroll to the bottom of the chat window
            (e) => {
              const chatWindow = document.getElementById("chat-window");
              chatWindow.scrollTop = chatWindow.scrollHeight;
            }
          }
          ref={messagesEndRef}
        >
          <div className="flex-1 flex flex-col space-y-2 mt-2" id="chat-window">
            <ChatBubble message={"Hello"} user={"bot"} />

            {messages.map((chat, index) => (
              <ChatBubble key={index} message={chat.message} user={chat.user} />
            ))}
          </div>
        </ScrollArea>
        <div className="flex space-x-2 flex-wrap ">
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={() => {
                handleUserMessage(button.text, button.action);
              }}
              className="bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-400 m-2"
            >
              {button.text}
            </Button>
          ))}
          {restaurants.length > 0 && (
            <Button
              onClick={() => {
                handleUserMessage("Get Restaurant", "get_restaurant");
              }}
              className="bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-400 m-2"
            >
              Get Restaurant
            </Button>
          )}
          <Dialog open={dialog} onOpenChange={setDialogVisible}>
            <DialogTrigger asChild>Open</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <Command>
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      {restaurants.map((restaurant, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => {
                            sendRestaurant(restaurant.name),
                              setDialogVisible(false);
                          }}
                        >
                          {restaurant.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </CommandList>
                </Command>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default ModalWindow;
