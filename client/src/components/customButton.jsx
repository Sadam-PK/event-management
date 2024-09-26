export default function CustomButton({
  name,
  onClick,
  icon,
  disabled,
  className,
}) {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {name}
      {icon}
    </button>
  );
}
