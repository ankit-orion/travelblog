import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Hero from './Components/Hero/Hero'
import Posts from './Components/Posts/Posts'
import Login from './Components/User/Login/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './Components/User/Register/Register'
function App() {

  return (
    <>
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path="/" element={<Hero/>}/>
    <Route path="/posts" element={<Posts/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
