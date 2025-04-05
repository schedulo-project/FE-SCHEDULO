const TagBox = ({ tagNames }) => {
  const tags = tagNames
    ? tagNames.split(",").map((tag) => tag.trim())
    : [];

  console.log("tagNames", tagNames);
  console.log(tags);
  return (
    <div className="flex gap-[0.44rem] ">
      {tags.map((tag, index) => (
        <div
          className="min-w-[2rem] pr-[0.75rem] pl-[0.75rem] rounded-[0.625rem] text-[0.375rem] text-[#656565] bg-yellow-300"
          key={index}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default TagBox;
