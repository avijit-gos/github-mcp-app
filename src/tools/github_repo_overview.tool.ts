/** @format */

import { GithubOverviewOutputType } from "../types/github_repo_overview.type.js";

export const fetchGithubOverviewDetails = async (
  owner: string,
  repo: string
): Promise<GithubOverviewOutputType> => {
  try {
    if (!owner) throw new Error("Invalid repository owner name");
    if (!repo) throw new Error("Invalid github repository name");

    const trimmedOwner = owner.trim();
    const trimmedRepo = repo.trim();
    if (!trimmedOwner) throw new Error(`Repository owner name cannot be empty`);
    if (!trimmedRepo) throw new Error(`Rpository name cannot be empty`);

    const response = await fetch(
      `https://api.github.com/repos/${encodeURI(owner)}/${encodeURI(repo)}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "fetch-github-repo-info",
        },
      }
    );

    if (response.status === 404)
      throw new Error(`Owner: ${owner}, Repo: ${repo} not found`);
    if (response.status === 403)
      throw new Error("API limit exceeded. Please try again.");
    if (!response.ok) throw new Error("Opps! something went");

    const data = (await response.json()) as GithubOverviewOutputType;

    return {
      name: data.name,
      description: data.description,
      forks_count: data.forks_count,
      stargazers_count: data.stargazers_count,
      language: data.language,
      open_issues_count: data.open_issues_count,
      html_url: data.html_url,
    };
  } catch (error: any) {
    throw new Error(`Message: ${error.message} and Stack: ${error.stack}`);
  }
};
