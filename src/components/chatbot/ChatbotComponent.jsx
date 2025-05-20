import React from "react";
import { Chatbot } from "react-chatbot-kit";
import config from "../chatbot/config";
import MessageParser from "../chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";
import "react-chatbot-kit/build/main.css";
import "./ChatbotComponent.css";

const ChatbotComponent = () => {
  return (
    <div className="chatbot-container">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        headerText={`일정 관리 챗봇`}
        placeholderText={`Chat BOT에게 질문하기`}
      />
    </div>
  );
};

export default ChatbotComponent;
