import { createChatBotMessage } from "react-chatbot-kit";
import HtmlWidget from "../../widgets/HtmlWidget";
import LoadingWidget from "../../widgets/LoadingWidget";
import chatbotlogo from "../../assets/logo/sasum.png";

const botName = "Dulo";

const config = {
  initialMessages: [
    createChatBotMessage("안녕하세요 Dulo입니다! 😊"),
  ],
  botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: "#F5F7FA", // 밝은 톤으로 맞춤
      borderRadius: "12px",
      color: "#000",
    },
    chatButton: {
      backgroundColor: "#5ccc9d",
      borderRadius: "50%",
      width: "48px",
      height: "48px",
    },
  },
  customComponents: {
    botAvatar: (props) => (
      <div {...props} style={{ marginRight: "12px" }}>
        <img
          src={chatbotlogo}
          alt="bot avatar"
          style={{
            objectFit: "cover",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px solid #27374d",
          }}
        />
      </div>
    ),
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
