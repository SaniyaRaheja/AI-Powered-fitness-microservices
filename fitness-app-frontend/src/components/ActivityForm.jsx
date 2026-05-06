import { Box, FormControl, InputLabel, MenuItem, Select,TextField,Button } from "@mui/material";
import { addActivity } from "../services/api"
import React from "react";


function ActivityForm({onActivityAdded}) {

    const [activity,setActivity]=React.useState({type:"RUNNING",duration:0,caloriesBurned:'',additionalMetrics:{}});


    const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
        await addActivity(activity);
        onActivityAdded();
        console.log("Activity added successfully");
        setActivity({type:"RUNNING",duration:0,caloriesBurned:'',additionalMetrics:{}});
    } catch (error) {
        console.error("Error submitting activity:", error);
    }
}

  return (
   <Box component="form" sx={{mb:4}} onSubmit={handleSubmit}>
     <FormControl fullWidth sx={{mb:2}}>
        <InputLabel>Activity Type</InputLabel>

        <Select 
            value={activity.type} 
            onChange={(e)=>setActivity({...activity,type:e.target.value})}>
                <MenuItem value="RUNNING">Running</MenuItem>
                <MenuItem value="CYCLING">Cycling</MenuItem>
                <MenuItem value="SWIMMING">Swimming</MenuItem>
        </Select>

        <TextField 
                fullWidth 
                label="Duration (minutes)" 
                type="number" 
                sx={{mb:2}} 
                value={activity.duration} 
                onChange={(e)=>setActivity({...activity,duration:Number(e.target.value)})} />

        <TextField 
                fullWidth 
                label="Calories Burned" 
                type="number" 
                sx={{mb:2}} 
                value={activity.caloriesBurned} 
                onChange={(e)=>setActivity({...activity,caloriesBurned:Number(e.target.value)})} />

        <Button variant="contained" color="primary" type="submit">Add Activity</Button>
     </FormControl>
   </Box>
  );
}

export default ActivityForm;