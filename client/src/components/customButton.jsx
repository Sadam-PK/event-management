export default function CustomButton({ name, onClick, icon, disabled }) {
  return (
    <button
      className={`w-20 h-8 border border-gray-400 rounded-full hover:border-black 
        cursor-pointer hover:text-black`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
      {icon}
    </button>
  );
}
