
'use client';

import { useEffect, useState } from 'react';

export function getInitials(user) {
  const name =
    typeof user === 'string'
      ? user
      : user?.name || user?.fullName || user?.email || '';

  if (!name.trim()) return 'U';

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function useAuthUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const keys = [
      'authUser',
      'user',
      'currentUser',
      'auth_user',
    ];

    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;

        let parsed;

        try {
          parsed = JSON.parse(raw);
        } catch {
          continue;
        }

        if (
          parsed &&
          typeof parsed === 'object' &&
          (parsed.email || parsed.name || parsed.fullName)
        ) {
          setUser(parsed);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }

    setUser({});
  }, []);

  return user;
}
