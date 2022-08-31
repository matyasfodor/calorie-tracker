import './App.css';
import Layout  from 'antd/lib/layout';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import "antd/dist/antd.min.css";
import { Menu } from './components/Menu';
import { MainContent } from './pages/MainContent';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <>
      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider><Menu/></Sider>
          <Content><MainContent/></Content>
        </Layout>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </>
  );
}

export default App;
