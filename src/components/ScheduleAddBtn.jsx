import img from "../assets/src/plus_btn.svg";

const ScheduleAddBtn = () => {
  return (
    <button className="flex flex-col justify-center items-center">
      <img className="w-[0.8125rem] h-[0.76469rem]" src={img} />
      <span
        className="text-[#ABABAB] text-[0.25rem] font-normal
        font-[Inter] text-center"
      >
        추가하기
      </span>
    </button>
  );
};
export default ScheduleAddBtn;
