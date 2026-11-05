import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./layout/Header/Header.jsx";
import Splash from "./pages/Splash/Splash.jsx";
import Authentication from "./pages/Authentication/Authentication.jsx";
import Home from "./pages/Home/Home.jsx";
import Search from "./pages/Search/Search.jsx";
import Chat from "./pages/Chat/Chat.jsx";
import WriteStory from "./pages/WriteStory/WriteStory.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import ReadStory from "./pages/ReadStory/ReadStory.jsx";
import Bookmarked from "./pages/Bookmarked/Bookmarked.jsx";
import ReadLater from "./pages/ReadLater/ReadLater.jsx";
import Activity from "./pages/Activity/Activity.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { I18nProvider } from "./context/I18nContext.jsx";

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
  );
}

function AuthLayout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Splash />} />
              <Route path="/authentication" element={<Authentication />} />
            </Route>
            <Route element={<MainLayout />}>
              <Route
                path="/readStory/:storyId?/:segmentId?"
                element={<ReadStory />}
              />
              <Route
                path="/read-story/:storyId?/:segmentId?"
                element={<ReadStory />}
              />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/bookmarked" element={<Bookmarked />} />
              <Route path="/readLater" element={<ReadLater />} />
              <Route path="/writeStory" element={<WriteStory />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Activity />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
