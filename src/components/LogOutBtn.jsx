const LogOutBtn = () => {
  const handleClick = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-center items-center mt-15">
      <button
        onClick={handleClick}
        className="border-none text-sm text-gray-500 underline"
      >
        로그아웃
      </button>
    </div>
  );
};

export default LogOutBtn;
