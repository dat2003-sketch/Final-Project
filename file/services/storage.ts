import { supabase } from './supabase';
import { STORAGE_BUCKET } from '../utils/constants';

function extFromUri(uri: string) {
  const clean = uri.split('?')[0];
  const parts = clean.split('.');
  const ext = parts[parts.length - 1];
  return ext?.toLowerCase() || 'jpg';
}

export const storageService = {
  async uploadImage(uri: string, userId?: string): Promise<string | null> {
    const res = await fetch(uri);
    const blob = await res.blob();
    const ext = extFromUri(uri);
    const path = `${userId ?? 'public'}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, blob, { upsert: false, contentType: blob.type || `image/${ext}` });

    if (error) throw error;

    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
    return pub.publicUrl;
  },
};
