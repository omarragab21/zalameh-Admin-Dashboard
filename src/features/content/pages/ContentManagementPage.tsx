import React, { useState } from 'react';
import type { StaticPage, ContentMode } from '../types/content.types';
import { initialStaticPages } from '../data/mockContent';
import { StaticPagesList } from '../components/StaticPagesList';
import { ViewPageDetails } from '../components/ViewPageDetails';
import { EditPageForm } from '../components/EditPageForm';

export const ContentManagementPage: React.FC = () => {
  const [pages, setPages] = useState<StaticPage[]>(initialStaticPages);
  const [mode, setMode] = useState<ContentMode>('list');
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);

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

  // Save Edit Page
  const handleSavePage = (updatedPage: StaticPage) => {
    setCategoriesState(updatedPage);
  };

  const setCategoriesState = (updatedPage: StaticPage) => {
    setPages((prev) =>
      prev.map((p) => (p.id === updatedPage.id ? updatedPage : p))
    );
    setSelectedPage(updatedPage);
    setMode('list');
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
