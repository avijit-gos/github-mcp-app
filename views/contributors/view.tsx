/** @format */

import { useToolContext } from "mcp-use/react";

type Contributor = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  contributions: number;
};

type ContributorsOutput = {
  contributors: Contributor[];
};

export default function ContributorsView() {
  const { toolOutput } = useToolContext();

  const output = toolOutput as unknown as ContributorsOutput;

  const contributors = output?.contributors ?? [];

  return (
    <div className='w-full space-y-5 p-4'>
      {/* Header */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-xl font-bold'>Repository Contributors</h2>
          <p className='text-sm text-gray-500'>
            People who contributed to this repository
          </p>
        </div>

        <div className='rounded-lg border px-4 py-2'>
          <p className='text-xs text-gray-500'>Total Contributors</p>
          <p className='text-2xl font-bold'>{contributors.length}</p>
        </div>
      </div>

      {/* Empty State */}
      {contributors.length === 0 ? (
        <div className='rounded-xl border p-8 text-center'>
          <p className='font-semibold'>No contributors found</p>
          <p className='mt-1 text-sm text-gray-500'>
            This repository has no contributor data available.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className='rounded-xl border p-4 transition-shadow hover:shadow-md'>
              {/* Contributor Info */}
              <div className='flex items-center gap-3'>
                <img
                  src={contributor.avatar_url}
                  alt={`${contributor.login}'s avatar`}
                  className='h-14 w-14 rounded-full border object-cover'
                />

                <div className='min-w-0 flex-1'>
                  <h3 className='truncate font-semibold'>
                    {contributor.login}
                  </h3>

                  <p className='text-xs text-gray-500'>ID: {contributor.id}</p>

                  <a
                    href={contributor.html_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-blue-500 hover:underline'>
                    View GitHub Profile ↗
                  </a>
                </div>
              </div>

              <div className='my-4 border-t' />

              {/* Contributor Details */}
              <div className='grid grid-cols-2 gap-3'>
                <div className='rounded-lg bg-gray-100 p-3 dark:bg-gray-800'>
                  <p className='text-xs text-gray-500'>Contributions</p>
                  <p className='text-xl font-bold'>
                    {contributor.contributions.toLocaleString()}
                  </p>
                </div>

                <div className='rounded-lg bg-gray-100 p-3 dark:bg-gray-800'>
                  <p className='text-xs text-gray-500'>Account Type</p>
                  <p className='mt-1 font-semibold'>{contributor.type}</p>
                </div>
              </div>

              {/* Admin Status */}
              <div className='mt-3 flex items-center justify-between'>
                <span className='text-sm text-gray-500'>Site Admin</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    contributor.site_admin
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                  {contributor.site_admin ? "Yes" : "No"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
