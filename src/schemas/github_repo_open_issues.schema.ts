/** @format */

import { z } from "zod";

export const GithubOpenIssueOutputSchema = z.object({
  id: z.number(),
  number: z.number(),
  title: z.string(),
  body: z.string().nullable(),
  state: z.string(),
  html_url: z.string(),

  user: z.object({
    login: z.string(),
    avatar_url: z.string(),
    html_url: z.string(),
  }),

  labels: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      color: z.string(),
    })
  ),

  comments: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GithubOpenIssuesResponseSchema = z.object({
  issues: z.array(GithubOpenIssueOutputSchema),
});

export type GithubOpenIssueOutputType = z.infer<
  typeof GithubOpenIssueOutputSchema
>;

export type GithubOpenIssuesResponseType = z.infer<
  typeof GithubOpenIssuesResponseSchema
>;