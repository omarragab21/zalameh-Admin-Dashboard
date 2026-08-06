import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';
import type { StaticPage } from '../types/content.types';
import { initialStaticPages } from '../data/mockContent';

const COLLECTION_NAME = 'static_pages';

/**
 * Seed initial static pages (About, Terms, Privacy) into Firestore if missing.
 */
export const seedInitialStaticPages = async (): Promise<void> => {
  try {
    for (const page of initialStaticPages) {
      const docRef = doc(db, COLLECTION_NAME, page.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          ...page,
          updatedAt: serverTimestamp(),
        });
        console.log(`[Firestore] Seeded page: ${page.id} (${page.titleAr})`);
      }
    }
  } catch (error) {
    console.error('[Firestore] Error seeding static pages:', error);
    throw error;
  }
};

/**
 * Fetch all static pages from Cloud Firestore.
 * Automatically seeds Firestore if no documents are found.
 */
export const fetchStaticPagesFromFirestore = async (): Promise<StaticPage[]> => {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      console.log('[Firestore] Collection empty. Seeding initial pages...');
      await seedInitialStaticPages();
      return initialStaticPages;
    }

    const pages: StaticPage[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        titleAr: data.titleAr || '',
        titleEn: data.titleEn || '',
        pageHeaderAr: data.pageHeaderAr || '',
        pageHeaderEn: data.pageHeaderEn || '',
        lastUpdated: data.lastUpdated || new Date().toLocaleDateString('ar-EG'),
        contentAr: data.contentAr || '',
        contentEn: data.contentEn || '',
      };
    });

    return pages;
  } catch (error) {
    console.warn('[Firestore] Error fetching pages (falling back to initialStaticPages):', error);
    return initialStaticPages;
  }
};

/**
 * Update a static page (e.g. Terms of Use / Privacy Policy / About App) in Cloud Firestore.
 */
export const updateStaticPageInFirestore = async (page: StaticPage): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, page.id);
    const docSnap = await getDoc(docRef);

    const payload = {
      titleAr: page.titleAr,
      titleEn: page.titleEn,
      pageHeaderAr: page.pageHeaderAr,
      pageHeaderEn: page.pageHeaderEn,
      lastUpdated: page.lastUpdated,
      contentAr: page.contentAr,
      contentEn: page.contentEn,
      updatedAt: serverTimestamp(),
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, payload);
    } else {
      await setDoc(docRef, { ...payload, id: page.id });
    }
    console.log(`[Firestore] Updated page successfully: ${page.id}`);
  } catch (error) {
    console.error(`[Firestore] Error updating page ${page.id}:`, error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for static pages in Cloud Firestore.
 */
export const subscribeToStaticPages = (
  onUpdate: (pages: StaticPage[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(initialStaticPages);
        return;
      }

      const pages: StaticPage[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          titleAr: data.titleAr || '',
          titleEn: data.titleEn || '',
          pageHeaderAr: data.pageHeaderAr || '',
          pageHeaderEn: data.pageHeaderEn || '',
          lastUpdated: data.lastUpdated || '',
          contentAr: data.contentAr || '',
          contentEn: data.contentEn || '',
        };
      });

      onUpdate(pages);
    },
    (error) => {
      console.warn('[Firestore] Real-time listener error:', error);
      if (onError) onError(error);
    }
  );
};
