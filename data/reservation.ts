import { z } from "zod";
import { rooms } from "./rooms";

export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export const calendarDate = (value: string) => new Date(`${value}T12:00:00`);
export const readableDate = (value: string) =>
  value
    ? calendarDate(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Dates not selected";
export const nightsBetween = (start: string, end: string) =>
  start && end
    ? Math.max(
        0,
        (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) /
          86400000,
      )
    : 0;
export const staySchema = z
  .object({
    checkIn: z.string().min(1, "Choose a check-in date."),
    checkOut: z.string().min(1, "Choose a check-out date."),
    room: z
      .string()
      .refine(
        (value) => rooms.some((room) => room.id === value),
        "Choose a sanctuary.",
      ),
    guests: z.string().min(1, "Choose the number of guests."),
  })
  .superRefine((data, ctx) => {
    for (const key of ["checkIn", "checkOut"] as const) {
      if (!data[key]) continue;
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(data[key]) ||
        !Number.isFinite(calendarDate(data[key]).getTime()) ||
        dateKey(calendarDate(data[key])) !== data[key]
      )
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "Enter a valid date.",
        });
      else if (data[key] < dateKey(new Date()))
        ctx.addIssue({
          code: "custom",
          path: [key],
          message:
            key === "checkIn"
              ? "Check-in cannot be in the past."
              : "Check-out cannot be in the past.",
        });
    }
    if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn)
      ctx.addIssue({
        code: "custom",
        path: ["checkOut"],
        message: "Check-out must be after check-in.",
      });
    const room = rooms.find((room) => room.id === data.room);
    if (
      data.guests &&
      (!Number.isInteger(Number(data.guests)) || Number(data.guests) < 1)
    )
      ctx.addIssue({
        code: "custom",
        path: ["guests"],
        message: "Enter a whole number of guests, starting from 1.",
      });
    else if (room && Number(data.guests) > room.capacity)
      ctx.addIssue({
        code: "custom",
        path: ["guests"],
        message: `This sanctuary accommodates up to ${room.capacity} guests. Choose fewer guests or a larger sanctuary.`,
      });
  });
export const detailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .refine((value) => /\p{L}/u.test(value), "Enter a name using letters."),
  email: z
    .string()
    .trim()
    .min(1, "Enter an email address.")
    .email("Enter a valid email address, such as alex@example.com."),
});
export type Stay = z.infer<typeof staySchema>;
export type Details = z.infer<typeof detailsSchema>;
// Exact section 11 prose from ECLIPSE_website_copy.txt.
export const reservationCopy = {
  intro:
    "Picture a few days in the desert. Choose your dates and a sanctuary to see how your stay could take shape.",
  demo: "Demo booking — no payment or real reservation",
  estimate:
    "USD · Accommodation only. The estimate is the nightly rate multiplied by the number of nights.",
  privacy:
    "You can use sample details. They are used only for this on-screen demo and are not sent or saved.",
  complete:
    "Here is your ECLIPSE stay, just as you pictured it. This is a demo confirmation. No booking has been made and no payment has been taken.",
  reference:
    "This reference is generated on your device for the demo. It cannot be used to check in or manage a reservation.",
};
