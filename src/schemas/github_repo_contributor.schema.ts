/** @format */

import { z } from "zod";

export const GithubRepoContributorSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string(),
  html_url: z.string(),
  type: z.string(),
  site_admin: z.boolean(),
  contributions: z.number(),
});

export const GithubRepoContributorsResponseSchema = z.object({
  contributors: z.array(GithubRepoContributorSchema),
});

export type GithubRepoContributorType = z.infer<
  typeof GithubRepoContributorSchema
>;
