// import React, { useEffect, useState } from "react";

// function RealTimeRecommendations() {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8000/ws/recommendations");

//     socket.onmessage = (event) => {
//       const recommendation = JSON.parse(event.data);
//       setMessages((prevMessages) => [...prevMessages, recommendation]);
//     };

//     return () => socket.close();
//   }, []);

//   return (
//     <div>
//       <h2>Real-Time Recommendations</h2>
//       <ul>
//         {messages.map((rec, index) => (
//           <li key={index}>{rec}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default RealTimeRecommendations;
