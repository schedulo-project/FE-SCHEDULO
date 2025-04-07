const TagBox = ({ tagNames, size }) => {
  const tags = tagNames
    ? tagNames.split(",").map((tag) => tag.trim())
    : [];

  return (
    <div className="flex gap-[0.44rem] ">
      {tags.map((tag, index) => (
        <div
          className={`rounded-[0.625rem]  text-[#656565] bg-yellow-300 ${size}`}
          key={index}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default TagBox;
