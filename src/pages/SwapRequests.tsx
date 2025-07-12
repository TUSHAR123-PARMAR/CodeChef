import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  addDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { SwapRequest, Review } from '../types';
import { 
  Check, 
  X, 
  Clock, 
  Star, 
  MessageCircle, 
  Send,
  CheckCircle,
  XCircle 
} from 'lucide-react';

const SwapRequests: React.FC = () => {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<SwapRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;

    try {
      // Load incoming requests
      const incomingQuery = query(
        collection(db, 'swapRequests'),
        where('toUser', '==', user.uid)
      );
      const incomingSnapshot = await getDocs(incomingQuery);
      const incoming = incomingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SwapRequest[];

      // Load outgoing requests
      const outgoingQuery = query(
        collection(db, 'swapRequests'),
        where('fromUser', '==', user.uid)
      );
      const outgoingSnapshot = await getDocs(outgoingQuery);
      const outgoing = outgoingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SwapRequest[];

      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'swapRequests', requestId), {
        status: 'accepted'
      });
      loadRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'swapRequests', requestId), {
        status: 'rejected'
      });
      loadRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleCompleteRequest = async (request: SwapRequest) => {
    try {
      await updateDoc(doc(db, 'swapRequests', request.id), {
        status: 'completed'
      });
      setSelectedRequest(request);
      setShowFeedbackModal(true);
      loadRequests();
    } catch (error) {
      console.error('Error completing request:', error);
    }
  };

  const submitFeedback = async () => {
    if (!selectedRequest || !user || rating === 0) return;

    try {
      // Determine who to rate
      const ratedUserId = selectedRequest.fromUser === user.uid 
        ? selectedRequest.toUser 
        : selectedRequest.fromUser;
      
      const ratedUserName = selectedRequest.fromUser === user.uid
        ? selectedRequest.toUserName
        : selectedRequest.fromUserName;

      // Add review
      await addDoc(collection(db, 'reviews'), {
        fromUser: user.uid,
        toUser: ratedUserId,
        fromUserName: user.displayName,
        swapRequestId: selectedRequest.id,
        rating,
        comment,
        createdAt: new Date()
      });

      // Update user's average rating (this is a simplified approach)
      // In a real app, you might want to use Cloud Functions for this
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('toUser', '==', ratedUserId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviews = reviewsSnapshot.docs.map(doc => doc.data());
      
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await updateDoc(doc(db, 'users', ratedUserId), {
        rating: avgRating,
        reviewCount: reviews.length
      });

      setShowFeedbackModal(false);
      setRating(0);
      setComment('');
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <Star className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Swap Requests</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Incoming Requests */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Send className="h-5 w-5 text-blue-600" />
                <span>Incoming Requests ({incomingRequests.length})</span>
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {incomingRequests.length > 0 ? (
                incomingRequests.map(request => (
                  <div key={request.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {request.fromUserName}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Offers:</span> {request.skillOffered}</p>
                          <p><span className="font-medium">Wants:</span> {request.skillWanted}</p>
                          {request.message && (
                            <p><span className="font-medium">Message:</span> {request.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Check className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {request.status === 'accepted' && (
                      <button
                        onClick={() => handleCompleteRequest(request)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Star className="h-4 w-4" />
                        <span>Mark as Complete</span>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No incoming requests yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Outgoing Requests */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Send className="h-5 w-5 text-green-600 transform rotate-180" />
                <span>Outgoing Requests ({outgoingRequests.length})</span>
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {outgoingRequests.length > 0 ? (
                outgoingRequests.map(request => (
                  <div key={request.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {request.toUserName}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">You offer:</span> {request.skillOffered}</p>
                          <p><span className="font-medium">You want:</span> {request.skillWanted}</p>
                          {request.message && (
                            <p><span className="font-medium">Your message:</span> {request.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>

                    {request.status === 'accepted' && (
                      <button
                        onClick={() => handleCompleteRequest(request)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Star className="h-4 w-4" />
                        <span>Mark as Complete</span>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No outgoing requests yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rate Your Experience
              </h3>
              <p className="text-gray-600 mb-4">
                How was your skill swap with{' '}
                {selectedRequest.fromUser === user?.uid 
                  ? selectedRequest.toUserName 
                  : selectedRequest.fromUserName}?
              </p>

              {/* Star Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={submitFeedback}
                  disabled={rating === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapRequests;