export default function CustomButton({ name, onClick }) {
  return (
    <button
      className={`w-20 h-8 rounded bg-emerald-400`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
