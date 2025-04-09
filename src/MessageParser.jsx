// in MessageParser.js
import React from "react";
import GetCookie from "./lib/GetCookie";

const Logindata = await GetCookie();

const MessageParser = ({ children, actions }) => {
  const parse = async (message) => {
    try {
      const token = Logindata.access;
      const ExData = await MessagePass({ message, token });

      if (!ExData) {
        return actions.handleDefault();
      }

      switch (ExData.answer.method) {
        case "조회":
        case "수정":
        case "삭제":
          const ScheduleData = await SchedulePass(
            ExData,
            actions
          );
          if (ScheduleData) {
            if (ExData.answer.method === "조회") {
              console.log("조회일 때 ExData", ExData);
              actions.handleCheck({ data: ScheduleData });
            } else if (ExData.answer.method === "수정") {
              console.log("수정일 때 ExData", ExData);
              actions.handleEdit({ data: ScheduleData });
            } else if (ExData.answer.method === "삭제")
              actions.handleDelete({ data: ScheduleData });
          }
          break;
        case "등록":
          actions.handleAdd({ data: ExData });
          break;
        default:
          actions.handleDefault();
      }
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
const MessagePass = async ({ message, token }) => {
  try {
    const response = await fetch(
      "http://13.124.140.60/chatbots/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: message,
        }), // ExData를 서버로 전송
      }
    );

    const ExCheckData = await response.json();
    // 서버에서 받은 응답을 처리
    console.log("ExCheckData : ", ExCheckData);
    return ExCheckData;
  } catch (error) {
    console.error("백엔드 오류:", error);
    return null; // 오류 발생 시 null 반환
  }
};

const SchedulePass = async (ExData, actions) => {
  const token = Logindata.access;

  let queryParams = [];

  // 날짜 파라미터 처리
  if (ExData.answer.date === "unknown") {
    //throw new Error("일정을 입력 후 다시 실행해주세요.");
    return actions.handleDefault({
      message: "일정을 입력 후 다시 실행해주세요.",
    });
  } else {
    const { first, last } = SplitDate(ExData.answer.date);
    queryParams.push(`first=${first}`);
    if (last) {
      queryParams.push(`last=${last}`);
    }
  }

  // 태그 파라미터 처리
  if (ExData.answer.tag && ExData.answer.tag !== "전체") {
    const TagArr = SplitTag(ExData.answer.tag);

    // 태그가 여러 개일 경우, 첫 번째 태그만 사용 지금은 태그 하나만 사용하기 때문
    if (TagArr.length > 0) {
      console.log("TagArr[0]", TagArr[0]);
      queryParams.push(`tag=${encodeURIComponent(TagArr[0])}`);
    }
  }

  // 제목 파라미터 처리
  // 제목이 title이 없어서 details로 사용
  if (
    ExData.answer.details &&
    ExData.answer.details !== "unknown"
  ) {
    queryParams.push(
      `title=${encodeURIComponent(ExData.answer.details)}`
    );
  }

  // URL 생성
  const queryString = queryParams.join("&");
  const url = `http://13.124.140.60/schedules/list/?${queryString}`;

  console.log("URL:", queryString); // URL 확인

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // 서버 응답 메시지 확인
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const ScheduleData = await response.json();
    console.log("일정 조회 성공:", ScheduleData);

    // 조회된 일정 데이터를 반환
    return ScheduleData;
  } catch (error) {
    console.error("일정 조회 실패:", error);

    throw error; // 에러를 상위 호출로 전달
  }
};

//일정을 짜르는 함수
function SplitDate(dateStr) {
  const dates = dateStr.split("~").map((date) => date.trim());
  return {
    first: dates[0],
    last: dates.length > 1 ? dates[1] : null,
  };
}

function SplitTag(tagStr) {
  if (tagStr === "전체") {
    return [];
  } else if (tagStr.includes(",")) {
    return tagStr.split(",").map((tag) => tag.trim());
  } else {
    return [tagStr.trim()];
  }
}

export default MessageParser;

//사용자의 메세지를 받고 메세지를 분석하여 알맞은 동작을 수행한다.
//action.handleHello()는 사용자가 hello라는 단어를 입력했을 때 실행되는 함수이다.
//action.handleDefault()는 사용자가 hello라는 단어를 제외한 다른 단어를 입력했을 때 실행되는 함수이다.
//action에 대한 정보는 ActionProvider에서 받아온다.
