function PasswordChange() {
  return (
    <div className="w-full bg-white p-5 rounded-lg shadow-md">
      <h3>비밀번호 변경</h3>
      <input type="password" placeholder="현재 비밀번호" />
      <input type="password" placeholder="새 비밀번호" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        변경
      </button>
    </div>
  );
}

export default PasswordChange;
