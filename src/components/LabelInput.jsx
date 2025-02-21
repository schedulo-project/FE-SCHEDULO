import "../styles/LabelInput.css";

function LabelInput({ label, type, value, onChange }) {
  return (
    <div className="label_input">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
}

export default LabelInput;
