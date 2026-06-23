import DashboardShell from '@/components/dashboard/DashboardShell'

export const metadata = {
  title: 'Dashboard | KOI Health',
  description: 'KOI Health-first Commerce Brand Dashboard',
}

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>
}
