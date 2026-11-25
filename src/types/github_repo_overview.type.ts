/** @format */

export type GithubOverviewOutputType = {
  name: string;
  description: string | null;
  forks_count: number;
  stargazers_count: number;
  language: string;
  open_issues_count: number;
  html_url: string;
};
