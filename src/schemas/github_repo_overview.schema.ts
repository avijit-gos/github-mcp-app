import { z } from "zod";

export const GithubOverviewOutputSchema = z.object({
  name: z.string().describe("Name of the github repository"),
  description: z
    .string()
    .nullable()
    .describe("Description of the github repository"),
  forks_count: z
    .number()
    .describe("Numbers of forks for the github repository"),
  stargazers_count: z
    .number()
    .describe("Numbers of the star present in the github repository"),
  language: z
    .string()
    .nullable()
    .describe("Language used in the github repository"),
  open_issues_count: z
    .number()
    .describe("Numbers of open issues present in the github repository"),
  html_url: z.string().describe("HTML url link of the github repository"),
});