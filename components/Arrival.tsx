"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroCopy as copy, navigation } from "../data/content";
import s from "./Arrival.module.scss";
import { CloseButton } from "./CloseButton";
import { Philosophy } from "./Philosophy";
import { Architecture } from "./Architecture";
import { Sanctuaries } from "./Sanctuaries";
import { Experiences } from "./Experiences";
import { Dining } from "./Dining";
import { DayToNight } from "./DayToNight";
import { Wellness } from "./Wellness";
import { Reservation } from "./Reservation";
import { Location } from "./Location";
import { UnderTheStars } from "./UnderTheStars";
import { Footer } from "./Footer";
export function Arrival() {
  const root = useRef<HTMLDivElement>(null),
    menu = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false),
    [ready, setReady] = useState(false),
    [loading, setLoading] = useState(false),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    const image = root.current?.querySelector("img");
    const finish = () => {
      if (active) {
        setLoading(false);
        setReady(true);
      }
    };
    const timeout = window.setTimeout(finish, 2500);
    setLoading(!image?.complete);
    Promise.allSettled([image?.decode(), document.fonts.ready]).then(finish);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        mobile: "(max-width: 767px)",
        desktop: "(min-width: 768px)",
      },
      (context) => {
        const ctx = gsap.context(() => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from("[data-landscape]", { opacity: 0, duration: 0.8 }, 0)
            .from(
              "[data-line]",
              { yPercent: 110, duration: 0.85, stagger: 0.15 },
              0.5,
            )
            .from(
              "[data-reveal]",
              { opacity: 0, y: 14, duration: 0.6, stagger: 0.025 },
              1.2,
            );
          if (context.conditions?.desktop) {
            gsap.to(`.${s.landscape}`, {
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: `.${s.hero}`,
                start: "top top",
                end: "bottom top",
                scrub: 1.15,
              },
            });
            gsap.to(`.${s.content}`, {
              y: -90,
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: `.${s.hero}`,
                start: "top top",
                end: "bottom top",
                scrub: 0.85,
              },
            });
          }
        }, root);
        return () => ctx.revert();
      },
    );
    return () => media.revert();
  }, [ready]);
  useEffect(() => {
    const hero = root.current?.querySelector(`.${s.hero}`);
    const header = root.current?.querySelector("header");
    if (!hero || !header) return;
    const observer = new IntersectionObserver(([entry]) =>
      header.classList.toggle(s.scrolled, !entry.isIntersecting),
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        menu.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        "nav > *",
        { y: 22 },
        {
          y: 0,
          stagger: 0.035,
          duration: 0.6,
          delay: 0.12,
          ease: "power3.out",
        },
      );
    }, menu);
    return () => {
      ctx.revert();
      document.body.style.overflow = old;
    };
  }, [open]);
  const close = () => {
    const dialog = menu.current;
    if (!dialog?.open) return;
    gsap.to(dialog, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        dialog.close();
        gsap.set(dialog, { clearProps: "opacity,transform" });
      },
    });
  };
  return (
    <div ref={root} id="top">
      <a className={s.skip} href="#main">
        Skip to content
      </a>
      <header className={s.header} data-reveal>
        <button
          ref={trigger}
          className={s.menuButton}
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => {
            menu.current?.showModal();
            setOpen(true);
          }}
        >
          <span className={s.menuIcon} aria-hidden="true" />
          MENU
        </button>
        <a className={s.logo} href="#top" aria-label="ECLIPSE, back to top">
          ECLIPSE<span>DESERT RETREAT</span>
        </a>
        <a className={s.reserve} href="#reservation">
          RESERVE
        </a>
      </header>
      <main id="main">
        <section id="hero" className={s.hero} aria-labelledby="arrival-title">
          <picture className={s.landscape} data-landscape>
            <source
              media="(max-width:767px)"
              srcSet={assetPath("/images/hero-desert-mobile.webp")}
            />
            <img
              src={assetPath("/images/hero-desert.webp")}
              alt="Low sandstone architecture beneath the red cliffs of Wadi Rum at sunset."
              width="1672"
              height="941"
              fetchPriority="high"
              loading="eager"
              onLoad={() => setLoading(false)}
              onError={() => {
                setFailed(true);
                setLoading(false);
              }}
            />
          </picture>
          <div className={s.shade} />
          <div className={s.content}>
            <p className={s.location} data-reveal>
              {copy.location}
              <span aria-hidden="true"> — </span>
              <span>{copy.coordinates}</span>
            </p>
            <h1 id="arrival-title">
              {copy.lines.map((line) => (
                <span className={s.lineMask} key={line}>
                  <span data-line>{line}</span>
                </span>
              ))}
            </h1>
            <p className={s.subtitle} data-reveal>
              {copy.subtitle}
            </p>
            <a className={s.discover} href="#philosophy" data-reveal>
              {copy.cta}
              <span aria-hidden="true">⟶</span>
            </a>
            {failed && (
              <p role="status">
                The landscape image couldn&apos;t load. You can still explore
                ECLIPSE.
              </p>
            )}
          </div>
          <div className={s.bottom} data-reveal>
            <span>{copy.index}</span>
            <a
              href="#philosophy"
              aria-label="Explore the philosophy of ECLIPSE"
            >
              {copy.scroll}
              <span className={s.scrollLine} aria-hidden="true" />
            </a>
          </div>
        </section>
        <Philosophy />
        <Architecture />
        <Sanctuaries />
        <DayToNight />
        <Experiences />
        <Dining />
        <Wellness />
        <UnderTheStars />
        <Location />
        <Reservation />
      </main>
      <Footer />
      <dialog
        ref={menu}
        id="navigation"
        className={s.menu}
        aria-label="Main navigation"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      >
        <div className={s.menuTop}>
          <span>ECLIPSE</span>
          <CloseButton onClick={close} aria-label="Close navigation" />
        </div>
        <nav aria-label="Main navigation">
          {navigation.map((label) =>
            label === "Philosophy" ||
            label === "Architecture" ||
            label === "Sanctuaries" ||
            label === "Experiences" ||
            label === "Dining" ||
            label === "Wellness" ||
            label === "Location" ||
            label === "Reserve" ? (
              <a
                key={label}
                href={`#${label === "Reserve" ? "reservation" : label.toLowerCase()}`}
                onClick={close}
              >
                {label}
              </a>
            ) : (
              <span
                key={label}
                aria-disabled="true"
                title="This section will be added in a later implementation stage"
              >
                {label}
              </span>
            ),
          )}
        </nav>
      </dialog>
      {loading && (
        <div className={s.preloader} role="status">
          <span>ECLIPSE</span>
          <div />
          <p>Loading the landscape</p>
        </div>
      )}
    </div>
  );
}
