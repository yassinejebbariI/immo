import { create } from 'zustand';
import { supabase, type User } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          set({ user: userData as User });
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      set({ loading: false });
    }
  }
}));
