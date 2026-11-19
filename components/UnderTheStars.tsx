"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { starsCopy as copy } from "../data/stars";
import s from "./UnderTheStars.module.scss";

export function UnderTheStars() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-stars-landscape]", {
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "top 15%",
          scrub: 1.4,
        },
      });
      gsap.from("[data-stars-copy]", {
        opacity: 0,
        y: 24,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 65%",
          once: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="under-the-stars"
      className={s.section}
      aria-labelledby="stars-title"
      tabIndex={-1}
    >
      <div className={s.landscape} data-stars-landscape>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetPath("/images/under-the-stars-1672.webp")}
          width={1672}
          height={941}
          loading="lazy"
          alt="The retreat beneath a star-filled sky, with warm light along its sandstone facade."
        />
      </div>
      <div className={s.stars} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className={s.copy} data-stars-copy>
        <h2 id="stars-title" aria-label={copy.title}>
          {copy.lines.map((line) => (
            <span key={line} aria-hidden="true">
              {line}
            </span>
          ))}
        </h2>
        <p>{copy.description}</p>
      </div>
    </section>
  );
}
