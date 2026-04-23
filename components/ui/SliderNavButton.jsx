"use client";

import { cn } from "@/lib/utils";

const SliderNavButton = ({
  buttonRef,
  onClick,
  disabled = false,
  ariaLabel,
  className,
  style,
  children,
  showFill = true,
  fillClassName = "bg-textWhite",
  iconClassName = "relative z-10",
  enabledClassName = "",
  disabledClassName = "opacity-40 !cursor-auto",
}) => {
  const playPressAnimation = (target) => {
    if (!target?.animate) {
      return;
    }

    target.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.975)", offset: 0.45 },
        { transform: "scale(1)" },
      ],
      {
        duration: 260,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "none",
      },
    );
  };

  const handlePointerDown = (event) => {
    if (disabled) {
      return;
    }

    playPressAnimation(event.currentTarget);
  };

  const handleClick = (event) => {
    // Keyboard click doesn't fire pointer events, so animate here for accessibility.
    if (event.detail === 0 && !disabled) {
      playPressAnimation(event.currentTarget);
    }

    if (typeof onClick === "function") {
      onClick(event);
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={cn(
        "relative group p-2.5 border rounded-full md:transition-all md:duration-500 md:ease-[var(--ease-in-out)]",
        disabled ? disabledClassName : enabledClassName,
        className,
      )}
      style={style}
      aria-label={ariaLabel}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {showFill ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 rounded-full transform scale-0 md:transition-all md:duration-500 md:ease-[var(--ease-in-out)]",
            fillClassName,
            !disabled &&
              "md:group-hover:scale-100 md:group-hover:duration-400 md:group-hover:ease-[var(--ease-in)]",
          )}
        />
      ) : null}
      <span className={iconClassName}>{children}</span>
    </button>
  );
};

export default SliderNavButton;
