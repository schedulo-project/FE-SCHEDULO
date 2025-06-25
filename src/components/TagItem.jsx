const TagItem = ({ key, eventsList }) => {
  return (
    <div className="w-[16rem] h-[24rem] bg-[#F0F0F0] shadow-[0px_3.759999990463257px_3.759999990463257px_0px_rgba(0,0,0,0.25)] border-[0.47px] border-stone-500 rounded-2xl p-8">
      <section className="flex justify-between items-center">
        <div>{eventsList.tag}</div>
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </section>
      <div class="mt-4 flex-grow h-[0.04619rem] bg-[#ABABAB] max-w-[9.33019rem] mx-[0.44rem]"></div>
      <section className="flex flex-col items-start gap-2 mt-4 overflow-y-scroll h-[16rem]">
        {eventsList.task.map((event) => (
          <div id={event.id}>{event.title}</div>
        ))}
      </section>
    </div>
  );
};
export default TagItem;
