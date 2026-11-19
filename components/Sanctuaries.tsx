"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rooms, sanctuariesCopy as copy } from "../data/rooms";
import "swiper/css";
import s from "./Sanctuaries.module.scss";

// Slide boxes stay fixed: only their contents contract, so Swiper's snap grid
// remains valid during buttons, interrupted transitions and touch gestures.
function syncSlideAppearance(swiper: SwiperInstance) {
  const desktop =
    swiper.width >= 0 && window.matchMedia("(min-width: 1024px)").matches;
  for (const slide of swiper.slides) {
    const progress =
      (slide as HTMLElement & { progress: number }).progress || 0;
    const distance = Math.abs(progress);
    const collapse = desktop
      ? (slide.offsetWidth - swiper.width * 0.24) / 2
      : 0;
    const offset =
      Math.sign(progress) *
      collapse *
      (distance <= 1 ? distance : 2 * distance - 1);
    slide.style.setProperty("--frame-shift", offset + "px");
    slide.style.setProperty(
      "--frame-inset",
      Math.min(distance, 1) * collapse + "px",
    );
  }
}

export function Sanctuaries() {
  const root = useRef<HTMLElement>(null);
  const slider = useRef<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const restore = requestAnimationFrame(() => {
      try {
        const value = sessionStorage.getItem("eclipse-room");
        if (rooms.some((room) => room.id === value)) setSelected(value);
      } catch {}
    });
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from("[data-sanctuary-intro]", {
        y: 35,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
      gsap.from("[data-sanctuary-gallery]", {
        clipPath: "inset(0 0 15% 0)",
        y: 35,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-sanctuary-gallery]",
          start: "top 85%",
          once: true,
        },
      });
    }, root);
    return () => {
      cancelAnimationFrame(restore);
      context.revert();
    };
  }, []);
  function selectRoom(id: string) {
    setSelected(id);
    try {
      sessionStorage.setItem("eclipse-room", id);
    } catch {}
    window.dispatchEvent(
      new CustomEvent("eclipse:room-selected", { detail: id }),
    );
    const reservation = document.getElementById("reservation");
    if (reservation) reservation.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <section
      ref={root}
      id="sanctuaries"
      className={s.section}
      aria-labelledby="sanctuaries-title"
    >
      <div className={s.intro}>
        <h2 id="sanctuaries-title" data-sanctuary-intro>
          The <em>Sanctuaries</em>
        </h2>
        <p data-sanctuary-intro>{copy.intro}</p>
      </div>
      <div className={s.gallery} data-sanctuary-gallery>
        <Swiper
          modules={[A11y, Keyboard]}
          keyboard={{ enabled: true, onlyInViewport: true }}
          a11y={{
            prevSlideMessage: "Previous sanctuary",
            nextSlideMessage: "Next sanctuary",
            slideLabelMessage: "{{index}} of {{slidesLength}}",
          }}
          slidesPerView="auto"
          centeredSlides
          watchSlidesProgress
          onSetTranslate={syncSlideAppearance}
          onSetTransition={(swiper, duration) => {
            swiper.el.style.setProperty("--slide-duration", `${duration}ms`);
          }}
          onResize={syncSlideAppearance}
          spaceBetween={20}
          speed={850}
          onSwiper={(value) => {
            slider.current = value;
            syncSlideAppearance(value);
          }}
          onSlideChange={(value) => setActive(value.activeIndex)}
          className={s.slider}
        >
          {rooms.map((room, index) => (
            <SwiperSlide
              key={room.id}
              className={`${s.slide} ${index === active ? s.active : ""}`}
            >
              <article aria-label={`${room.name}, ${room.index} of 3`}>
                <div className={s.photo}>
                  <img
                    src={assetPath(`/images/room-${room.id}-1672.webp`)}
                    srcSet={[640, 1080, 1672]
                      .map((width) =>
                        assetPath(
                          `/images/room-${room.id}-${width}.webp ${width}w`,
                        ),
                      )
                      .join(", ")}
                    sizes="(max-width: 767px) 88vw, 68vw"
                    width={1672}
                    height={941}
                    loading="lazy"
                    alt={room.alt}
                  />
                  {index !== active && (
                    <button
                      className={s.peek}
                      aria-label={`Show ${room.index} ${room.name}`}
                      onClick={() => slider.current?.slideTo(index)}
                    >
                      <span>{room.index}</span>
                      <span>{room.name}</span>
                    </button>
                  )}
                </div>
                <div className={s.details} inert={index !== active}>
                  <div className={s.name}>
                    <span className={s.index}>{room.index}</span>
                    <h3>{room.name}</h3>
                    <span className={s.rate}>
                      ${room.price.toLocaleString("en-US")} <span>/ night</span>
                    </span>
                  </div>
                  <div className={s.description}>
                    <p>{room.description}</p>
                    <div>
                      <p className={s.facts}>
                        {room.area} m² <span>Up to {room.capacity} guests</span>
                      </p>
                      <ul>
                        {room.amenities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    className={s.select}
                    aria-pressed={selected === room.id}
                    onClick={() => selectRoom(room.id)}
                  >
                    {selected === room.id ? "Selected" : "Select suite"}
                    <span aria-hidden="true">
                      {selected === room.id ? "✓" : "→"}
                    </span>
                  </button>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={s.bottom}>
        <div className={s.controls}>
          <button
            aria-label="Previous sanctuary"
            disabled={active === 0}
            onClick={() => slider.current?.slidePrev()}
          >
            ←
          </button>
          <span aria-live="polite">{rooms[active].index} / 03</span>
          <button
            aria-label="Next sanctuary"
            disabled={active === rooms.length - 1}
            onClick={() => slider.current?.slideNext()}
          >
            →
          </button>
        </div>
      </div>
      <span className={s.sr} role="status">
        {selected
          ? `${rooms.find((room) => room.id === selected)?.name} selected.`
          : ""}
      </span>
      <noscript>
        <style>{`.${s.slider} .${s.slide}{width:100%}.${s.slider} .swiper-wrapper{display:block}.${s.details}{opacity:1!important;visibility:visible!important}.${s.peek}{display:none}.${s.select}{display:none}`}</style>
      </noscript>
    </section>
  );
}
