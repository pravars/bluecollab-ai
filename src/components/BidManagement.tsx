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
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
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
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
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
    },
    {
      id: '3',
      contractorName: 'QuickPaint Solutions',
      contractorRating: 4.2,
      contractorReviews: 45,
      bidAmount: 350,
      timeline: '1-2 days',
      description: 'Fast and affordable painting services. Perfect for straightforward jobs. We provide basic prep work and use quality materials for lasting results.',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      verified: false,
      experience: '4 years',
      location: '5.2 miles away',
      phone: '(555) 456-7890',
      email: 'info@quickpaint.com',
      submittedDate: '2025-01-17T09:45:00',
      status: 'pending',
      materialEstimate: {
        store: 'Home Depot',
        items: [
          { name: 'Behr Premium Paint (2 gallons)', quantity: '2', price: 69.98 },
          { name: 'Basic Primer (1 gallon)', quantity: '1', price: 22.99 },
          { name: 'Standard Brush & Roller Kit', quantity: '1', price: 18.99 },
          { name: 'Basic Drop Cloths', quantity: '2', price: 9.98 }
        ],
        total: 121.94,
        storeLink: 'https://homedepot.com/cart/def789'
      }
    },
    {
      id: '4',
      contractorName: 'Premium Paint Co.',
      contractorRating: 4.8,
      contractorReviews: 156,
      bidAmount: 595,
      timeline: '4-5 days',
      description: 'High-end painting services with premium materials and detailed prep work. We specialize in luxury finishes and offer a 5-year warranty on all work.',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      verified: true,
      experience: '15 years',
      location: '3.1 miles away',
      phone: '(555) 234-5678',
      email: 'info@premiumpaintco.com',
      submittedDate: '2025-01-17T11:20:00',
      status: 'pending',
      materialEstimate: {
        store: 'Menards',
        items: [
          { name: 'Benjamin Moore Aura Paint (2 gallons)', quantity: '2', price: 119.98 },
          { name: 'Premium Bonding Primer (1 gallon)', quantity: '1', price: 38.99 },
          { name: 'Purdy Professional Brush Set', quantity: '1', price: 45.99 },
          { name: 'Canvas Drop Cloths (12x15)', quantity: '2', price: 29.98 },
          { name: '3M ScotchBlue Tape', quantity: '4', price: 23.96 },
          { name: 'Sanding Block Set', quantity: '1', price: 15.99 },
          { name: 'Tack Cloths', quantity: '1', price: 8.99 }
        ],
        total: 283.88,
        storeLink: 'https://menards.com/cart/ghi789'
      }
    },
    {
      id: '5',
      contractorName: 'Local Paint Pros',
      contractorRating: 4.6,
      contractorReviews: 78,
      bidAmount: 445,
      timeline: '3 days',
      description: 'Local family-owned painting business serving the area for 10+ years. We source materials from local suppliers and provide personalized service.',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      verified: true,
      experience: '10 years',
      location: '1.5 miles away',
      phone: '(555) 345-6789',
      email: 'contact@localpaintpros.com',
      submittedDate: '2025-01-17T16:45:00',
      status: 'pending',
      materialEstimate: {
        store: 'Local Paint Supply Co.',
        items: [
          { name: 'Porter Paint Ultra Premium (2 gallons)', quantity: '2', price: 85.98 },
          { name: 'High-Hide Primer (1 gallon)', quantity: '1', price: 29.99 },
          { name: 'Wooster Brush Set', quantity: '1', price: 32.99 },
          { name: 'Heavy Duty Drop Cloths', quantity: '2', price: 18.98 },
          { name: 'Contractor Grade Tape', quantity: '3', price: 14.97 },
          { name: 'Prep Materials Bundle', quantity: '1', price: 22.99 }
        ],
        total: 205.90,
        storeLink: 'https://localpaintsupply.com/quote/jkl123'
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
        {/* Back Button */}
        <button
          onClick={() => setSelectedBidId(null)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <span>← Back to All Bids</span>
        </button>

        {/* Detailed Bid View */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <img
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
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{selectedBid.location}</span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedBid.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedBid.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Submission Details</h4>
                  <div className="text-sm text-gray-600">
                    <div>Submitted: {new Date(selectedBid.submittedDate).toLocaleString()}</div>
                    <div>Response time: 2 hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Material Estimate */}
        {selectedBid.materialEstimate && (
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Material Estimate</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {selectedBid.materialEstimate.store === 'Home Depot' && (
                      <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">HD</span>
                      </div>
                    )}
                    {selectedBid.materialEstimate.store === 'Lowes' && (
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">L</span>
                      </div>
                    )}
                    {selectedBid.materialEstimate.store === 'Menards' && (
                      <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">M</span>
                      </div>
                    )}
                    {selectedBid.materialEstimate.store.includes('Local') && (
                      <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">LP</span>
                      </div>
                    )}
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

        {/* Action Buttons */}
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
      {/* Bid Summary */}
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

      {/* Material Cost Comparison */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Material Cost Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">HD</span>
                </div>
                <span className="font-semibold text-orange-800">Home Depot</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">Average: $146.93</div>
              <div className="text-xs text-gray-500">2 estimates available</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">L</span>
                </div>
                <span className="font-semibold text-blue-800">Lowes</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">Average: $205.91</div>
              <div className="text-xs text-gray-500">1 estimate available</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <span className="font-semibold text-red-800">Menards</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">Average: $283.88</div>
              <div className="text-xs text-gray-500">1 estimate available</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">LP</span>
              </div>
              <span className="font-semibold text-green-800">Local Suppliers: $205.90 avg</span>
              <span className="text-xs text-green-600">(Often best for bulk orders)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bids List */}
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
                    <img
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
                      <p className="text-gray-700 text-sm overflow-hidden">{bid.description}</p>
                      
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