"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { locationCopy as copy, jordanOutline } from "../data/location";
import s from "./Location.module.scss";

gsap.registerPlugin(ScrollTrigger);

export function Location() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.from("[data-location-line]", {
        yPercent: 150,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
      gsap.from("[data-location-photo]", {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: { trigger: "[data-location-photo]", start: "top 85%" },
      });
      media.add("(min-width: 768px)", () => {
        gsap.fromTo(
          "[data-location-photo] img",
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-location-photo]",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      });
      gsap.from("[data-location-copy]", {
        y: 25,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
      const route = root.current?.querySelector<SVGPathElement>(
        "[data-location-route]",
      );
      if (route) {
        const length = route.getTotalLength();
        gsap
          .timeline({
            scrollTrigger: {
              trigger: "[data-location-map]",
              start: "top 75%",
              end: "center 40%",
              scrub: 0.8,
            },
          })
          .fromTo(
            route,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 1, ease: "none" },
          )
          .from("[data-location-marker]", { opacity: 0, duration: 0.25 });
      }
    }, root);
    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="location"
      ref={root}
      className={s.section}
      aria-labelledby="location-title"
    >
      <div className={s.inner}>
        <div className={s.intro}>
          <h2 id="location-title" className={s.title} aria-label={copy.title}>
            <span aria-hidden="true">
              <span data-location-line>Far from</span>
            </span>
            <span aria-hidden="true">
              <span data-location-line>Everything</span>
            </span>
          </h2>
          <p className={s.body} data-location-copy>
            {copy.body}
          </p>
        </div>
        <div className={s.journey}>
          <div className={s.photo} data-location-photo>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath("/images/location-landscape-1672.webp")}
              srcSet={assetPath(
                "/images/location-landscape-800.webp 800w, /images/location-landscape-1672.webp 1672w",
              )}
              sizes="(max-width: 767px) 100vw, 62vw"
              width={1672}
              height={941}
              loading="lazy"
              alt="Red dunes and sandstone cliffs in the open Wadi Rum landscape."
            />
          </div>
          <figure className={s.map} data-location-map>
            <figcaption>{copy.concept}</figcaption>
            <svg
              viewBox="0 0 480 500"
              role="img"
              aria-labelledby="location-map-title location-map-desc"
            >
              <title id="location-map-title">{copy.concept}</title>
              <desc id="location-map-desc">{copy.description}</desc>
              <path className={s.country} d={jordanOutline} />
              <text
                className={s.countryName}
                x="320"
                y="300"
                textAnchor="middle"
              >
                Jordan
              </text>
              <path
                className={s.routeBase}
                d="M68 428C115 418 98 348 156 327S202 283 221 243S308 224 328 174S342 116 370 89"
              />
              <path
                data-location-route
                className={s.route}
                d="M68 428C115 418 98 348 156 327S202 283 221 243S308 224 328 174S342 116 370 89"
              />
              <g className={s.points}>
                <circle cx="68" cy="428" r="5" />
                <circle cx="221" cy="243" r="5" />
                <text x="86" y="438">
                  Aqaba
                </text>
                <text x="74" y="234">
                  Wadi Rum
                </text>
              </g>
              <g data-location-marker className={s.marker}>
                <circle cx="370" cy="89" r="18" fill="none" />
                <circle cx="370" cy="89" r="5" />
                <text x="345" y="48" textAnchor="end">
                  ECLIPSE
                </text>
              </g>
            </svg>
          </figure>
        </div>
        <div className={s.information}>
          <ol className={s.stops}>
            {copy.stops.map((stop) => (
              <li key={stop.name}>
                <h3>{stop.name}</h3>
                <p>{stop.description}</p>
              </li>
            ))}
          </ol>
          <p className={s.explanation}>{copy.explanation}</p>
        </div>
      </div>
    </section>
  );
}
