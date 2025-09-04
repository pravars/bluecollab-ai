import React, { useState } from 'react';
import { 
  User, 
  Star, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Shield,
  Award,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ShoppingCart
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Bid {
  id: string;
  contractorName: string;
  contractorRating: number;
  contractorReviews: number;
  bidAmount: number;
  timeline: string;
  description: string;
  profileImage: string;
  verified: boolean;
  experience: string;
  location: string;
  phone: string;
  email: string;
  submittedDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  materialEstimate?: {
    store: string;
    items: Array<{
      name: string;
      quantity: string;
      price: number;
    }>;
    total: number;
    storeLink: string;
  };
}

interface BidManagementProps {
  jobId: string;
}

export default function BidManagement({ jobId }: BidManagementProps) {
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [bids, setBids] = useState<Bid[]>([
    {
      id: '1',
      contractorName: 'Mike\'s Professional Painting',
      contractorRating: 4.9,
      contractorReviews: 127,
      bidAmount: 485,
      timeline: '3-4 days',
      description: 'I specialize in interior painting with 8+ years experience. I use premium Benjamin Moore paints and provide all necessary prep work including hole filling and surface preparation.',
      profileImage: 'https://images.unsplash.com/photo-1722876720000-f39b65b7d4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU2NDMxODgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true,
      experience: '8 years',
      location: '2.3 miles away',
      phone: '(555) 123-4567',
      email: 'mike@mikespainting.com',
      submittedDate: '2025-01-16T10:30:00',
      status: 'pending',
      materialEstimate: {
        store: 'Home Depot',
        items: [
          { name: 'Benjamin Moore Eggshell Paint (2 gallons)', quantity: '2', price: 89.98 },
          { name: 'Primer (1 gallon)', quantity: '1', price: 28.99 },
          { name: 'Brushes & Rollers Set', quantity: '1', price: 24.99 },
          { name: 'Drop Cloths', quantity: '2', price: 15.98 },
          { name: 'Painter\'s Tape', quantity: '3', price: 11.97 }
        ],
        total: 171.91,
        storeLink: 'https://homedepot.com/cart/xyz123'
      }
    },
    {
      id: '2',
      contractorName: 'Elite Home Services',
      contractorRating: 4.7,
      contractorReviews: 89,
      bidAmount: 520,
      timeline: '2-3 days',
      description: 'Full-service painting contractor offering premium finishes. We include color consultation and use eco-friendly paints. All work comes with a 2-year warranty.',
      profileImage: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc1NjQxMjI5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true,
      experience: '12 years',
      location: '1.8 miles away',
      phone: '(555) 987-6543',
      email: 'contact@elitehomeservices.com',
      submittedDate: '2025-01-16T14:15:00',
      status: 'pending',
      materialEstimate: {
        store: 'Lowes',
        items: [
          { name: 'Sherwin Williams ProClassic Paint (2 gallons)', quantity: '2', price: 95.98 },
          { name: 'High-Quality Primer (1 gallon)', quantity: '1', price: 32.99 },
          { name: 'Professional Brush Set', quantity: '1', price: 35.99 },
          { name: 'Premium Drop Cloths', quantity: '3', price: 23.97 },
          { name: 'Blue Tape Professional', quantity: '2', price: 16.98 }
        ],
        total: 205.91,
        storeLink: 'https://lowes.com/cart/abc456'
      }
    }
  ]);

  const handleAcceptBid = (bidId: string) => {
    setBids(bids.map(bid => 
      bid.id === bidId 
        ? { ...bid, status: 'accepted' }
        : { ...bid, status: bid.status === 'accepted' ? 'pending' : bid.status }
    ));
  };

  const handleRejectBid = (bidId: string) => {
    setBids(bids.map(bid => 
      bid.id === bidId ? { ...bid, status: 'rejected' } : bid
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const selectedBid = bids.find(bid => bid.id === selectedBidId);

  if (selectedBid) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedBidId(null)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <span>← Back to All Bids</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <ImageWithFallback
                  src={selectedBid.profileImage}
                  alt={selectedBid.contractorName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{selectedBid.contractorName}</h3>
                    {selectedBid.verified && (
                      <Shield className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{selectedBid.contractorRating}</span>
                      <span>({selectedBid.contractorReviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>{selectedBid.experience} experience</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(selectedBid.status)}`}>
                    {selectedBid.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">${selectedBid.bidAmount}</div>
                <div className="text-sm text-gray-600">{selectedBid.timeline}</div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Proposal Details</h4>
              <p className="text-gray-700 leading-relaxed mb-6">{selectedBid.description}</p>
            </div>
          </div>
        </div>

        {selectedBid.materialEstimate && (
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Material Estimate</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">HD</span>
                  </div>
                  <span className="font-semibold text-gray-700">{selectedBid.materialEstimate.store}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {selectedBid.materialEstimate.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-right font-semibold text-gray-800">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Materials Cost:</span>
                  <span className="text-green-600">${selectedBid.materialEstimate.total.toFixed(2)}</span>
                </div>
                <div className="mt-4">
                  <a
                    href={selectedBid.materialEstimate.storeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>View in {selectedBid.materialEstimate.store} Cart</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          {selectedBid.status === 'pending' && (
            <>
              <button
                onClick={() => handleAcceptBid(selectedBid.id)}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Accept Bid</span>
              </button>
              <button
                onClick={() => handleRejectBid(selectedBid.id)}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject Bid</span>
              </button>
            </>
          )}
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Send Message</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Bid Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">{bids.length}</div>
              <div className="text-sm text-gray-600">Total Bids</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">
                {bids.filter(bid => bid.status === 'accepted').length}
              </div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {bids.filter(bid => bid.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">
                ${Math.round(bids.reduce((acc, bid) => acc + bid.bidAmount, 0) / bids.length)}
              </div>
              <div className="text-sm text-gray-600">Avg. Bid</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">All Bids</h3>
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedBidId(bid.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <ImageWithFallback
                      src={bid.profileImage}
                      alt={bid.contractorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-800">{bid.contractorName}</h4>
                        {bid.verified && (
                          <Shield className="w-4 h-4 text-blue-600" />
                        )}
                        <span className={`px-2 py-1 rounded-full border text-xs font-semibold ${getStatusColor(bid.status)}`}>
                          {bid.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{bid.contractorRating} ({bid.contractorReviews})</span>
                        </div>
                        <span>{bid.experience} experience</span>
                        <span>{bid.location}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{bid.description}</p>
                      
                      {bid.materialEstimate && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ShoppingCart className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-semibold text-orange-800">
                                {bid.materialEstimate.store} Materials
                              </span>
                            </div>
                            <span className="text-sm font-bold text-orange-800">
                              ${bid.materialEstimate.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-green-600">${bid.bidAmount}</div>
                    <div className="text-sm text-gray-600">{bid.timeline}</div>
                    <div className="mt-3 flex space-x-2">
                      {bid.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptBid(bid.id);
                            }}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectBid(bid.id);
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}