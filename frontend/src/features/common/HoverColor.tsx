const HoverColor = ({
  children,
  hover,
  onEnter,
  onLeave,
  name,
}: {
  children: React.ReactNode;
  hover: boolean;
  onEnter: () => void;
  onLeave: () => void;
  name: string;
}) => {
  return (
    <div className="tooltip" data-tip={name}>
      <p
        className={`hover:text-error font-['Computer_Modern'] ${
          hover && "text-error"
        }`}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        data-tip={name}
      >
        {children}
      </p>
    </div>
  );
};

export default HoverColor;
