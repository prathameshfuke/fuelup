import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GuestUser {
    id: string;
    isGuest: boolean;
    name: string;
    createdAt: string;
}

interface AuthStore {
    user: GuestUser | null;
    isAuthenticated: boolean;
    signInAsGuest: () => void;
    signOut: () => void;
    setUser: (user: GuestUser | null) => void;
}

function generateGuestId() {
    return 'guest_' + Math.random().toString(36).substring(2, 15);
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            signInAsGuest: () =>
                set({
                    user: {
                        id: generateGuestId(),
                        isGuest: true,
                        name: 'Guest',
                        createdAt: new Date().toISOString(),
                    },
                    isAuthenticated: true,
                }),
            signOut: () => set({ user: null, isAuthenticated: false }),
            setUser: (user) => set({ user, isAuthenticated: !!user }),
        }),
        {
            name: 'fuelup-auth-store',
        }
    )
);
