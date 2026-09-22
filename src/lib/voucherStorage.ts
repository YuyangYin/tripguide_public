import { SHARED_TRIP_ID, supabase, VOUCHER_BUCKET } from './supabase';

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-100);

export async function uploadVoucherFile(file: File) {
  const path = `${SHARED_TRIP_ID}/${crypto.randomUUID()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from(VOUCHER_BUCKET).upload(path, file, {
    cacheControl: '3600', contentType: file.type || undefined, upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function getVoucherUrl(path: string) {
  const { data, error } = await supabase.storage.from(VOUCHER_BUCKET).createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteVoucherFile(path: string) {
  const { error } = await supabase.storage.from(VOUCHER_BUCKET).remove([path]);
  if (error) throw error;
}
