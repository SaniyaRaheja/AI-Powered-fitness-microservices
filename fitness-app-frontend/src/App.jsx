
import './App.css'
import { BrowserRouter as Router,Navigate,Route,Routes,useLocation} from 'react-router-dom'
import { Button ,Box} from '@mui/material'
import {useDispatch } from 'react-redux'
import { AuthContext } from 'react-oauth2-code-pkce'
import { setCredentials } from './store/authSlice'
import { useContext, useEffect,useState } from 'react'
import ActivityList from './components/ActivityList.jsx'
import ActivityForm from './components/ActivityForm.jsx'
import ActivityDetails from './components/ActivityDetails.jsx'

const ActivitiesPage = () => {
    return (
      <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
        <ActivityForm onActivityAdded={()=>window.location.reload()}/>
        <ActivityList/>
      </Box>
    )
  }

function App() {

  const {token,tokenData, isAuthenticated, logIn, logOut}=useContext(AuthContext);
  const dispatch=useDispatch();
  const [authReady,setAuthReady]=useState(false);

  useEffect(()=>{
    if(token){
      dispatch(setCredentials({token,user:tokenData}));
      setAuthReady(true);
    }
  },[token,tokenData,dispatch])
  

  return (
    
    <Router>
      {!token ? (
        <Button variant='contained' color='primary' onClick={()=>{logIn()}}>Login</Button>
      ):(
        <div>
          <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
             <Routes>
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetails />} />
              <Route path="/" element={token?<Navigate to="/activities" replace />:<div>Welcome ! Please Login</div>} />
             </Routes>
          </Box>
        </div>)
}
      </Router>
    
  )
}

export default App

