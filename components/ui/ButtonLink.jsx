import Link from "next/link";
import React from "react";
import NavLink from "../NavLink";

const ButtonLink = ({
  tag = "button",
  text,
  needDot,
  className,
  variant,
  disabled = false,
  needTransition = true,
  onClick,
  ...props
}) => {
  const words = text?.split(" ") || [];

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
    const target = event.currentTarget;

    // Keyboard click doesn't fire pointer events, so animate here for accessibility.
    if (event.detail === 0 && !disabled) {
      playPressAnimation(target);
    }

    if (typeof onClick === "function") {
      onClick(event);
    }
  };

  const content = (
    <div className="relative flex gap-0 md:group-hover:gap-1 md:transition-all md:duration-500 md:group-hover:duration-400 items-center md:ease-[var(--ease-in-out)] md:group-hover:ease-[var(--ease-in)] capitalize">
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span>{word}</span>
          {index < words.length - 1 && (
            <div
              className={`w-1 h-1 rounded-full ${
                variant === "red" ? "bg-textWhite " : "bg-wine"
              } transform scale-0 md:group-hover:scale-100 md:transition-all md:duration-500 md:group-hover:duration-400 md:ease-[var(--ease-in-out)] md:group-hover:ease-[var(--ease-in)]`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
  if (tag === "a") {
    return needTransition ? (
      <NavLink
        href={props.href || "#"}
        data-cursor-hidden="true"
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className={`px-4 group relative py-2.5 rounded-full text-14 group md:transition-all md:duration-500 md:hover:duration-500 md:ease-[var(--ease-in-out)] md:hover:ease-[var(--ease-in)] ${
          variant === "red"
            ? "bg-wine text-textWhite "
            : "bg-textWhite text-dark "
        } ${className}`}
        {...props}
      >
        {content}
        <div
          className={`absolute inset-0 rounded-full ${variant === "red" ? "bg-hover-white/7" : "bg-hover/7"}  opacity-0 group-hover:opacity-100 md:transition-all md:duration-500 md:hover:duration-500 md:ease-[var(--ease-in-out)] md:hover:ease-[var(--ease-in)]`}
        ></div>{" "}
      </NavLink>
    ) : (
      <Link
        href={props.href || "#"}
        data-cursor-hidden="true"
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className={`px-4 py-2.5 relative group rounded-full text-14 group md:transition-all md:duration-500 md:hover:duration-500 md:ease-[var(--ease-in-out)] md:hover:ease-[var(--ease-in)] ${
          variant === "red"
            ? "bg-wine text-textWhite "
            : "bg-textWhite text-dark "
        } ${className}`}
        {...props}
      >
        {content}
        <div
          className={`absolute inset-0 rounded-full ${variant === "red" ? "bg-hover-white/7" : "bg-hover/7"}  opacity-0 group-hover:opacity-100 md:transition-all md:duration-500 md:hover:duration-500 md:ease-[var(--ease-in-out)] md:hover:ease-[var(--ease-in)]`}
        ></div>
      </Link>
    );
  }
  return (
    <button
      disabled={disabled}
      data-cursor-hidden="true"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={`relative group px-4 py-2.5 rounded-full text-14 group md:transition-all md:duration-500 md:hover:duration-500 md:ease-[var(--ease-in-out)] md:hover:ease-[var(--ease-in)] ${
        variant === "red" ? "bg-wine text-textWhite " : "bg-textWhite text-dark"
      } ${className}`}
      {...props}
    >
      {content}
      <div
        className={`absolute inset-0 rounded-full ${variant === "red" ? "bg-hover-white/7" : "bg-hover/7"}  opacity-0 group-hover:opacity-100 md:transition-all md:duration-500 md:hover:duration-500 md:ease-[var(--ease-in-out)] md:hover:ease-[var(--ease-in)]`}
      ></div>
    </button>
  );
};

export default ButtonLink;
