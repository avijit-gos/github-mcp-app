/** @format */

import { GithubRepoContributorType } from "../types/github_repo_contributor.type.js";

export const fetchGithubContributors = async (
  owner: string,
  repo: string
): Promise<GithubRepoContributorType[]> => {
  try {
    if (!owner) throw new Error(`Invalid repository owner name`);
    if (!repo) throw new Error(`Invalid Repository name`);

    const trimmedOwner = owner.trim();
    const trimmedRepo = repo.trim();
    if (!trimmedOwner) throw new Error(`Github owner name cannot be empty`);
    if (!trimmedRepo) throw new Error(`Github repository name cannot empty`);

    const response = await fetch(
      `https://api.github.com/repos/${trimmedOwner}/${trimmedRepo}/contributors`,
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

    const data = (await response.json()) as GithubRepoContributorType[];

    return data.map((contri) => ({
      login: contri.login,
      id: contri.id,
      avatar_url: contri.avatar_url,
      html_url: contri.html_url,
      type: contri.type,
      site_admin: contri.site_admin,
      contributions: contri.contributions,
    }));
  } catch (error: any) {
    throw new Error(`Message: ${error.message} and Stack: ${error.stack}`);
  }
};
