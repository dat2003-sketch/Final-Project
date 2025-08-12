import { supabase } from './supabase';

export interface ListingPayload {
  title: string;
  description: string;
  price: number;
  image_url?: string | null;
  category: string;
  condition: string;
}

export const listingsService = {
  async search(params?: { search?: string }) {
    let q = supabase.from('listings').select('*').eq('is_available', true).order('created_at', { ascending: false });
    if (params?.search) { q = q.ilike('title', `%${params.search}%`); }
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async byUser(userId?: string) {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async get(id: string) {
    const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createListing(payload: ListingPayload & { image_url?: string | null }) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('listings')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateListing(id: string, patch: Partial<ListingPayload>) {
    const { data, error } = await supabase
      .from('listings')
      .update({ ...patch })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteListing(id: string) {
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) throw error;
  },
};
