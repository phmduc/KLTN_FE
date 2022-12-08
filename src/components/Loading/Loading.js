import "./Loading.css";
function Loading() {
  return (
    <div className="bg-load">
      <span>Vui Lòng Đợi</span>
      <div className="loading">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loading;
