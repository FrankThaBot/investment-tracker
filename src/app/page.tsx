import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Investment Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track your portfolio, analyze performance, and prepare for different market scenarios.
          </p>
        </div>
        
        <Dashboard />
      </div>
    </main>
  );
}