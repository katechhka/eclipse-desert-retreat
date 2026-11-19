"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences, experiencesCopy as copy } from "../data/experiences";
import s from "./Experiences.module.scss";
import { CloseButton } from "./CloseButton";

export function Experiences() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const experience = selected === null ? null : experiences[selected];

  useEffect(() => {
    const openSpa = (event: Event) => {
      opener.current = (event as CustomEvent<HTMLButtonElement>).detail;
      setSelected(experiences.findIndex((item) => item.id === "spa"));
    };
    window.addEventListener("eclipse:explore-spa", openSpa);
    return () => window.removeEventListener("eclipse:explore-spa", openSpa);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-experiences-intro]", {
        y: 35,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: "[data-experiences-heading]",
          start: "top 88%",
          once: true,
        },
      });
      const cards = gsap.utils.toArray<HTMLElement>("[data-experience]");
      cards.forEach((card, index) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          delay: index % 2 === 1 && window.innerWidth >= 768 ? 0.18 : 0,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 94%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const panel = dialog.current;
    if (!panel) return;
    const previousOverflow = document.body.style.overflow;
    panel.showModal();
    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
      );
    }, panel);
    return () => {
      ctx.revert();
      if (panel.open) panel.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [selected]);

  return (
    <section
      ref={root}
      id="experiences"
      className={s.section}
      aria-labelledby="experiences-title"
    >
      <div className={s.inner}>
        <div className={s.intro} data-experiences-heading>
          <h2 id="experiences-title" data-experiences-intro>
            Beyond <span>the Stay</span>
          </h2>
          <p data-experiences-intro>{copy.intro}</p>
        </div>
        <div className={s.gallery}>
          {experiences.map((item, index) => (
            <article key={item.id} className={s.card} data-experience>
              <div className={s.photo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image + "-1086.webp"}
                  srcSet={
                    item.image +
                    "-640.webp 640w, " +
                    item.image +
                    "-1086.webp 1086w"
                  }
                  sizes="(max-width: 767px) 92vw, 48vw"
                  width={1086}
                  height={1448}
                  loading="lazy"
                  alt={item.alt}
                />
                <p className={s.overlay} aria-hidden="true">
                  {item.teaser}
                </p>
              </div>
              <div className={s.caption}>
                <h3>{item.name}</h3>
                <p>{item.teaser}</p>
                <button
                  type="button"
                  aria-label={"Explore " + item.name}
                  aria-haspopup="dialog"
                  aria-controls="experience-details"
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setSelected(index);
                  }}
                >
                  Explore
                  <span aria-hidden="true" className={s.plus} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <dialog
        ref={dialog}
        id="experience-details"
        className={s.dialog}
        aria-labelledby="experience-detail-title"
        onCancel={(event) => {
          event.preventDefault();
          setSelected(null);
        }}
        onPointerDown={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          backdropPress.current =
            event.target === event.currentTarget &&
            (event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom);
        }}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            backdropPress.current &&
            event.target === event.currentTarget &&
            (event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom)
          )
            setSelected(null);
          backdropPress.current = false;
        }}
        onClose={() => setSelected(null)}
      >
        {experience && (
          <div className={s.detailLayout}>
            <div className={s.detailPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={experience.image + "-1086.webp"}
                alt=""
                width={1086}
                height={1448}
              />
            </div>
            <div className={s.detailCopy}>
              <CloseButton
                className={s.close}
                autoFocus
                aria-label={"Close " + experience.name + " details"}
                onClick={() => setSelected(null)}
              />
              <h2 id="experience-detail-title">{experience.name}</h2>
              <p>{experience.body}</p>
              {"extra" in experience && experience.extra && (
                <p>{experience.extra}</p>
              )}
              {experience.id === "stargazing" && (
                <a
                  href="#under-the-stars"
                  onClick={() => {
                    setSelected(null);
                    requestAnimationFrame(() =>
                      document
                        .getElementById("under-the-stars")
                        ?.focus({ preventScroll: true }),
                    );
                  }}
                >
                  Under the stars
                </a>
              )}
              {experience.rituals.length > 0 && (
                <div className={s.rituals}>
                  <h3>The rituals</h3>
                  <dl>
                    {experience.rituals.map((ritual) => (
                      <div key={ritual.title}>
                        <dt>{ritual.title}</dt>
                        <dd>{ritual.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
