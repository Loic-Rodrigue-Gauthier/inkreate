import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './layout/Header/Header.jsx';
import Splash from './pages/Splash/Splash.jsx';
import Authentication from './pages/Authentication/Authentication.jsx';
import Home from './pages/Home/Home.jsx';
import Search from './pages/Search/Search.jsx';
import Chat from './pages/Chat/Chat.jsx';
import WriteStory from './pages/WriteStory/WriteStory.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Settings from './pages/Settings/Settings.jsx';
import ReadStory from './pages/ReadStory/ReadStory.jsx';
import Bookmarked from './pages/Bookmarked/Bookmarked.jsx';
import ReadLater from './pages/ReadLater/ReadLater.jsx';
import Activity from './pages/Activity/Activity.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

function MainLayout() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

function AuthLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Splash />} />
              <Route path="/authentication" element={<Authentication />} />
            </Route>
            <Route element={<MainLayout />}>
              <Route path="/readStory" element={<ReadStory />} />
              <Route path="/read-story" element={<ReadStory />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/bookmarked" element={<Bookmarked />} />
              <Route path="/readLater" element={<ReadLater />} />
              <Route path="/writeStory" element={<WriteStory />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
