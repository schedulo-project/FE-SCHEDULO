import { CalendarIcon } from "../assets/sidebar/CalendarIcon.jsx";
import { TagIcon } from "../assets/sidebar/TagIcon.jsx";
import { ClockIcon } from "../assets/sidebar/ClockIcon.jsx";
import { TimetableIcon } from "../assets/sidebar/TimetableIcon.jsx";
import { SettingIcon } from "../assets/sidebar/SettingIcon.jsx";

const iconObject = {
  calendar: {
    Icon: CalendarIcon,
    alt: "달력",
  },
  tag: {
    Icon: TagIcon,
    alt: "태그",
  },
  clock: {
    Icon: ClockIcon,
    alt: "포커스 타이머",
  },
  timetable: {
    Icon: TimetableIcon,
    alt: "시간표",
  },
  setting: {
    Icon: SettingIcon,
    alt: "설정",
  },
};

const SideBtn = ({ type, isActive, onClick }) => {
  const current = iconObject[type];
  const Icon = current.Icon;

  const baseStyle =
    "flex gap-[0.56rem] items-center py-[0.46625rem] px-[0.93256rem] w-[8.76rem] h-[2.05rem] rounded-[0.46625rem]";
  const activeStyle = isActive
    ? "bg-[#27374D] text-[#DDE6ED] font-semibold"
    : "text-[#526D82] font-semibold hover:bg-[#E0E0E0]";

  return (
    <button
      className={`${baseStyle} ${activeStyle}`}
      onClick={onClick}
    >
      <span className="w-[1.11725rem] h-[1.11725rem]">
        <Icon className="w-full h-full" />
      </span>
      <span className="text-[0.652rem]">{current.alt}</span>
    </button>
  );
};

export default SideBtn;
