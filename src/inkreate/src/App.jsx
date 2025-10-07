import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './layout/Header/Header.jsx'
import Splash from './pages/Splash/Splash.jsx'
import Authentication from './pages/Authentication/Authentication.jsx'
import Home from './pages/Home/Home.jsx'
import Search from './pages/Search/Search.jsx'
import Chat from './pages/Chat/Chat.jsx'
import WriteStory from './pages/WriteStory/WriteStory.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Settings/Settings.jsx'
import ReadStory from './pages/ReadStory/ReadStory.jsx'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/writeStory" element={<WriteStory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/readStory" element={<ReadStory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App