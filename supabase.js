import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Put your Supabase values here:
const SUPABASE_URL = 'https://ucwzfwcdsgjeigridsnr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NEVFc6k_we3RYmFJhomGAg_0AWEQtOg';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUp(email,password){
  return await supabase.auth.signUp({email,password});
}
export async function signIn(email,password){
  return await supabase.auth.signInWithPassword({email,password});
}
export async function signOut(){ return await supabase.auth.signOut(); }

export async function createCup(data){
  const {data: userData}=await supabase.auth.getUser();
  if(!userData.user) throw new Error('ابتدا وارد حساب شوید');
  const slug=(data.name+'-'+Math.random().toString(36).slice(2,8))
    .toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g,'-');
  return await supabase.from('cups').insert({
    owner_id:userData.user.id, slug, ...data
  }).select().single();
}
export async function getCup(slug){
  return await supabase.from('cups').select('*').eq('slug',slug).single();
}
export async function registerPlayer(cupId,name){
  return await supabase.from('players').insert({cup_id:cupId,name}).select().single();
}
export async function getPlayers(cupId){
  return await supabase.from('players').select('*').eq('cup_id',cupId).order('created_at');
}
export async function getMatches(cupId){
  return await supabase.from('matches').select('*').eq('cup_id',cupId).order('round').order('position');
}
