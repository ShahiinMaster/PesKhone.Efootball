import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ucwzfwcdsgjeigridsnr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NEVFc6k_we3RYmFJhomGAg_0AWEQtOg';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUp(email,password){
  return await supabase.auth.signUp({email: String(email).trim(), password});
}
export async function signIn(email,password){
  return await supabase.auth.signInWithPassword({email: String(email).trim(), password});
}
export async function signOut(){ return await supabase.auth.signOut(); }

export async function createCup({cupName, capacity, fee, prize}){
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) return { data:null, error:authError };
  if (!authData?.user) return { data:null, error:new Error('ابتدا وارد حساب شوید') };

  const cleanName = String(cupName ?? '').trim();
  const cleanCapacity = Number(capacity);
  const cleanFee = String(fee ?? '').trim();
  const cleanPrize = String(prize ?? '').trim();
  if (!cleanName) return { data:null, error:new Error('نام کاپ را وارد کنید') };
  if (![4,8,16,32].includes(cleanCapacity)) return { data:null, error:new Error('ظرفیت باید 4، 8، 16 یا 32 باشد') };

  // ساخت کاپ از طریق RPC تا owner_id و name داخل خود دیتابیس تعیین شوند.
  const { data, error } = await supabase.rpc('create_cup', {
    p_name: cleanName,
    p_capacity: cleanCapacity,
    p_fee: cleanFee || 'رایگان',
    p_prize: cleanPrize || '-'
  });

  if (error) return { data:null, error };
  return { data, error:null };
}

export async function getCup(slug){
  return await supabase.from('cups').select('*').eq('slug',String(slug).trim()).single();
}
export async function registerPlayer(cupId,name){
  const cleanName=String(name ?? '').trim();
  if(!cleanName) return {data:null,error:new Error('نام بازیکن را وارد کنید')};
  return await supabase.from('players').insert({cup_id:cupId,name:cleanName}).select().single();
}
export async function getPlayers(cupId){
  return await supabase.from('players').select('*').eq('cup_id',cupId).order('created_at');
}
export async function getMatches(cupId){
  return await supabase.from('matches').select('*').eq('cup_id',cupId).order('round').order('position');
}
