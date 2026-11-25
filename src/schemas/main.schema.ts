/** @format */

import { z } from "zod";

export const AppInputType = z.object({
  owner: z.string().describe("Owner name of the github repo"),
  repo: z.string().describe("Github repository name"),
});
