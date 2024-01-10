interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
      >
        按钮
      </button>
    </>
  );
};

export default Button;
