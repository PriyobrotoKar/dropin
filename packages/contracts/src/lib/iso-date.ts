import z from "zod";

// JSON sends dates as ISO strings; decode them back into Date objects.
export const isoDate = z.codec(z.iso.datetime({ offset: true }), z.date(), {
  decode: (s) => new Date(s),
  encode: (d) => d.toISOString(),
});
