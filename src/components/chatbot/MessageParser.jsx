import React from "react";
import baseAxiosInstance from "../../api/baseAxiosApi";

const MessageParser = ({ children, actions }) => {
  const parse = async (message) => {
    try {
      actions.handleLoading();
      const res = await MessagePass({ message });

      const resChat = getMessage({ data: res });
      actions.handleRemoveLoading();

      actions.handleChat({
        chat: resChat,
        data: res,
      });
    } catch (error) {
      console.error("메시지 처리 오류:", error);
      actions.handleDefault();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

// 사용자 메세지를 백에 보낸 후 받는 응답
const MessagePass = async ({ message }) => {
  const response = await baseAxiosInstance.post("/chatbots/", {
    query: message,
  });

  return response.data;
};

const getMessage = ({ data }) => {
  return data.messages[0][0][1];
};

export default MessageParser;
