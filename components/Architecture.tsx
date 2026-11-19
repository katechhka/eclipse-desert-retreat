"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { architectureCopy as copy } from "../data/content";
import s from "./Architecture.module.scss";

export function Architecture() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=125%",
              pin: "[data-architecture-stage]",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          })
          .from("[data-aerial]", {
            top: "0%",
            left: "0%",
            width: "100%",
            height: "100%",
            duration: 1.5,
          })
          .from(
            "[data-architecture-title]",
            { opacity: 0, y: 35, duration: 0.65 },
            0.9,
          )
          .from(
            "[data-facade]",
            { clipPath: "inset(100% 0% 0% 0%)", y: 30, duration: 0.9 },
            1.1,
          )
          .to("[data-facade] img", { yPercent: -3, duration: 0.5 }, 2);
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section
      ref={root}
      id="architecture"
      className={s.section}
      aria-labelledby="architecture-title"
    >
      <div className={s.stage} data-architecture-stage>
        <h2 id="architecture-title" className={s.title} data-architecture-title>
          <span>{copy.lines[0]}</span>
          <em>{copy.lines[1]}</em>
        </h2>
        <figure className={s.aerial} data-aerial>
          <picture>
            <img
              src={assetPath("/images/architecture-aerial-1672.webp")}
              srcSet={assetPath(
                "/images/architecture-aerial-640.webp 640w, /images/architecture-aerial-1080.webp 1080w, /images/architecture-aerial-1672.webp 1672w",
              )}
              sizes="(max-width: 1023px) 100vw, 100vw"
              width={1672}
              height={941}
              loading="lazy"
              alt={copy.aerialAlt}
            />
          </picture>
        </figure>
        <figure className={s.facade} data-facade>
          <picture>
            <img
              src={assetPath("/images/architecture-facade-1080.webp")}
              srcSet={assetPath(
                "/images/architecture-facade-640.webp 640w, /images/architecture-facade-1080.webp 1080w",
              )}
              sizes="(max-width: 767px) 92vw, (max-width: 1023px) 60vw, 32vw"
              width={1080}
              height={1440}
              loading="lazy"
              alt={copy.facadeAlt}
            />
          </picture>
        </figure>
      </div>
      <div className={s.copy}>
        <p>{copy.paragraphs[0]}</p>
        <p>{copy.paragraphs[1]}</p>
      </div>
    </section>
  );
}
