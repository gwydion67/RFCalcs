import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element >
            <Route index element />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
