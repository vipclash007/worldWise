import { createContext,useEffect,useState,useContext, useReducer, useCallback } from "react";
import PropTypes from "prop-types";

const Base_url="http://localhost:8000";

const CitiesContext = createContext();

const initailState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error:"",
};

function reducer(state, action){
       switch (action.type) {
         case "loading":
           return {
            ...state,
             isLoading: true,
           };
         case "cities/loaded":
           return {
            ...state,
             cities: action.payload,
             isLoading: false,
           };
         case "city/loaded":
           return {
            ...state,
             currentCity: action.payload,
             isLoading: false,
           }
         case "city/created":
           return {
            ...state,
             cities: [...state.cities, action.payload],
             isLoading:false,
             currentCity: action.payload,
           };
         case "city/deleted":
           return {
            ...state,
            cities: state.cities.filter((city) => city.id!== action.payload),
             isLoading: false,
             currentCity: {},
           };
         case "rejected":
           return {
            ...state,
             isLoading: false,
             error: action.payload,
           };
         default:
           throw new Error("Unhandled action type");
       }
}


function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(reducer, initailState);
    // const [cities,setCities]= useState([]);
    // const [isLoading,setIsLoading]= useState(false);
    // const [currentCity, setCurrentCity] = useState({});
  
    useEffect(function(){
      async function fetchCities(){
        dispatch({type:"loading"});

        try{
          const res = await fetch(`${Base_url}/cities`);
          const data= await res.json();
          dispatch({type:"cities/loaded",payload:data});
        } catch(error){ 
          dispatch({type:"rejected",payload:"There was an error laoding cities..."})
        }
      }
      fetchCities();
    
    },[]);

  const getCity= useCallback( async function getCity(id){       //using usecallback to do memoizing stop to infinite loading(fetching) when getcity is called
    if (Number(id)=== currentCity.id) return;

    dispatch({type:"loading"});

        try{
            const res = await fetch(`${Base_url}/cities/${id}`);
            const data= await res.json();
           dispatch({type:"city/loaded",payload:data});
            console.log(data);
          }catch(error){ 
            dispatch({type:"rejected",payload:"There was an error laoding city..."})
          }
    },
    [currentCity.id]
);

    async function createCity(newCity){
      dispatch({type:"loading"});

      try{
          const res = await fetch(`${Base_url}/cities`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify(newCity)
          });
          const data= await res.json();
         
          dispatch({type:"city/created",payload:data});
        } catch(error){ 
          dispatch({type:"rejected",payload:"There was an error creating the city..."})
        }
  }

  async function deleteCity(id){
    dispatch({type:"loading"});

    try{
        const res = await fetch(`${Base_url}/cities/${id}`,{
          method:"DELETE",
        });
       
        dispatch({type:"city/deleted",payload:id});
      } catch(error){ 
        dispatch({type:"rejected",payload:"There was an error deleting the city..."})
      }
}

    return(
        <CitiesContext.Provider
         value={{
            cities,
            isLoading,
            currentCity,
            error,
            getCity,
            createCity,
            deleteCity
            }}
            >
            {children}
        </CitiesContext.Provider>
    )
}

CitiesProvider.propTypes = {
    children: PropTypes.node.isRequired
}

function useCities(){
    const context = useContext(CitiesContext);
    if(context===undefined){
        throw new Error("CitiesContext was used outside the CitiesProvider");
    }
    return context;
}

export {CitiesProvider, useCities};