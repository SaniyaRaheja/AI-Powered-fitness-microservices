import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getActivityDetail } from "../services/api";
import { Typography } from "@mui/material";
import { Typography } from "@mui/material";

function ActivityDetails() {

const {id}=useParams();
const [activity,setActivity]=React.useState(null);
const [recommendation,setRecommendation]=React.useState(null);

useEffect(()=>{
    const fetchActivityDetail=async()=>{
        try{
            const response=await getActivityDetail(id);
            setActivity(response.data);
            setRecommendation(response.data.recommendation);
        }
        catch(error){
            console.error("Error fetching activity details:", error);
        }
        fetchActivityDetail();

    }},[id])

    if(!activity){
        return <Typography>Loading...</Typography>
    }

  return (
    <div>Activity detail</div>
  );
}
export default ActivityDetails;