/** @format */

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToolContext } from "mcp-use/react";
import "./view.css";

type IssueUser = {
  login: string;
  avatar_url: string;
  html_url: string;
};

function UserAvatar({ user }: { user: IssueUser }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className='issue-user'>
      {!imageFailed && user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.login}
          className='issue-avatar'
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className='issue-avatar-fallback'>
          {user.login?.charAt(0).toUpperCase() || "?"}
        </div>
      )}

      <span>{user.login}</span>
    </div>
  );
}

export default function OpenIssuesView() {
  const { status, toolOutput, error } =
    useToolContext<"get-repository-open-issues">();

  const [search, setSearch] = useState("");

  if (status === "pending") {
    return (
      <main className='issues-container'>
        <div className='issues-message'>
          <h2>Loading Open Issues...</h2>
          <p>Please wait while we fetch GitHub issues.</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className='issues-container'>
        <div className='issues-message'>
          <h2>Failed to load issues</h2>
          <p className='issues-error'>
            {error?.message || "Something went wrong."}
          </p>
        </div>
      </main>
    );
  }

  const issues = toolOutput?.issues ?? [];

  const filteredIssues = issues.filter((issue) =>
    `${issue.title} ${issue.number} ${issue.user.login}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className='issues-container'>
      <header className='issues-header'>
        <div>
          <h2>Open Issues</h2>
          <p>Track and explore repository issues</p>
        </div>

        <span className='issues-count'>{issues.length} Open</span>
      </header>

      <input
        type='search'
        className='issues-search'
        placeholder='Search by title, issue number or username...'
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {filteredIssues.length === 0 ? (
        <div className='issues-empty'>
          <h3>No issues found</h3>
          <p>
            {issues.length === 0
              ? "This repository has no open issues."
              : "Try another search keyword."}
          </p>
        </div>
      ) : (
        <section className='issues-list'>
          {filteredIssues.map((issue) => (
            <article key={issue.id} className='issue-card'>
              <div className='issue-card-header'>
                <div className='issue-heading'>
                  <h3>{issue.title}</h3>
                  <span className='issue-number'>#{issue.number}</span>
                </div>

                <span className='issue-open-badge'>Open</span>
              </div>

              <div className='issue-description'>
                {issue.body ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ ...props }) => (
                        <a
                          {...props}
                          target='_blank'
                          rel='noopener noreferrer'
                        />
                      ),
                    }}>
                    {issue.body}
                  </ReactMarkdown>
                ) : (
                  <p className='issue-no-description'>
                    No description available.
                  </p>
                )}
              </div>

              {issue.labels.length > 0 && (
                <div className='issue-labels'>
                  {issue.labels.map((label) => (
                    <span
                      key={label.id}
                      className='issue-label'
                      style={{
                        backgroundColor: `#${label.color}20`,
                        color: `#${label.color}`,
                        borderColor: `#${label.color}70`,
                      }}>
                      {label.name}
                    </span>
                  ))}
                </div>
              )}

              <div className='issue-footer'>
                <UserAvatar user={issue.user} />

                <div className='issue-meta'>
                  <span>💬 {issue.comments} comments</span>

                  <span>
                    Updated {new Date(issue.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                className='issue-view-button'
                onClick={() => {
                  window.open(issue.html_url, "_blank", "noopener,noreferrer");
                }}>
                View Issue ↗
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
