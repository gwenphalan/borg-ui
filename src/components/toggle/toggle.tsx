import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

export interface ToggleProps {
  checked: boolean;
  disabled?: boolean;
  onToggle?: (newState: boolean) => void;
  className?: string;
}

const ANIM_DURATION_STRETCH = 40; // ms
const ANIM_DURATION_SHRINK = 80; // ms

export function Toggle({
  checked,
  disabled = false,
  onToggle,
  className,
}: ToggleProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimeoutRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear timeouts on unmount
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (animationTimeoutRef2.current) clearTimeout(animationTimeoutRef2.current);
    };
  }, []);

  function handleClick() {
    if (disabled || isAnimating) {
      return;
    }

    setIsAnimating(true);

    // Clear any existing timeouts to prevent conflicts if clicked rapidly
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (animationTimeoutRef2.current) clearTimeout(animationTimeoutRef2.current);

    animationTimeoutRef.current = setTimeout(() => {
      if (onToggle) {
        onToggle(!checked);
      }
      animationTimeoutRef2.current = setTimeout(() => {
        setIsAnimating(false);
      }, ANIM_DURATION_SHRINK);
    }, ANIM_DURATION_STRETCH);
  }

  const trackShadow = checked ? 'shadow-[inset_0px_0px_2px_#00000066]' : 'shadow-[inset_0px_0px_2px_#00000033]';
  const handleBaseShadow = 'shadow-[0px_0px_0px_2px_#00000026,0px_2px_4px_#00000040,0px_0px_2px_#00000026]';

  let handleWidth: string;
  if (isAnimating) {
    handleWidth = 'w-[47px]';
  } else if (isHovered) {
    handleWidth = 'w-[29px]';
  } else {
    handleWidth = 'w-[25px]';
  }

  let handlePosition: string;
  if (isAnimating) {
    handlePosition = 'left-[2px]';
  } else if (checked) {
    handlePosition = isHovered ? 'left-[19px]' : 'left-[23px]';
  } else {
    handlePosition = 'left-[2px]';
  }

  let innerIconSize: string;
  let innerIconPosition: string;

  if (isAnimating) {
    innerIconSize = 'w-[32px] h-[11px]';
    innerIconPosition = 'left-[7px]';
  } else if (checked) {
    innerIconSize = 'w-[4px] h-[11px]';
    innerIconPosition = isHovered ? 'left-[13px]' : 'left-[11px]';
  } else { // Off state
    innerIconSize = isHovered ? 'w-[14px] h-[11px]' : 'w-[11px] h-[11px]';
    innerIconPosition = 'left-[7px]';
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled ? 'true' : undefined}
      onClick={handleClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      className={clsx(
        'relative flex items-center justify-center',
        'w-[50px] h-[29px] rounded-[22px] overflow-hidden',
        'transition-colors duration-200 ease-in-out',
        'focus:outline-none',
        trackShadow,
        checked ? 'bg-content-primary' : 'bg-status-error',
        {
          'cursor-not-allowed opacity-60': disabled,
          'cursor-pointer': !disabled,
        },
        className
      )}
      disabled={disabled}
    >
      <span className="sr-only">Toggle</span>
      {/* Handle */}
      <div
        className={clsx(
          'absolute bg-background-default',
          'top-[2px]',
          'h-[25px] rounded-[13px]',
          'transition-all duration-200 ease-in-out',
          handleBaseShadow,
          handleWidth,
          handlePosition
        )}
      >
        {/* Inner Icon inside Handle */}
        <div
          className={clsx(
            'absolute',
            'top-[7px] rounded-[13px]',
            'border-2 border-solid',
            'transition-all duration-200 ease-in-out',
            checked ? 'border-content-primary' : 'border-status-error',
            checked && !isAnimating ? 'bg-content-primary' : 'bg-transparent',
            innerIconSize,
            innerIconPosition
          )}
        />
      </div>
    </button>
  );
}
