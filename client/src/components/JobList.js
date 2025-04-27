import React, { useState, useEffect } from 'react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    fetch('http://localhost:5000/api/jobs', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`, // Ensure this is included
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }, []); // This runs once when the component is mounted

  return (
    <ul>
      {jobs.map((job, index) => (
        <li key={index}>
          {job.title}: {job.description}
        </li>
      ))}
    </ul>
  );
};

export default JobList;
