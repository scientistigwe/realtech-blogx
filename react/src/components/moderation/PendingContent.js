// import React from "react";
// import { Container, Row, Col, Button, Alert } from "react-bootstrap";
// import PostCard from "./../../components/Posts/PostCard"; // Adjust import path as necessary
// import { usePendingContent } from "./../../hooks/useModeration"; // Adjust import path as necessary

// const PendingContent = () => {
//   const { pendingContent, loading, error, approveContent, rejectContent } =
//     usePendingContent();

//   if (loading) {
//     return <div className="text-center mt-4">Loading pending content...</div>;
//   }

//   if (error) {
//     return (
//       <Alert variant="danger" className="mt-4">
//         Error: {error}
//       </Alert>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <h1>Pending Content</h1>
//       <Row>
//         <Col>
//           {pendingContent.length > 0 ? (
//             pendingContent.map((content) => (
//               <div key={content.id} className="mb-3">
//                 <PostCard post={content} />
//                 <Button
//                   variant="success"
//                   className="me-2"
//                   onClick={() => approveContent(content.id)}
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() => rejectContent(content.id)}
//                 >
//                   Reject
//                 </Button>
//               </div>
//             ))
//           ) : (
//             <div>No content pending moderation.</div>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default PendingContent;
