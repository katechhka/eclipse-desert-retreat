"use client";
import { assetPath } from "../data/assets";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "react-day-picker";
import { ChevronDown, ArrowRight } from "lucide-react";
import { ReservationSelect } from "./ReservationSelect";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rooms } from "../data/rooms";
import {
  calendarDate,
  dateKey,
  readableDate,
  nightsBetween,
  money,
  staySchema,
  detailsSchema,
  reservationCopy as copy,
  type Stay,
  type Details,
} from "../data/reservation";
import "react-day-picker/style.css";
import s from "./Reservation.module.scss";

export function Reservation() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(1);
  const [reference, setReference] = useState("");
  const [failure, setFailure] = useState(false);
  const stay = useForm<Stay>({
    resolver: zodResolver(staySchema),
    defaultValues: {
      checkIn: "",
      checkOut: "",
      guests: "2",
      room: rooms[0].id,
    },
  });
  const details = useForm<Details>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: "", email: "" },
  });
  const values = useWatch({ control: stay.control }) as Stay;
  const room = rooms.find((item) => item.id === values.room) || rooms[0];
  const nights = nightsBetween(values.checkIn, values.checkOut);
  const nightText = `${nights} ${nights === 1 ? "night" : "nights"}`;
  const guestsText = `${values.guests} ${values.guests === "1" ? "guest" : "guests"}`;

  useEffect(() => {
    root.current?.setAttribute("data-hydrated", "true");
    function choose(id: string) {
      if (!rooms.some((item) => item.id === id)) return;
      stay.setValue("room", id);
      if (
        Number(stay.getValues("guests")) >
        rooms.find((item) => item.id === id)!.capacity
      )
        void stay.trigger("guests");
      else stay.clearErrors("guests");
      setStep(1);
    }
    try {
      const id = sessionStorage.getItem("eclipse-room");
      if (id) choose(id);
    } catch {}
    const listener = (event: Event) =>
      choose((event as CustomEvent<string>).detail);
    window.addEventListener("eclipse:room-selected", listener);
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-reservation-line]", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
      gsap.from("[data-reservation-reveal]", {
        y: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.16,
        scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
      });
    }, root);
    return () => {
      ctx.revert();
      window.removeEventListener("eclipse:room-selected", listener);
    };
  }, [stay]);

  function go(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
  function confirm() {
    try {
      setReference(`ECL-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`);
      setFailure(false);
      go(3);
    } catch {
      setFailure(true);
    }
  }

  return (
    <section
      ref={root}
      id="reservation"
      className={s.section}
      aria-labelledby="reservation-title"
    >
      <div className={s.landscape}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetPath("/images/reservation-bg.webp")}
          srcSet={assetPath(
            "/images/reservation-bg-800.webp 800w, /images/reservation-bg.webp 1920w",
          )}
          sizes="100vw"
          width="1920"
          height="1080"
          loading="lazy"
          alt=""
        />
      </div>
      <div className={s.inner}>
        <div className={s.intro}>
          <h2 id="reservation-title">
            <span>
              <span data-reservation-line>Your Escape</span>
            </span>
            <span>
              <em data-reservation-line>Awaits</em>
            </span>
          </h2>
          <p data-reservation-reveal>{copy.intro}</p>
        </div>
        <div className={s.booking} data-reservation-reveal>
          <div className={s.formPanel}>
            <div className={s.progress}>
              <p>
                Step {step} of 3 ·{" "}
                {step === 1
                  ? "Your stay"
                  : step === 2
                    ? "Your details"
                    : "Demo complete"}
              </p>
              <div aria-hidden="true">
                {[1, 2, 3].map((number) => (
                  <i key={number} className={number <= step ? s.reached : ""} />
                ))}
              </div>
            </div>
            <h3 ref={heading} tabIndex={-1}>
              {step === 1
                ? "Make room for a few quiet days."
                : step === 2
                  ? "Add your details for the demo."
                  : "Your imagined stay is ready."}
            </h3>
            {step === 1 && (
              <form
                noValidate
                onSubmit={(event) => {
                  void stay.handleSubmit(() => go(2))(event);
                }}
              >
                <div className={s.fields}>
                  {(["checkIn", "checkOut"] as const).map((name, index) => (
                    <div className={s.field} key={name}>
                      <span id={`${name}-label`}>
                        {index === 0 ? "Check-in" : "Check-out"}
                      </span>
                      <Controller
                        name={name}
                        control={stay.control}
                        render={({ field }) => (
                          <details
                            className={s.calendar}
                            onKeyDown={(event) => {
                              if (event.key === "Escape") {
                                event.currentTarget.open = false;
                                event.currentTarget
                                  .querySelector("summary")
                                  ?.focus();
                              }
                            }}
                          >
                            <summary
                              ref={field.ref}
                              aria-labelledby={`${name}-label ${name}-value`}
                              aria-invalid={!!stay.formState.errors[name]}
                              aria-describedby={
                                stay.formState.errors[name]
                                  ? `${name}-error`
                                  : "date-hint"
                              }
                            >
                              <span id={`${name}-value`}>
                                {field.value
                                  ? readableDate(field.value)
                                  : index === 0
                                    ? "Select arrival date"
                                    : "Select departure date"}
                              </span>
                              <ChevronDown
                                size={18}
                                strokeWidth={1.3}
                                aria-hidden="true"
                              />
                            </summary>
                            <div className={s.calendarPopup}>
                              <DayPicker
                                mode="single"
                                selected={
                                  field.value
                                    ? calendarDate(field.value)
                                    : undefined
                                }
                                defaultMonth={
                                  field.value
                                    ? calendarDate(field.value)
                                    : values.checkIn
                                      ? calendarDate(values.checkIn)
                                      : new Date()
                                }
                                disabled={{
                                  before:
                                    index === 1 && values.checkIn
                                      ? new Date(
                                          calendarDate(
                                            values.checkIn,
                                          ).getTime() + 86400000,
                                        )
                                      : calendarDate(dateKey(new Date())),
                                }}
                                onSelect={(
                                  date,
                                  _trigger,
                                  _modifiers,
                                  event,
                                ) => {
                                  field.onChange(date ? dateKey(date) : "");
                                  const panel = (
                                    event.target as HTMLElement
                                  ).closest("details");
                                  if (panel) {
                                    panel.open = false;
                                    panel.querySelector("summary")?.focus();
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={(event) => {
                                  const panel =
                                    event.currentTarget.closest("details");
                                  if (panel) {
                                    panel.open = false;
                                    panel.querySelector("summary")?.focus();
                                  }
                                }}
                              >
                                Close calendar
                              </button>
                            </div>
                          </details>
                        )}
                      />
                      {stay.formState.errors[name] && (
                        <p className={s.error} id={`${name}-error`}>
                          {stay.formState.errors[name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className={s.field}>
                    <label id="accommodation-label" htmlFor="accommodation">
                      Accommodation
                    </label>
                    <Controller
                      name="room"
                      control={stay.control}
                      render={({ field }) => (
                        <ReservationSelect
                          id="accommodation"
                          labelId="accommodation-label"
                          value={field.value}
                          options={rooms.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                          onChange={(value) => {
                            field.onChange(value);
                            void stay.trigger("guests");
                          }}
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                        />
                      )}
                    />
                  </div>
                  <div className={s.field}>
                    <label id="guests-label" htmlFor="guests">
                      Guests
                    </label>
                    <Controller
                      name="guests"
                      control={stay.control}
                      render={({ field }) => (
                        <ReservationSelect
                          id="guests"
                          labelId="guests-label"
                          value={field.value}
                          options={[
                            ...(Number(values.guests) > room.capacity
                              ? [{ value: values.guests, label: guestsText }]
                              : []),
                            ...Array.from(
                              { length: room.capacity },
                              (_, i) => ({
                                value: String(i + 1),
                                label: `${i + 1} ${i === 0 ? "guest" : "guests"}`,
                              }),
                            ),
                          ]}
                          onChange={(value) => {
                            field.onChange(value);
                            void stay.trigger("guests");
                          }}
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                          invalid={!!stay.formState.errors.guests}
                          describedBy="guests-hint guests-error"
                        />
                      )}
                    />
                    <p id="guests-hint" className={s.hint}>
                      {room.name} accommodates up to {room.capacity} guests.
                    </p>
                    {stay.formState.errors.guests && (
                      <p className={s.error} id="guests-error">
                        {stay.formState.errors.guests.message}
                      </p>
                    )}
                  </div>
                </div>
                <p id="date-hint" className={s.hint}>
                  Choose today or a future date. Check-out must be after
                  check-in.
                </p>
                <button className={s.primary} type="submit">
                  Continue{" "}
                  <ArrowRight size={24} strokeWidth={1.3} aria-hidden="true" />
                </button>
              </form>
            )}
            {step === 2 && (
              <form
                noValidate
                onSubmit={(event) => {
                  void details.handleSubmit(confirm)(event);
                }}
              >
                <p className={s.explanation}>{copy.privacy}</p>
                <div className={s.fields}>
                  {(["name", "email"] as const).map((name) => (
                    <div key={name} className={s.field}>
                      <label htmlFor={`booking-${name}`}>
                        {name === "name" ? "Full name" : "Email address"}
                      </label>
                      <input
                        id={`booking-${name}`}
                        type={name === "email" ? "email" : "text"}
                        autoComplete={name}
                        placeholder={
                          name === "name" ? "Alex Morgan" : "alex@example.com"
                        }
                        {...details.register(name)}
                        aria-invalid={!!details.formState.errors[name]}
                        aria-describedby={`${name}-error ${name === "email" ? "email-hint" : ""}`}
                      />
                      <p className={s.error} id={`${name}-error`}>
                        {details.formState.errors[name]?.message}
                      </p>
                    </div>
                  ))}
                </div>
                <p id="email-hint" className={s.hint}>
                  No confirmation email will be sent.
                </p>
                {failure && (
                  <p role="alert" className={s.error}>
                    The demo confirmation couldn’t be created. Your details are
                    still here. Please try again.
                  </p>
                )}
                <div className={s.actions}>
                  <button
                    type="button"
                    className={s.back}
                    aria-label="Back to dates and accommodation"
                    onClick={() => go(1)}
                  >
                    Back
                  </button>
                  <button type="submit" className={s.primary}>
                    {failure ? "Try again" : "Confirm demo stay"}
                    <ArrowRight
                      size={24}
                      strokeWidth={1.3}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </form>
            )}
            {step === 3 && (
              <div>
                <p className={s.explanation}>{copy.complete}</p>
                <div className={s.reference}>
                  <span>Local demo reference</span>
                  <strong>{reference}</strong>
                </div>
                <p className={s.hint}>{copy.reference}</p>
                <div className={s.actions}>
                  <button
                    className={s.primary}
                    onClick={() => {
                      stay.reset();
                      details.reset();
                      setReference("");
                      go(1);
                    }}
                  >
                    Start again{" "}
                    <ArrowRight
                      size={24}
                      strokeWidth={1.3}
                      aria-hidden="true"
                    />
                  </button>
                  <a className={s.back} href="#hero">
                    Back to the desert
                  </a>
                </div>
              </div>
            )}
            <p className={s.demo}>{copy.demo}</p>
          </div>
          <aside
            className={s.summary}
            aria-label={
              step === 3 ? "Your imagined stay" : "Your stay at a glance"
            }
          >
            <div className={s.roomImage}>
              <img
                key={room.id}
                src={assetPath(`/images/room-${room.id}-1080.webp`)}
                width="1080"
                height="608"
                loading="lazy"
                alt={room.alt}
              />
            </div>
            <div className={s.summaryBody}>
              <h4>
                {step === 3 ? "Your imagined stay" : "Your stay at a glance"}
              </h4>
              <p className={s.roomName}>{room.name}</p>
              <dl>
                <div>
                  <dt>Check-in</dt>
                  <dd>{readableDate(values.checkIn)}</dd>
                </div>
                <div>
                  <dt>Check-out</dt>
                  <dd>{readableDate(values.checkOut)}</dd>
                </div>
                <div>
                  <dt>Guests</dt>
                  <dd>{guestsText}</dd>
                </div>
                <div>
                  <dt>Nightly rate</dt>
                  <dd>{money(room.price)}</dd>
                </div>
                <div>
                  <dt>Length of stay</dt>
                  <dd>{nights ? nightText : "Dates not selected"}</dd>
                </div>
              </dl>
              <div className={s.total}>
                <span>Estimated total</span>
                <strong>{nights ? money(nights * room.price) : "—"}</strong>
              </div>
              <p className={s.hint}>
                {nights
                  ? `${nightText} × ${money(room.price)}`
                  : "Choose your dates to see the estimate."}
              </p>
              <p className={s.hint}>{copy.estimate}</p>
            </div>
          </aside>
        </div>
        <p className={s.sr} role="status">
          {nights
            ? `Estimate updated: ${money(nights * room.price)} for ${nightText} in ${room.name}.`
            : ""}
        </p>
        <p className={s.nojs}>
          The demo booking form needs JavaScript. You can still explore the
          sanctuaries and their illustrative nightly rates above.
        </p>
        <noscript>
          <style>{`.${s.booking}{display:none}`}</style>
        </noscript>
      </div>
    </section>
  );
}
