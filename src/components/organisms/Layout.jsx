import Sidebar from '@/components/molecules/Sidebar'
import BottomNavigation from '@/components/molecules/BottomNavigation'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  )
}

export default Layout