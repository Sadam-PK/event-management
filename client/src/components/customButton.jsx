export default function CustomButton({ name, onClick, icon }) {
  return (
    <button
      className={`w-20 h-8 border rounded-full`}
      onClick={onClick}
    >
      {name}
      {icon}
    </button>
  );
}
