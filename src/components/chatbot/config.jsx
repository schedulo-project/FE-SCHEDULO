import { createChatBotMessage } from "react-chatbot-kit";
import HtmlWidget from "../../widgets/HtmlWidget";
import LoadingWidget from "../../widgets/LoadingWidget";
import chatbotlogo from "../../assets/logo/onesung1.png";

const botName = "Dulo";

const config = {
  initialMessages: [
    createChatBotMessage("안녕하세요 Dulo입니다! 😊"),
  ],
  botName: botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    // 봇에 대한 스타일링
    chatButton: {
      backgroundColor: "#5ccc9d",
    },
    // 채팅 버튼에 대한 스타일링
  },
  customComponents: {
    botAvatar: (props) => (
      <div {...props} style={{ marginRight: "12px" }}>
        <img
          src={chatbotlogo}
          alt="bot avatar"
          style={{
            objectFit: "cover",
            width: "105px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid #27374d",
          }}
        />
      </div>
    ),
    // 봇 아바타 커스텀 컴포넌트
  },
  widgets: [
    {
      widgetName: "htmlWidget",
      widgetFunc: (props) => <HtmlWidget {...props} />,
    },
    {
      widgetName: "loadingWidget",
      widgetFunc: (props) => <LoadingWidget {...props} />,
    },
  ],
};

export default config;
