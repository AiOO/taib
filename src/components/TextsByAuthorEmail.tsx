'use client';

import { useState } from 'react';
import { request } from 'graphql-request';
import {
  GetTextsByAuthorEmailDocument,
  type GetTextsByAuthorEmailQuery,
} from '@/graphql/generated';

export function TextsByAuthorEmail() {
  const [emailPattern, setEmailPattern] = useState('');
  const [data, setData] = useState<GetTextsByAuthorEmailQuery['getTextsByAuthorEmail'] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailPattern) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = `${window.location.origin}/api/graphql`;
      const result = await request(url, GetTextsByAuthorEmailDocument, {
        emailPattern,
      });
      setData(result.getTextsByAuthorEmail);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Search Texts by Author Email</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={emailPattern}
            onChange={(e) => setEmailPattern(e.target.value)}
            placeholder="Enter email pattern (e.g., %@example.com)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use % as wildcard (e.g., %@gmail.com for all Gmail users)
        </p>
      </form>

      {isLoading && <p className="text-gray-600">Loading...</p>}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error: {error.message}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Found {data.length} text(s)
          </p>

          {data.length === 0 ? (
            <p className="text-gray-500">No texts found for this email pattern</p>
          ) : (
            data.map((text) => (
              <div
                key={text.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">Text #{text.id}</h3>
                  {text.author && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{text.author.name || 'Unknown'}</p>
                      <p className="text-xs">{text.author.email}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Content:</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{text.content}</p>
                  </div>

                  {text.context && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Context:</p>
                      <p className="text-gray-600 text-sm">{text.context}</p>
                    </div>
                  )}

                  {text.instructions && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Instructions:</p>
                      <p className="text-gray-600 text-sm">{text.instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
