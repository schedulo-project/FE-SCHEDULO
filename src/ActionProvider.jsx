import React from "react";

const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
}) => {
  //데이터가 부족할 시 나오는 메세지
  const handleDefault = () => {
    const botMessage = createChatBotMessage(
      "질문에 데이터가 부족합니다. 다시 입력해주세요."
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  //조회된 일정을 보여주는 메세지
  const handleCheck = ({ data }) => {
    const botMessage = createChatBotMessage(
      "조회된 일정은 다음과 같습니다.",
      {
        widget: "checkWidget",
        widgetProps: {
          scheduleData: data, // 데이터를 위젯에 넘긴다
        },
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  //일정 추가를 시작하는 메세지
  const handleAdd = ({ data }) => {
    console.log("handleAdd data", data);
    console.log("handleAdd data.answer", data.answer);
    const botMessage = createChatBotMessage(
      `${data.answer.date}에 "${data.answer.details}" 일정 ${data.answer.method}하시겠습니까?`,
      {
        widget: "addWidget",
        widgetProps: {
          scheduleData: data.answer, // 데이터를 위젯에 넘긴다
        },
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  //일정 추가 경우에 따른 코드
  const handleAddRequest = () => {
    const botMessage = createChatBotMessage("일정이 추가되었습니다.");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleCancel = () => {
    const botMessage = createChatBotMessage("취소 되었습니다..");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleDeleteRequest = () => {
    const botMessage = createChatBotMessage("일정이 삭제되었습니다.");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleError = () => {
    const botMessage = createChatBotMessage(
      "실패했습니다. 다시 시도해주세요."
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  //일정 수정에 대한 코드
  const handleEdit = ({ data }) => {
    // console.log("action", data.schedules);
    const botMessage = createChatBotMessage(
      `수정할 일정을 선택해주세요`,
      {
        widget: "editWidget",
        widgetProps: {
          scheduleData: data.schedules, // 데이터를 위젯에 넘긴다
        },
      }
    );
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  //일정 삭제에 대한 코드
  const handleDelete = ({ data }) => {
    const botMessage = createChatBotMessage(
      "삭제할 일정을 선택해주세요.(복수 선택 가능)",
      {
        widget: "deleteWidget",
        widgetProps: {
          scheduleData: data.schedules, // 데이터를 위젯에 넘긴다
        },
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  //데이터 로딩중
  const handleLoading = () => {
    const botMessage =
      createChatBotMessage("데이터를 로딩 중입니다.");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleCheck,
            handleAdd,
            handleAddRequest,
            handleCancel,
            handleDelete,
            handleDefault,
            handleEdit,
            handleLoading,
            handleDeleteRequest,
            handleError,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
