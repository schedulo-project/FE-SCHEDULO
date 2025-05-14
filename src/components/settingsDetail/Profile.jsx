import { Link, Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="pt-5 flex flex-col gap-5">
      <section>
        <h1 className="font-semibold font-['Inter'] text-s ">
          개인정보 수정
        </h1>
        <hr className="w-[40%] bg-black mt-2 mb-2" />
        <Link
          to="password"
          className="text-xs font-normal font-['Inter'] "
        >
          비밀번호 변경
        </Link>
      </section>
    </div>
  );
};
export default Profile;
