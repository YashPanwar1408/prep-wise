import { Sidebar } from './sidebar';
import { fetchSidebarData } from '@/lib/api';

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch all topics with their lessons from API.
  // Fallback to empty list so transient backend issues don't crash the whole page.
  let topics = [];
  try {
    topics = await fetchSidebarData();
  } catch {
    // Keep layout stable even if sidebar API is temporarily unavailable.
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Left Sidebar */}
      <Sidebar topics={topics} />
      
      {/* Right Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
