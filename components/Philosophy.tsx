"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { philosophyCopy as copy } from "../data/content";
import s from "./Philosophy.module.scss";

export function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-quote-line]", {
        yPercent: 108,
        duration: 1.2,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-quote]",
          start: "top 86%",
          once: true,
        },
      });
      gsap.from("[data-philosophy-photo]", {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.6,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: "[data-philosophy-photo]",
          start: "top 85%",
          once: true,
        },
      });
      gsap.from("[data-philosophy-body]", {
        y: 22,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-philosophy-body]",
          start: "top 92%",
          once: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="philosophy"
      className={s.section}
      aria-labelledby="philosophy-title"
    >
      <div className={s.layout}>
        <div className={s.words}>
          <h2 id="philosophy-title" className={s.title}>
            {copy.title}
          </h2>
          <blockquote className={s.quote} data-quote aria-label={copy.quote}>
            {copy.lines.map((line) => (
              <span className={s.mask} key={line} aria-hidden="true">
                <span data-quote-line>{line}</span>
              </span>
            ))}
          </blockquote>
          <div className={s.body}>
            {copy.paragraphs.map((text) => (
              <p key={text} data-philosophy-body>
                {text}
              </p>
            ))}
          </div>
        </div>
        <figure className={s.figure}>
          <div className={s.photo} data-philosophy-photo>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath("/images/philosophy-silence.webp")}
              srcSet={assetPath(
                "/images/philosophy-silence-small.webp 640w, /images/philosophy-silence.webp 1086w",
              )}
              sizes="(max-width: 767px) 92vw, 37vw"
              width={1086}
              height={1448}
              loading="lazy"
              alt="Warm sandstone terrace and recessed glazing beneath the red desert cliffs."
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
