import { BrowserRouter, Route, Routes } from "react-router-dom"
import Pricing from "./pages/Pricing"
import Product from "./pages/Product"
import Homepage from "./pages/Homepage"
import PageNotFound from "./pages/PageNotFound"
import AppLayout from "./pages/AppLayout"
import Login from "./pages/Login"
import CityList from "./components/CityList"
import { useEffect, useState } from "react"

const Base_url="http://localhost:8000";

function App() {
  const [cities,setCities]= useState([]);
  const [isLoading,setIsLoading]= useState(false);

  useEffect(function(){
    async function fetchCities(){
      try{
        setIsLoading(true);
        const res = await fetch(`${Base_url}/cities`);
        const data= await res.json();
        setCities(data);
        console.log(data);
      } catch(error){ 
        alert("There was an error loading data...");
      } finally{
        setIsLoading(false);
      }
    }
    fetchCities
  
  },[])
  return (
   <BrowserRouter>
      <Routes>
          <Route index element={<Homepage/>} />
          <Route path="product" element={<Product/>} />
          <Route path="pricing" element={<Pricing/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="app" element={<AppLayout/>}>
            <Route index element={<CityList cities={cities} isLoading={isLoading}/>} />
            <Route path="cities" element={<CityList cities={cities} isLoading={isLoading}/>}/>
            <Route path="countries" element={<p>Countries</p>}/>
            <Route path="form" element={<p>Form</p>}/>
          </Route>
          <Route path="*" element={<PageNotFound/>} />
      </Routes>
   </BrowserRouter>
  )
}

export default App
