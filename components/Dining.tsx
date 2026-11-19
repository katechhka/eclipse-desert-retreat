"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { diningCopy as copy, diningMenu } from "../data/dining";
import { CloseButton } from "./CloseButton";
import s from "./Dining.module.scss";

function Courses() {
  return (
    <div className={s.courses}>
      {diningMenu.map((group) => (
        <section key={group.title} className={s.course}>
          <h3>{group.title}</h3>
          <dl>
            {group.dishes.map((dish) => (
              <div key={dish.name}>
                <dt>{dish.name}</dt>
                <dd>{dish.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
export function Dining() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const backdropPress = useRef(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-dining-photo]", {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.6,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: "[data-dining-photo]",
          start: "top 85%",
          once: true,
        },
      });
      gsap.from("[data-dining-copy]", {
        y: 38,
        opacity: 0,
        duration: 1.2,
        stagger: 0.16,
        delay: 0.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-dining-title]",
          start: "top 86%",
          once: true,
        },
      });
      gsap.from("[data-dining-detail]", {
        clipPath: "inset(0 0 100% 0)",
        y: 28,
        duration: 1.4,
        delay: 0.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: "[data-dining-detail]",
          start: "top 92%",
          once: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const panel = dialog.current;
    const returnTarget = opener.current;
    const previousOverflow = document.body.style.overflow;
    panel.showModal();
    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
    }, panel);
    return () => {
      ctx.revert();
      if (panel.open) panel.close();
      document.body.style.overflow = previousOverflow;
      returnTarget?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <section
      ref={root}
      id="dining"
      className={s.section}
      aria-labelledby="dining-title"
    >
      <div className={s.spread}>
        <div className={s.restaurant} data-dining-photo>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/images/dining-restaurant-1448.webp")}
            srcSet={assetPath(
              "/images/dining-restaurant-800.webp 800w, /images/dining-restaurant-1448.webp 1448w",
            )}
            sizes="(max-width: 767px) 92vw, 54vw"
            width={1448}
            height={1086}
            loading="lazy"
            alt="The dining room facing the desert through wide glazing."
          />
        </div>
        <div className={s.copy}>
          <h2 id="dining-title" data-dining-title data-dining-copy>
            A Taste <span>of the Desert</span>
          </h2>
          <div className={s.body}>
            {copy.paragraphs.map((text) => (
              <p key={text} data-dining-copy>
                {text}
              </p>
            ))}
            <button
              ref={opener}
              type="button"
              className={s.discover}
              aria-haspopup="dialog"
              aria-controls="dining-menu"
              onClick={() => setOpen(true)}
              data-dining-copy
            >
              {copy.cta}
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
        <div className={s.detail} data-dining-detail>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/images/dining-detail-800.webp")}
            srcSet={assetPath(
              "/images/dining-detail-480.webp 480w, /images/dining-detail-800.webp 800w",
            )}
            sizes="(max-width: 767px) 72vw, 27vw"
            width={1086}
            height={1448}
            loading="lazy"
            alt="Roasted vegetables on a clay plate beside an amber glass."
          />
        </div>
      </div>
      <noscript>
        <div className={s.staticMenu}>
          <h2>{copy.menuTitle}</h2>
          <Courses />
          <p>{copy.note}</p>
        </div>
      </noscript>
      <dialog
        ref={dialog}
        id="dining-menu"
        className={s.dialog}
        aria-labelledby="dining-menu-title"
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            event.preventDefault();
            event.currentTarget
              .querySelector<HTMLButtonElement>("button")
              ?.focus();
          }
        }}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        onPointerDown={(event) => {
          const r = event.currentTarget.getBoundingClientRect();
          backdropPress.current =
            event.target === event.currentTarget &&
            (event.clientX < r.left ||
              event.clientX > r.right ||
              event.clientY < r.top ||
              event.clientY > r.bottom);
        }}
        onClick={(event) => {
          const r = event.currentTarget.getBoundingClientRect();
          if (
            backdropPress.current &&
            event.target === event.currentTarget &&
            (event.clientX < r.left ||
              event.clientX > r.right ||
              event.clientY < r.top ||
              event.clientY > r.bottom)
          )
            setOpen(false);
          backdropPress.current = false;
        }}
      >
        <div className={s.menuPaper}>
          <CloseButton
            autoFocus
            className={s.close}
            aria-label="Close sample dining menu"
            onClick={() => setOpen(false)}
          />
          <p className={s.menuLabel}>SAMPLE MENU</p>
          <h2 id="dining-menu-title">{copy.menuTitle}</h2>
          <p className={s.menuIntro}>{copy.menuIntro}</p>
          <Courses />
          <p className={s.note}>{copy.note}</p>
        </div>
      </dialog>
    </section>
  );
}
