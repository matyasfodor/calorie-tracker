import './App.css'
import Layout from 'antd/lib/layout'
import { Content, Footer } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import 'antd/dist/antd.min.css'
import { Menu } from './components/Menu'
import { Header } from './components/Header'
import { MainContent } from './pages/MainContent'

function App() {
  return (
    <>
      <Layout>
        <Header />
        <Layout>
          <Sider>
            <Menu />
          </Sider>
          <Content>
            <MainContent />
          </Content>
        </Layout>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </>
  )
}

export default App
