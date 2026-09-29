import { useEffect, useRef, useState, type ReactNode } from "react";

export function HorizontalScroll({
  children,
  className = "",
  indicator = false,
}: {
  children: ReactNode;
  className?: string;
  indicator?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [position, setPosition] = useState({ size: 1, offset: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const available = element.scrollWidth - element.clientWidth;
      setPosition({
        size: Math.min(1, element.clientWidth / Math.max(1, element.scrollWidth)),
        offset: available > 0 ? element.scrollLeft / available : 0,
      });
    };
    const wheel = (event: WheelEvent) => {
      const available = element.scrollWidth - element.clientWidth;
      if (available <= 0) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if ((delta > 0 && element.scrollLeft < available - 1) || (delta < 0 && element.scrollLeft > 1)) {
        event.preventDefault();
        element.scrollLeft += delta;
      }
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("scroll", update);
    };
  }, [children]);

  return (
    <div className="min-w-0 w-full">
      <div
        ref={ref}
        className={`min-w-0 w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0 || !ref.current) return;
          drag.current = { active: true, startX: event.clientX, startScroll: ref.current.scrollLeft, moved: false };
        }}
        onPointerMove={(event) => {
          if (!drag.current.active || !ref.current) return;
          const distance = event.clientX - drag.current.startX;
          if (Math.abs(distance) > 4) {
            drag.current.moved = true;
            ref.current.setPointerCapture(event.pointerId);
            ref.current.scrollLeft = drag.current.startScroll - distance;
          }
        }}
        onPointerUp={(event) => {
          drag.current.active = false;
          if (ref.current?.hasPointerCapture(event.pointerId)) ref.current.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { drag.current.active = false; }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {children}
      </div>
      {indicator && (
        <div aria-hidden="true" className="relative mt-px h-px w-full bg-border">
          <span
            className="absolute top-0 h-px bg-muted-foreground/60"
            style={{ width: `${position.size * 100}%`, left: `${position.offset * (1 - position.size) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}