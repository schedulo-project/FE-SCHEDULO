// in config.js
import { createChatBotMessage } from "react-chatbot-kit";
import AddWidget from "../../widgets/AddWidget";
import CheckWidget from "../../widgets/CheckWidget";
import EditWidget from "../../widgets/EditWidget";
import DeleteWidget from "../../widgets/DeleteWidget";

const botName = "ExcitementBot";

const config = {
  initialMessages: [createChatBotMessage(`Hi! I'm ${botName}`)],
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
  widgets: [
    {
      widgetName: "checkWidget",
      widgetFunc: (props) => <CheckWidget {...props} />,
      // CheckWidget 불러온다.
    },
    {
      widgetName: "editWidget",
      widgetFunc: (props) => <EditWidget {...props} />,
    },
    {
      widgetName: "deleteWidget",
      widgetFunc: (props) => <DeleteWidget {...props} />,
      // TestWidget을 불러온다.
    },
    {
      widgetName: "addWidget",
      widgetFunc: (props) => <AddWidget {...props} />,
      // TestWidget을 불러온다.
    },
  ],
};

export default config;
