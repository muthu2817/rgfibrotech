'use client';

import { useQuery } from '@tanstack/react-query';

// fetcher function accepts the URL
const fetchLocalUsers = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
};

// custom hook accepts the URL and passes it to the query function
export const useDataFetch = (url) => {
  return useQuery({
    queryKey: ['DTO', url], // add url to queryKey to make it unique
    queryFn: () => fetchLocalUsers(url), // pass the url to the function
    enabled: !!url, // ensures query only runs when url is not falsy
  });
};
