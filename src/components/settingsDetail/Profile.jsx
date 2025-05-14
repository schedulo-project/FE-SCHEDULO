import { Link, Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="pt-5 flex flex-col gap-5">
      <section>
        <h1 className="font-semibold font-['Inter'] text-xs ">
          개인정보 수정
        </h1>
        <hr />
        <Link to="password">비밀번호 변경</Link>
      </section>
    </div>
  );
};
export default Profile;
