import React, { useState, useEffect } from 'react';
import type { StaticPage, ContentMode } from '../types/content.types';
import { initialStaticPages } from '../data/mockContent';
import { StaticPagesList } from '../components/StaticPagesList';
import { ViewPageDetails } from '../components/ViewPageDetails';
import { EditPageForm } from '../components/EditPageForm';
import {
  fetchStaticPagesFromFirestore,
  updateStaticPageInFirestore,
  subscribeToStaticPages,
} from '../services/firebaseContentService';

export const ContentManagementPage: React.FC = () => {
  const [pages, setPages] = useState<StaticPage[]>(initialStaticPages);
  const [mode, setMode] = useState<ContentMode>('list');
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);

  // Load from Firestore and listen to real-time updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initFirestore = async () => {
      try {
        const data = await fetchStaticPagesFromFirestore();
        if (data && data.length > 0) {
          setPages(data);
        }

        // Subscribe to live Firestore updates
        unsubscribe = subscribeToStaticPages((livePages) => {
          if (livePages && livePages.length > 0) {
            setPages(livePages);
          }
        });
      } catch (err) {
        console.error('Firestore init error:', err);
      }
    };

    initFirestore();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Open View Mode
  const handleViewPage = (page: StaticPage) => {
    setSelectedPage(page);
    setMode('view');
  };

  // Open Edit Mode
  const handleEditPage = (page: StaticPage) => {
    setSelectedPage(page);
    setMode('edit');
  };

  // Save Edit Page to Firestore
  const handleSavePage = async (updatedPage: StaticPage) => {
    try {
      // Update locally immediately for fast UI response
      setPages((prev) =>
        prev.map((p) => (p.id === updatedPage.id ? updatedPage : p))
      );
      setSelectedPage(updatedPage);

      // Save to Cloud Firestore
      await updateStaticPageInFirestore(updatedPage);
    } catch (error) {
      console.error('Failed to update Firestore:', error);
    } finally {
      setMode('list');
    }
  };

  return (
    <div className="space-y-6">
      {/* List Mode */}
      {mode === 'list' && (
        <StaticPagesList
          pages={pages}
          onViewPage={handleViewPage}
          onEditPage={handleEditPage}
        />
      )}

      {/* View Details Mode */}
      {mode === 'view' && selectedPage && (
        <ViewPageDetails
          page={selectedPage}
          onBack={() => setMode('list')}
          onEdit={() => setMode('edit')}
        />
      )}

      {/* Edit Form Mode */}
      {mode === 'edit' && selectedPage && (
        <EditPageForm
          page={selectedPage}
          onSave={handleSavePage}
          onCancel={() => setMode('list')}
        />
      )}
    </div>
  );
};
