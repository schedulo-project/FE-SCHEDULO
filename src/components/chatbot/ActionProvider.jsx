import React from "react";

const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
}) => {
  // 데이터 부족 시
  const handleDefault = () => {
    const botMessage = createChatBotMessage(
      "질문에 데이터가 부족합니다. 다시 입력해주세요."
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  // HTML 위젯 응답 (payload를 사용하도록 수정)
  const handleChat = ({ chat, data }) => {
    const botMessage = createChatBotMessage(`${chat}`, {
      widget: "htmlWidget",
      payload: { htmlContent: data }, // widgetProps 대신 payload 사용
    });

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  // 로딩 시작
  const handleLoading = () => {
    const botMessage = createChatBotMessage(
      "잠시만 기다려주세요...",
      {
        widget: "loadingWidget",
        id: "loading",
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  // 로딩 제거
  const handleRemoveLoading = () => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.filter(
        (msg) => msg.id !== "loading"
      ),
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          actions: {
            handleDefault,
            handleLoading,
            handleRemoveLoading,
            handleChat,
          },
        })
      )}
    </div>
  );
};

export default ActionProvider;
