import calendarIcon from "../assets/src/calendar_btn.svg";
import tagIcon from "../assets/src/tag_btn.svg";
import clockIcon from "../assets/src/clock_btn.svg";
import settingIcon from "../assets/src/setting_btn.svg";
import timetableIcon from "../assets/src/timetable_btn.svg";

const imgObject = {
  calendar: {
    src: calendarIcon,
    alt: "달력",
  },
  tag: {
    src: tagIcon,
    alt: "태그",
  },
  clock: {
    src: clockIcon,
    alt: "포커스 타이머",
  },
  setting: {
    src: settingIcon,
    alt: "설정",
  },
  timetable: {
    src: timetableIcon,
    alt: "시간표",
  },
};

const SideBtn = ({ type, isActive, onClick }) => {
  const current = imgObject[type];

  const baseStyle =
    "flex gap-[0.56rem] items-center py-[0.46625rem] px-[0.93256rem] rounded-[0.46625rem] w-full";
  const activeStyle = isActive
    ? "bg-[#010669] text-[#CBDCEB] font-semibold"
    : "text-[#8E92BC] hover:bg-[#E0E0E0]";

  return (
    <button
      className={`${baseStyle} ${activeStyle}`}
      onClick={onClick}
    >
      <img
        src={current.src}
        alt={current.alt}
        className="w-[1.11725rem] h-[1.11725rem]"
      />
      <span className="text-[0.65275rem]">{current.alt}</span>
    </button>
  );
};

export default SideBtn;
