import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const placeInfoSchema = z.object({
  info: z.object({
    weather: z.object({
      temperature: z.string(),
      description: z.string(),
      feels_like: z.string(),
      humidity: z.string(),
      wind: z.string(),
    }),
    events: z
      .array(z.object({ name: z.string(), description: z.string() }))
      .max(3),
    attractions: z
      .array(
        z.object({
          name: z.string(),
          speciality: z.string(),
          notes: z.string()
        })
      )
      .max(3),
    restaurants: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
          notes: z.string(),
          rating: z.string()
        })
      )
      .max(3),
  }),
});

export const getPlaceInfo = async (userprompt) => {
  const { object } = await generateObject({
    model: google("gemini-2.0-flash"),
    prompt: userprompt,
    schema: placeInfoSchema,
    system:
      "You are a tourist guide. you can suggest the best (upto 3 max) events, attractions, and restaurants in given place for a tourist to explore",
  });
  return object.info;
};
