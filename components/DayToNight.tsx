"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dayNightCopy as copy, dayPhases } from "../data/dayPhases";
import s from "./DayToNight.module.scss";

export function DayToNight() {
  const root = useRef<HTMLElement>(null);
  const [minutes, setMinutes] = useState(1080);
  const position = (minutes - 360) / 360;
  const phaseIndex = Math.min(3, Math.round(position));
  const phase = dayPhases[phaseIndex];
  const time =
    minutes === 1440
      ? "00:00"
      : `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-hour-line]", {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
      gsap.from("[data-hour-controls]", {
        y: 24,
        opacity: 0,
        duration: 1.1,
        scrollTrigger: {
          trigger: "[data-hour-controls]",
          start: "top 95%",
          once: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="day-to-night"
      className={s.section}
      aria-labelledby="day-night-title"
      data-phase={phase.id}
    >
      <div className={s.panorama} aria-hidden="true">
        {dayPhases.map((item, index) => {
          // Each next layer blends over the fully opaque preceding exposure.
          const opacity =
            index === 0 ? 1 : Math.max(0, Math.min(1, position - index + 1));
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.id}
              src={assetPath(`/images/day-night-${item.id}-full.webp`)}
              width={1672}
              height={941}
              loading="lazy"
              alt=""
              style={{ opacity }}
            />
          );
        })}
      </div>
      <div className={s.shade} aria-hidden="true" />
      <h2 id="day-night-title" className={s.title} aria-label={copy.title}>
        <span className={s.mask} aria-hidden="true">
          <span data-hour-line>Every hour tells</span>
        </span>
        <span className={s.mask} aria-hidden="true">
          <span data-hour-line>
            a different <em>story.</em>
          </span>
        </span>
      </h2>
      <div className={s.controls} data-hour-controls>
        <div className={s.readout}>
          <div className={s.clock}>
            <output htmlFor="desert-time">{time}</output>
            <span>{phase.name}</span>
          </div>
          <p className={s.description} key={phase.id}>
            {phase.description}
          </p>
        </div>
        <label className={s.instruction} htmlFor="desert-time">
          {copy.instruction}
        </label>
        <div
          className={s.timeline}
          style={
            { "--time-progress": `${(position / 3) * 100}%` } as CSSProperties
          }
        >
          <input
            id="desert-time"
            type="range"
            min={360}
            max={1440}
            step={15}
            value={minutes}
            aria-label={copy.label}
            aria-valuetext={`${time}, ${phase.name}`}
            onChange={(event) => setMinutes(Number(event.target.value))}
          />
          <div className={s.ticks}>
            {dayPhases.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={`${item.time}, ${item.name}`}
                aria-pressed={minutes === item.hour * 60}
                onClick={() => setMinutes(item.hour * 60)}
              >
                {item.time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
