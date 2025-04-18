import { Header } from "@/lib"
import Footer from "@/components/footer"

function Layout({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
