/** @format */

import { GithubOpenIssueOutputType } from "../types/github_repo_open_issues.type.js";

export const fetchGithubOpenIssueTool = async (
  owner: string,
  repo: string
): Promise<GithubOpenIssueOutputType[]> => {
  try {
    if (!owner) throw new Error("Invalid repository owner name");
    if (!repo) throw new Error("Invalid github repository name");

    const trimmedOwner = owner.trim();
    const trimmedRepo = repo.trim();
    if (!trimmedOwner) throw new Error(`Repository owner name cannot be empty`);
    if (!trimmedRepo) throw new Error(`Rpository name cannot be empty`);

    const response = await fetch(
      `https://api.github.com/repos/${encodeURI(owner)}/${encodeURI(
        repo
      )}/issues?state=open`,
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

    const data = (await response.json()) as GithubOpenIssueOutputType[];
    return data.map((repo) => ({
      id: repo.id,
      number: repo.number,
      title: repo.title,
      body: repo.body,
      state: repo.state,
      html_url: repo.html_url,
      user: {
        login: repo.user.login,
        avatar_url: repo.user.avatar_url,
        html_url: repo.user.html_url,
      },
      labels: repo.labels.map((label) => ({
        id: label.id,
        name: label.name,
        color: label.color,
      })),
      comments: repo.comments,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    }));
  } catch (error: any) {
    throw new Error(`Message: ${error.message} and Stack: ${error.stack}`);
  }
};
