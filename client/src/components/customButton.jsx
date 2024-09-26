export default function CustomButton({
  name,
  onClick,
  icon,
  disabled,
  className,
  type
}) {
  return (
    <button className={className} onClick={onClick} disabled={disabled} type={type}>
      {name}
      {icon}
    </button>
  );
}
