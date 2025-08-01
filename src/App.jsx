import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Main from './components/Main'
import Footer from './components/Footer'

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`;

      const today = (new Date()).toDateString();
      const localKey = `apod-${today}`;

      if (localStorage.getItem(localKey)) {
        const apiData = JSON.parse(localStorage.getItem(localKey));
        console.log('Using localStorage data');
        setData(apiData);
        return;
      }

      localStorage.clear();

      try {
        const response = await fetch(url);
        const apiData = await response.json();
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        console.log('Using API data');
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchAPIData();
  }, []);

  return (
    <>
        {data ? (<Main data={data} />): (
          <div className="loadingState">
            <i className="fa-solid fa-gear"></i>
          </div>
        )}
        {showModal && (
          <Sidebar data={data} handleToggleModal={handleToggleModal} />
        )}
        {data && (
          <Footer data={data} handleToggleModal={handleToggleModal} />
        )}
    </>
  )
}

export default App
