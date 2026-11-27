/** @format */
import { MCPServer } from "mcp-use";
import { AppInputType } from "./src/schemas/main.schema.js";
import { GithubOverviewOutputSchema } from "./src/schemas/github_repo_overview.schema.js";
import { fetchGithubOverviewDetails } from "./src/tools/github_repo_overview.tool.js";
import { fetchGithubOpenIssueTool } from "./src/tools/github_repo_open_issues.tool.js";
import { GithubOpenIssuesResponseSchema } from "./src/schemas/github_repo_open_issues.schema.js";
import { fetchGithubContributors } from "./src/tools/github_repo_contributor.tool.js";
import { GithubRepoContributorsResponseSchema } from "./src/schemas/github_repo_contributor.schema.js";

// Initialize MCP server
const server = new MCPServer({
  name: "mcp_github_app_2026",
  title: "mcp_github_app_2026",
  version: "1.0.0",
  description: "an mcp-use app",
  instructions: `You are a GitHub repository assistant. You have access to the following tools:
    1. get-repository-overview:
       Get repository details such as name, description, stars, forks, language, and open issues count.
    2. get-repository-open-issues:
       Fetch all open issues of a GitHub repository.
    3. get-repository-contributors:
       Fetch contributors of a GitHub repository.
    4. get-repository-pull-requests:
       Fetch open pull requests of a GitHub repository.
    Always ask for the repository owner and repository name if they are not provided.
    Select the appropriate tool based on the user's request.
  `,
});

// Register github overview tool with MCP server
export const GithubOverviewTool = server.tool(
  {
    name: "get-repository-overview",
    title: "get-repository-overview",
    description:
      "Call get-repository-overview to get github repository overview",
    inputSchema: AppInputType,
    outputSchema: GithubOverviewOutputSchema,
    view: {
      name: "repos",
    },
  },
  async ({ owner, repo }) => {
    const data = await fetchGithubOverviewDetails(owner, repo);
    const description = data.description || "No description found";
    const language = data.language || "No language found";
    const summary = `Name of the repo ${data.name} and description of the repo ${description} and language: ${language}, total number of star: ${data.stargazers_count}, total number of open issues: ${data.open_issues_count}, total number of forks: ${data.forks_count} and repo's html url: ${data.html_url}`;

    return {
      content: [{ type: "text", text: summary }],
      structuredContent: data,
    };
  }
);

// Register github open issue tool with MCP server
export const GithubOpenIssueTool = server.tool(
  {
    name: "get-repository-open-issues",
    title: "get-repository-open-issues",
    description: "This tool used to fetch details of github repo open issue",
    inputSchema: AppInputType,
    outputSchema: GithubOpenIssuesResponseSchema,
    view: {
      name: "issues",
    },
  },
  async ({ owner, repo }) => {
    const data = await fetchGithubOpenIssueTool(owner, repo);
    const summary = `
Found ${data.length} open issues in the repository ${owner}/${repo}.
${data
  .map(
    (issue, index) => `Issue ${index + 1}:
      - Issue Number: #${issue.number}
      - Title: ${issue.title}
      - Description: ${issue.body ?? "No description available"}
      - State: ${issue.state}
      - Created By: ${issue.user.login}
      - Labels: ${
        issue.labels.map((label) => label.name).join(", ") || "No labels"
      }
      - Total Comments: ${issue.comments}
      - Created At: ${issue.created_at}
      - Last Updated: ${issue.updated_at}
      - Issue URL: ${issue.html_url}`
  )
  .join("\n")}
`;
    return {
      content: [{ type: "text", text: summary }],
      structuredContent: {
        issues: data,
      },
    };
  }
);

// Register github contributors tool with MCP server
export const GithubRepoContributorTool = server.tool(
  {
    name: "get-repository-contributors",
    title: "get-repository-contributors",
    description: "This tool used to fetch github repository contributors list",
    inputSchema: AppInputType,
    outputSchema: GithubRepoContributorsResponseSchema,
    view: {
      name: "contributors",
    },
  },
  async ({ owner, repo }) => {
    const data = await fetchGithubContributors(owner, repo);
    const summary = `
Found ${data.length} contributors in the repository ${owner}/${repo}.

${data
  .map(
    (contributor, index) => `Contributor ${index + 1}:
      - Username: ${contributor.login}
      - GitHub ID: ${contributor.id}
      - Profile URL: ${contributor.html_url}
      - Avatar URL: ${contributor.avatar_url}
      - Account Type: ${contributor.type}
      - Site Admin: ${contributor.site_admin ? "Yes" : "No"}
      - Total Contributions: ${contributor.contributions}`
  )
  .join("\n\n")}
`;

    return {
      content: [{ type: "text", text: summary }],
      structuredContent: {
        contributors: data,
      },
    };
  }
);

export default server;
