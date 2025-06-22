import TagItem from "../components/TagItem";

const Tag = () => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <TagItem />
        <TagItem />
        <TagItem />
        <TagItem />
        <TagItem />
      </div>
    </div>
  );
};

export default Tag;
