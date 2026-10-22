import React, { useState } from 'react';
import { TradeProject, ViewTab, DeviceMode, SitePhoto, LineItem } from './types/offert';
import { INITIAL_PROJECTS } from './data/preloadedProjects';
import { DeviceToolbar } from './components/DeviceToolbar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { BookingView } from './views/BookingView';
import { FieldProtocolView } from './views/FieldProtocolView';
import { QuoteCalculatorView } from './views/QuoteCalculatorView';
import { BankIdReviewView } from './views/BankIdReviewView';
import { ArkivView } from './views/ArkivView';
import { SettingsView } from './views/SettingsView';
import { BankIdModal } from './components/BankIdModal';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { PhotoLightboxModal } from './components/PhotoLightboxModal';
import { LineItemEditorModal } from './components/LineItemEditorModal';

export default function App() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');
  const [projects, setProjects] = useState<TradeProject[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('villa-lindgren');
  const [currentTab, setCurrentTab] = useState<ViewTab>('protocol');

  // Modals state
  const [isBankIdModalOpen, setIsBankIdModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);
  const [editingLineItem, setEditingLineItem] = useState<LineItem | null>(null);
  const [isLineItemModalOpen, setIsLineItemModalOpen] = useState(false);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleUpdateActiveProject = (updated: Partial<TradeProject>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, ...updated } : p))
    );
  };

  const handleResetData = () => {
    setProjects(INITIAL_PROJECTS);
    setActiveProjectId('villa-lindgren');
    setCurrentTab('protocol');
  };

  const handleSignComplete = () => {
    handleUpdateActiveProject({
      status: 'signerad',
      signatureData: {
        method: 'direct_qr',
        signedAt: new Date().toLocaleDateString('sv-SE') + ' ' + new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
        signerName: activeProject.clientName,
        signerSsn: activeProject.clientSsn,
        ipAddress: '194.236.14.88 (Stockholm)',
        orderReference: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        fortnoxStatus: 'synkad',
        vismaStatus: 'synkad',
      },
    });
  };

  const handleTogglePhotoPdf = (photoId: string) => {
    const updatedPhotos = activeProject.photos.map((p) =>
      p.id === photoId ? { ...p, selectedForPdf: !p.selectedForPdf } : p
    );
    handleUpdateActiveProject({ photos: updatedPhotos });
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({ ...selectedPhoto, selectedForPdf: !selectedPhoto.selectedForPdf });
    }
  };

  const handleSaveLineItem = (item: LineItem) => {
    const exists = activeProject.lineItems.some((li) => li.id === item.id);
    let updated: LineItem[];
    if (exists) {
      updated = activeProject.lineItems.map((li) => (li.id === item.id ? item : li));
    } else {
      updated = [...activeProject.lineItems, item];
    }
    handleUpdateActiveProject({ lineItems: updated });
  };

  const handleDeleteLineItem = (id: string) => {
    const updated = activeProject.lineItems.filter((li) => li.id !== id);
    handleUpdateActiveProject({ lineItems: updated });
  };

  // Render view router
  const renderCurrentView = () => {
    switch (currentTab) {
      case 'booking':
        return (
          <BookingView
            project={activeProject}
            onUpdateProject={handleUpdateActiveProject}
            onProceedToProtocol={() => setCurrentTab('protocol')}
          />
        );
      case 'protocol':
        return (
          <FieldProtocolView
            project={activeProject}
            onUpdateProject={handleUpdateActiveProject}
            onProceedToCalculator={() => setCurrentTab('calculator')}
            onOpenPhotoLightbox={(photo) => setSelectedPhoto(photo)}
          />
        );
      case 'calculator':
        return (
          <QuoteCalculatorView
            project={activeProject}
            onUpdateProject={handleUpdateActiveProject}
            onProceedToReview={() => setCurrentTab('review')}
            onOpenLineItemEditor={(item) => {
              setEditingLineItem(item || null);
              setIsLineItemModalOpen(true);
            }}
          />
        );
      case 'review':
        return (
          <BankIdReviewView
            project={activeProject}
            onOpenBankIdModal={() => setIsBankIdModalOpen(true)}
            onOpenPdfPreview={() => setIsPdfModalOpen(true)}
            onUpdateProject={handleUpdateActiveProject}
          />
        );
      case 'archive':
        return (
          <ArkivView
            projects={projects}
            onSelectProject={(id) => {
              setActiveProjectId(id);
              setCurrentTab('calculator');
            }}
            onOpenPdf={(proj) => {
              setActiveProjectId(proj.id);
              setIsPdfModalOpen(true);
            }}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  const showBackButton = currentTab === 'calculator' || currentTab === 'review' || currentTab === 'booking';

  const handleBack = () => {
    if (currentTab === 'review') setCurrentTab('calculator');
    else if (currentTab === 'calculator') setCurrentTab('protocol');
    else if (currentTab === 'protocol') setCurrentTab('booking');
    else if (currentTab === 'booking') setCurrentTab('protocol');
  };

  return (
    <div className="min-h-screen bg-[#0e131b] flex flex-col items-center">
      {/* Top Device Switcher Toolbar */}
      <DeviceToolbar
        deviceMode={deviceMode}
        onDeviceChange={setDeviceMode}
        projects={projects}
        activeProjectId={activeProjectId}
        onProjectChange={(id) => setActiveProjectId(id)}
        onResetData={handleResetData}
        onOpenPdf={() => setIsPdfModalOpen(true)}
      />

      {/* Main Presentation Container */}
      <div className="w-full flex-1 flex justify-center items-start p-0 sm:py-6 sm:px-4">
        {/* MOBILE IPHONE FRAME */}
        {deviceMode === 'mobile' && (
          <div className="w-full max-w-[410px] min-h-screen sm:min-h-[850px] sm:max-h-[880px] bg-[#f9f9fe] sm:rounded-[42px] shadow-2xl flex flex-col relative overflow-hidden sm:border-[8px] sm:border-[#1e232d] sm:ring-1 sm:ring-slate-700/50">
            {/* Dynamic Island on Phone */}
            <div className="hidden sm:flex justify-center pt-2.5 pb-1 bg-transparent z-50">
              <div className="h-5 w-24 bg-black rounded-full flex items-center justify-between px-2 text-[9px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></span>
              </div>
            </div>

            {/* In-app Header */}
            <Header
              currentTab={currentTab}
              showBack={showBackButton}
              onBack={handleBack}
              onProfileClick={() => setCurrentTab('settings')}
            />

            {/* Scrollable View Content */}
            <main className="flex-1 overflow-y-auto">
              {renderCurrentView()}
            </main>

            {/* Mobile Bottom Navigation */}
            <BottomNav
              currentTab={currentTab}
              onTabChange={(tab) => setCurrentTab(tab)}
            />
          </div>
        )}

        {/* TABLET IPAD FRAME */}
        {deviceMode === 'tablet' && (
          <div className="w-full max-w-[820px] min-h-[900px] bg-[#f9f9fe] rounded-[32px] shadow-2xl flex flex-col relative overflow-hidden border-[10px] border-[#1e232d] ring-1 ring-slate-700/50">
            {/* Tablet Camera dot */}
            <div className="h-4 flex items-center justify-center bg-transparent z-50">
              <span className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></span>
            </div>

            {/* In-app Header */}
            <Header
              currentTab={currentTab}
              showBack={showBackButton}
              onBack={handleBack}
              onProfileClick={() => setCurrentTab('settings')}
            />

            {/* Scrollable View Content */}
            <main className="flex-1 overflow-y-auto p-2">
              {renderCurrentView()}
            </main>

            {/* Tablet Bottom Navigation */}
            <BottomNav
              currentTab={currentTab}
              onTabChange={(tab) => setCurrentTab(tab)}
            />
          </div>
        )}

        {/* FULL DESKTOP WORKSPACE LAYOUT */}
        {deviceMode === 'desktop' && (
          <div className="w-full max-w-6xl bg-[#f9f9fe] rounded-2xl shadow-xl flex flex-col border border-slate-800 overflow-hidden my-2">
            {/* Desktop Brand Navigation Bar */}
            <header className="bg-white border-b border-[#e8e8ed] px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1c20] text-white flex items-center justify-center font-bold text-xs">
                    OP
                  </div>
                  <div>
                    <span className="font-display text-lg font-bold text-[#1a1c20] leading-none block">
                      OffertPro
                    </span>
                    <span className="text-[10px] text-[#555e72] font-semibold tracking-wider uppercase">
                      Nordic Craft &amp; Quote
                    </span>
                  </div>
                </div>

                {/* Desktop Tabs */}
                <nav className="flex items-center gap-1 bg-[#eeedf3] p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('booking')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentTab === 'booking'
                        ? 'bg-white text-[#1a1c20] shadow-xs'
                        : 'text-[#555e72] hover:text-[#1a1c20]'
                    }`}
                  >
                    1. Boka kundbesök
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('protocol')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentTab === 'protocol'
                        ? 'bg-white text-[#1a1c20] shadow-xs'
                        : 'text-[#555e72] hover:text-[#1a1c20]'
                    }`}
                  >
                    2. Fältdokumentation
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('calculator')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentTab === 'calculator'
                        ? 'bg-white text-[#1a1c20] shadow-xs'
                        : 'text-[#555e72] hover:text-[#1a1c20]'
                    }`}
                  >
                    3. Kalkyl &amp; ROT
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('review')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentTab === 'review'
                        ? 'bg-white text-[#1a1c20] shadow-xs'
                        : 'text-[#555e72] hover:text-[#1a1c20]'
                    }`}
                  >
                    4. BankID Signering
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('archive')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentTab === 'archive'
                        ? 'bg-white text-[#1a1c20] shadow-xs'
                        : 'text-[#555e72] hover:text-[#1a1c20]'
                    }`}
                  >
                    Arkiv
                  </button>
                </nav>
              </div>

              {/* Status and Profile */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#eeedf3] rounded-full text-xs font-semibold text-[#44474d]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Fortnox &amp; Visma: Synk OK</span>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentTab('settings')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#4d5c78] hover:bg-[#3b537e] text-white text-xs font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">settings</span>
                  <span>Inställningar</span>
                </button>
              </div>
            </header>

            {/* Desktop View Content */}
            <main className="p-6">
              {renderCurrentView()}
            </main>
          </div>
        )}
      </div>

      {/* MODALS */}
      <BankIdModal
        project={activeProject}
        isOpen={isBankIdModalOpen}
        onClose={() => setIsBankIdModalOpen(false)}
        onSignComplete={handleSignComplete}
      />

      <PdfPreviewModal
        project={activeProject}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      <PhotoLightboxModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onTogglePdfInclude={handleTogglePhotoPdf}
      />

      <LineItemEditorModal
        item={editingLineItem}
        isOpen={isLineItemModalOpen}
        onClose={() => setIsLineItemModalOpen(false)}
        onSave={handleSaveLineItem}
        onDelete={handleDeleteLineItem}
      />
    </div>
  );
}
