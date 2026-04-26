import { z } from "zod";

const HexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "color must be a 6-digit hex like #f59e0b");

const HighlightSchema = z.object({
  selector: z.string().min(1),
  color: HexColor.default("#f59e0b"),
  label: z.string().optional(),
});

const RectSchema = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const CalloutSchema = RectSchema.extend({
  color: HexColor.default("#f59e0b"),
  label: z.string().optional(),
});

const CaptureSchema = z
  .object({
    selector: z.string().min(1).optional(),
    pad: z.number().int().nonnegative().optional(),
    fullPage: z.boolean().optional(),
    crop: RectSchema.optional(),
    callouts: z.array(CalloutSchema).default([]),
    highlights: z.array(HighlightSchema).default([]),
  })
  .default({});

const DiataxisSchema = z.object({
  page: z.string().min(1),
  type: z.enum(["tutorial", "how-to", "reference", "explanation"]),
  heading: z.string().optional(),
});

const CapturedAtSchema = z
  .object({
    bifrost_sha: z.string().min(7).nullable(),
    timestamp: z.string().datetime({ offset: true }).nullable(),
  })
  .nullable();

const EntrySchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9][a-z0-9-]*$/, "id must be kebab-case ASCII"),
  image: z.string().min(1),
  route: z.string().startsWith("/", "route must start with /"),
  auth_as: z.string().optional(),
  seed: z.string().optional(),
  viewport: z
    .object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
  capture: CaptureSchema,
  diataxis: DiataxisSchema,
  source_globs: z.array(z.string().min(1)).default([]),
  captured_at: CapturedAtSchema.default(null),
});

const DefaultsSchema = z
  .object({
    auth_as: z.string().default("platform_admin"),
    viewport: z
      .object({
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .default({ width: 1440, height: 900 }),
    pad: z.number().int().nonnegative().default(16),
  })
  .default({});

export const ManifestSchema = z.object({
  version: z.literal(1),
  defaults: DefaultsSchema,
  entries: z.array(EntrySchema),
});
