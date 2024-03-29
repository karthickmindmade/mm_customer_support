import React, { useEffect, useState ,useContext} from 'react';
import { CounterContext } from '../../contex/adminProvider';
import Axios from "axios";
import { ListContext } from '../../contex/ListProvider';

export default function DesignTeamList(props) {
 
  const { addTeammember } = useContext(CounterContext);
const{selectedteam}=props
const{team}=useContext(ListContext)

  return (
      <div>
        {selectedteam==="x" ? <div className='text-midle'>Select Team</div>:<> {team===undefined ? <></>:<>  {team.filter(val => {
             return val.Team.toLowerCase().includes(selectedteam.toLowerCase())
           }).map((teams) =>
        <div className='flex team-list-input' key={teams.teamId}>
        <button className='team-assign-list'  onClick={()=>addTeammember(teams.teamId)}>{teams.Email}</button>
        </div>
         )}</>
        } </>}
      
      </div>
  );
}