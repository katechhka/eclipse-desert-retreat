"use client";

import { useEffect, useId, useRef, useState, type Ref } from "react";
import { Check, ChevronDown } from "lucide-react";
import s from "./ReservationSelect.module.scss";

type Option = { value: string; label: string };
type Props = {
  id: string;
  labelId: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  onBlur: () => void;
  inputRef: Ref<HTMLButtonElement>;
  invalid?: boolean;
  describedBy?: string;
};

export function ReservationSelect({
  id,
  labelId,
  value,
  options,
  onChange,
  onBlur,
  inputRef,
  invalid,
  describedBy,
}: Props) {
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
  }
  return (
    <div
      ref={root}
      className={s.select}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          onBlur();
        }
      }}
    >
      <button
        ref={inputRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${id}-value`}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => {
          setActive(selected);
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (
            [
              "ArrowDown",
              "ArrowUp",
              "Home",
              "End",
              "Enter",
              " ",
              "Escape",
            ].includes(event.key)
          ) {
            event.preventDefault();
            if (event.key === "Escape") {
              setOpen(false);
              return;
            }
            if (event.key === "Enter" || event.key === " ") {
              if (open) choose(active);
              else {
                setActive(selected);
                setOpen(true);
              }
              return;
            }
            setOpen(true);
            if (event.key === "Home") setActive(0);
            else if (event.key === "End") setActive(options.length - 1);
            else
              setActive((current) =>
                Math.max(
                  0,
                  Math.min(
                    options.length - 1,
                    (open ? current : selected) +
                      (event.key === "ArrowDown" ? 1 : -1),
                  ),
                ),
              );
          } else if (
            event.key.length === 1 &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
          ) {
            const index = options.findIndex((option) =>
              option.label.toLowerCase().startsWith(event.key.toLowerCase()),
            );
            if (index >= 0) {
              setActive(index);
              setOpen(true);
            }
          }
        }}
      >
        <span id={`${id}-value`}>{options[selected]?.label}</span>
        <ChevronDown
          size={18}
          strokeWidth={1.3}
          aria-hidden="true"
          className={open ? s.rotated : undefined}
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className={s.options}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={index === active ? s.active : undefined}
              onPointerMove={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check size={17} strokeWidth={1.3} aria-hidden="true" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
