export default function CustomButton({ name, onClick }) {
  return (
    <button
      className={`w-20 h-8 rounded bg-emerald-400 hover:border-emerald-400 
        hover:border-2 hover:text-emerald-700 hover:bg-white`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
