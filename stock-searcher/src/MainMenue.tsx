import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { Search as SearchIcon } from '@mui/icons-material';

const SoccerDataTest = () => {
  const [teamData, setTeamData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const SearchBar = () => {
  
    const handleSearch = () => {
      // Implement your search logic here using the searchTerm state
      if (searchTerm.trim() !== ''){
        fetchTeamData(searchTerm);
      } 
    
    };
  
    return (
      <div>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </div>
    );
  };

  const fetchTeamData = (teamID) => {
    const apiKey = 'dcbbafaf17mshfa81437504a3302p12b9f2jsn3b790838cb47';
    const url = 'https://api-football-v1.p.rapidapi.com/v3/teams?id=${teamID}';
    const headers = {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    };

    fetch(url, { method: 'GET', headers: headers })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the response as JSON
      })
      .then(data => {
        if (data && data.response && data.response.length > 0) {
          console.log(data.response);
          // Access the team data within the response
          const teamInfo = data.response[0];
          setTeamData(teamInfo);
        } else {
          console.error('No team data found in response.');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    if (searchTerm) {
      fetchTeamData(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div>
      <SearchBar/>
      {teamData ? (
        <div>
          <h2>{teamData.team.name}</h2>
          <p>Country: {teamData.team.country}</p>
          <p>Founded: {teamData.team.founded}</p>
          <img src={teamData.team.logo} alt={`${teamData.team.name} logo`} />
        </div>
      ) : (
        <p>Loading team data...</p>
      )}
    </div>
  );
};

export default SoccerDataTest;






