const TagBox = ({ tagName }) => {
  const tags = tagName
    ? task.tagName.split(",").map((tag) => tag.trim())
    : [];

  return (
    <div>
      {tags.map((tag, index) => (
        <div key={index}>{tag}</div>
      ))}
    </div>
  );
};

export default TagBox;
