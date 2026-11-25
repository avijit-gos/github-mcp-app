/** @format */

import { ThemeProvider, ErrorBoundary, useToolContext } from "mcp-use/react";
import type { GithubOverviewOutputType } from "../../src/types/github_repo_overview.type.js";

function RepositoryContent() {
  const { status, toolOutput, toolInput, error } =
    useToolContext<"get-repository-overview">();

  // Loading state
  if (status === "pending") {
    return (
      <main style={styles.container}>
        <div style={styles.card}>
          <p>Fetching repository details...</p>
          <p style={styles.muted}>Please wait while we connect to GitHub.</p>
        </div>
      </main>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <main style={styles.container}>
        <div style={styles.errorCard}>
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
        </div>
      </main>
    );
  }

  // Success state
  const repo = toolOutput as GithubOverviewOutputType;

  const stats = [
    {
      label: "Stars",
      value: repo.stargazers_count.toLocaleString(),
      icon: "⭐",
    },
    {
      label: "Forks",
      value: repo.forks_count.toLocaleString(),
      icon: "🍴",
    },
    {
      label: "Open Issues",
      value: repo.open_issues_count.toLocaleString(),
      icon: "🔵",
    },
  ];

  return (
    <main style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>GITHUB REPOSITORY</p>
          <h1 style={styles.title}>{repo.name}</h1>
          <p style={styles.description}>
            {repo.description || "No description available"}
          </p>
        </div>

        <span style={styles.language}>{repo.language || "Unknown"}</span>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <span style={styles.statIcon}>{stat.icon}</span>
            <p style={styles.statLabel}>{stat.label}</p>
            <h2 style={styles.statValue}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Repository information */}
      <div style={styles.infoCard}>
        <h3 style={styles.sectionTitle}>Repository Information</h3>

        <div style={styles.infoRow}>
          <span style={styles.muted}>Repository Name</span>
          <strong>{repo.name}</strong>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.muted}>Primary Language</span>
          <strong>{repo.language || "Not specified"}</strong>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.muted}>Total Stars</span>
          <strong>{repo.stargazers_count.toLocaleString()}</strong>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.muted}>Total Forks</span>
          <strong>{repo.forks_count.toLocaleString()}</strong>
        </div>
      </div>

      {/* Action buttons */}
      <div style={styles.actions}>
        <a
          href={repo.html_url}
          target='_blank'
          rel='noopener noreferrer'
          style={styles.primaryButton}>
          View GitHub ↗
        </a>

        <a
          href={`${repo.html_url}/issues`}
          target='_blank'
          rel='noopener noreferrer'
          style={styles.secondaryButton}>
          Open Issues ↗
        </a>
      </div>
    </main>
  );
}

export default function RepositoryView() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <RepositoryContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    background: "var(--mcp-theme-background, Canvas)",
    color: "var(--mcp-theme-foreground, CanvasText)",
    fontFamily: "Inter, sans-serif",
    maxWidth: "850px",
    margin: "0 auto",
  },

  card: {
    padding: "24px",
    border: "1px solid var(--mcp-border, #8884)",
    borderRadius: "14px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  eyebrow: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    opacity: 0.6,
  },

  title: {
    fontSize: "28px",
    fontWeight: 750,
    margin: "8px 0",
  },

  description: {
    fontSize: "14px",
    opacity: 0.7,
    lineHeight: 1.6,
  },

  language: {
    padding: "7px 12px",
    borderRadius: "20px",
    border: "1px solid var(--mcp-border, #8884)",
    fontSize: "12px",
    fontWeight: 600,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },

  statCard: {
    padding: "18px",
    border: "1px solid var(--mcp-border, #8884)",
    borderRadius: "14px",
    background: "var(--mcp-card, transparent)",
  },

  statIcon: {
    fontSize: "22px",
  },

  statLabel: {
    fontSize: "13px",
    opacity: 0.65,
    marginBottom: "6px",
  },

  statValue: {
    fontSize: "25px",
    fontWeight: 750,
    margin: 0,
  },

  infoCard: {
    padding: "20px",
    border: "1px solid var(--mcp-border, #8884)",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  sectionTitle: {
    fontSize: "16px",
    marginTop: 0,
    marginBottom: "18px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid var(--mcp-border, #8883)",
    fontSize: "13px",
  },

  muted: {
    opacity: 0.65,
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  primaryButton: {
    padding: "11px 18px",
    background: "#2563eb",
    color: "#ffffff",
    borderRadius: "9px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
  },

  secondaryButton: {
    padding: "11px 18px",
    border: "1px solid var(--mcp-border, #8884)",
    color: "var(--mcp-theme-foreground, CanvasText)",
    borderRadius: "9px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
  },

  errorCard: {
    padding: "24px",
    border: "1px solid #ef4444",
    borderRadius: "14px",
    color: "#ef4444",
  },
};
