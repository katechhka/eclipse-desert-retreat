"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigation } from "../data/content";
import { footerCopy as copy } from "../data/footer";
import s from "./Footer.module.scss";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-footer-night]",
        { opacity: 0.25 },
        {
          opacity: 0.78,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.3,
          },
        },
      );
      gsap.from("[data-footer-brand]", {
        yPercent: 110,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-footer-brand]",
          start: "top 98%",
          once: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className={s.footer} aria-labelledby="footer-title">
      <picture className={s.landscape}>
        <source
          media="(max-width: 767px)"
          srcSet={assetPath("/images/footer-dunes-800.webp")}
        />
        <img
          src={assetPath("/images/footer-dunes-1672.webp")}
          width={1672}
          height={941}
          loading="lazy"
          alt=""
        />
      </picture>
      <div className={s.night} data-footer-night aria-hidden="true" />
      <div className={s.inner}>
        <div className={s.upper}>
          <div className={s.statement}>
            <h2 id="footer-title" aria-label={copy.title}>
              {copy.lines.map((line) => (
                <span key={line} aria-hidden="true">
                  {line}
                </span>
              ))}
            </h2>
            <p>{copy.location}</p>
          </div>
          <nav className={s.navigation} aria-label="Footer navigation">
            {navigation.map((label) => (
              <a
                key={label}
                href={
                  label === "Reserve"
                    ? "#reservation"
                    : `#${label.toLowerCase()}`
                }
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className={s.signature}>
          <a
            href="#top"
            aria-label="ECLIPSE, back to top"
            className={s.brandMask}
          >
            <span className={s.brand} data-footer-brand>
              {copy.brand}
            </span>
          </a>
          <div className={s.signatureBase}>
            <span className={s.descriptor}>{copy.descriptor}</span>
            <a href="#top" className={s.back}>
              {copy.back}
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
        <div className={s.disclosure}>
          <p>{copy.notice}</p>
          <p>{copy.description}</p>
        </div>
      </div>
    </footer>
  );
}
