"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Armchair, DoorClosed, Flower2 } from "lucide-react";
import { wellnessCopy as copy } from "../data/wellness";
import s from "./Wellness.module.scss";

const benefitIcons = [DoorClosed, Flower2, Armchair] as const;

export function Wellness() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.from("[data-wellness-line]", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-wellness-title]",
          start: "top 88%",
          once: true,
        },
      });
      gsap.utils
        .toArray<HTMLElement>("[data-wellness-reveal]")
        .forEach((element) => {
          gsap.from(element, {
            y: 28,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          });
        });
      media.add("(min-width: 768px)", () => {
        gsap.utils
          .toArray<HTMLElement>("[data-wellness-photo]")
          .forEach((frame, index) => {
            gsap.fromTo(
              frame.querySelector("img"),
              { yPercent: index === 0 ? -3 : -5 },
              {
                yPercent: index === 0 ? 3 : 5,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              },
            );
          });
      });
    }, root);
    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="wellness"
      ref={root}
      className={s.section}
      aria-labelledby="wellness-title"
    >
      <div className={s.inner}>
        <h2
          id="wellness-title"
          className={s.title}
          data-wellness-title
          aria-label={copy.title}
        >
          <span className={s.mask} aria-hidden="true">
            <span data-wellness-line>Return to</span>
          </span>
          <span className={s.mask} aria-hidden="true">
            <span data-wellness-line>Yourself</span>
          </span>
        </h2>
        <div className={s.pool} data-wellness-photo>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/images/wellness-pool-full.webp")}
            sizes="100vw"
            width={1448}
            height={1086}
            loading="lazy"
            alt="A shaded sandstone pool opening towards the red cliffs of Wadi Rum."
          />
        </div>
        <div className={s.opening} data-wellness-reveal>
          <p>{copy.paragraphs[0]}</p>
        </div>
        <div className={s.lounge} data-wellness-photo>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/images/wellness-lounge-960.webp")}
            srcSet={assetPath(
              "/images/wellness-lounge-640.webp 640w, /images/wellness-lounge-960.webp 960w",
            )}
            sizes="(max-width: 767px) 80vw, 35vw"
            width={960}
            height={1280}
            loading="lazy"
            alt="A quiet sandstone lounge with a daybed beside desert-facing glazing."
          />
        </div>
        <div className={s.details} data-wellness-reveal>
          <p>{copy.paragraphs[1]}</p>
          <ul>
            {copy.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <li key={benefit}>
                  <Icon size={30} strokeWidth={1.2} aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-controls="experience-details"
            onClick={(event) =>
              window.dispatchEvent(
                new CustomEvent("eclipse:explore-spa", {
                  detail: event.currentTarget,
                }),
              )
            }
          >
            {copy.cta}
            <span aria-hidden="true">+</span>
          </button>
          <noscript>
            <p>
              <a href="#experiences">Explore Desert Spa in Experiences</a>
            </p>
          </noscript>
        </div>
      </div>
    </section>
  );
}
