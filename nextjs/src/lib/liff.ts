'use client';

import liff from '@line/liff';

const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

if (!liffId) {
  throw new Error('LIFF ID is not defined');
}

export const initializeLiff = async () => {
  try {
    await liff.init({ liffId });
    return true;
  } catch (error) {
    console.error('LIFF initialization failed', error);
    return false;
  }
};

export const getLiffProfile = async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }
  
  try {
    const profile = await liff.getProfile();
    return profile;
  } catch (error) {
    console.error('Failed to get LIFF profile', error);
    return null;
  }
}; 