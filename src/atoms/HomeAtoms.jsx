import { atom } from "jotai";
import GetCookie from "../api/GetCookie";

//모달에 대한 ataom
export const isModalOpenAtom = atom(false);
export const modalDataAtom = atom({});

export const eventsAtoms = atom([]);

export const homeSidebarAtoms = atom(false);

export const WitchGroupAtom = atom("기본 정렬");

export const handelCheckAtom = atom(
  null,
  async (get, set, id) => {
    const todoList = get(eventsAtoms);
    const task = todoList.find((t) => t.id === id);
    if (!task) return;

    const updatedTask = {
      ...task,
      is_completed: !task.is_completed,
    };

    const newList = todoList.map((t) =>
      t.id === id ? updatedTask : t
    );
    set(eventsAtoms, newList);

    await ScheduleCompleteOrNot({ data: updatedTask });
  }
);

// handleChange 역할을 하는 atom
export const handleChangeAtom = atom(
  null,
  (get, set, { data, id }) => {
    const prevEvents = get(eventsAtoms);

    if (data === null) {
      set(
        eventsAtoms,
        prevEvents.filter((event) => event.id !== id)
      );
    } else {
      set(
        eventsAtoms,
        prevEvents.map((event) =>
          event.id === id ? { ...event, ...data } : event
        )
      );
    }
  }
);

const ScheduleCompleteOrNot = async ({ data }) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;
  const tagNames = data.tagName;

  const tags = tagNames
    ? tagNames.split(",").map((tag) => tag.trim())
    : [];
  const id = `${data.id}/`;

  try {
    const response = await fetch(
      `http://13.124.140.60/schedules/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          scheduled_date: data.date,
          tag: tags,
          deadline: data.deadline,
          is_completed: data.is_completed,
        }),
      }
    );

    const result = await response.json();
    console.log("업데이트 완료:", result);
    return result;
  } catch (error) {
    console.error("백엔드 오류:", error);
    return null;
  }
};
