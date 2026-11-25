/** @format */
import { MCPServer } from "mcp-use";
import { AppInputType } from "./src/schemas/main.schema.js";
import { GithubOverviewOutputSchema } from "./src/schemas/github_repo_overview.schema.js";
import { fetchGithubOverviewDetails } from "./src/tools/github_repo_overview.tool.js";

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

export default server;
