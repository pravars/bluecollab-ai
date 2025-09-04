import React, { useState } from 'react';
import { Search, MapPin, Clock, DollarSign, User, Star, Filter, Eye, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [showBidDialog, setShowBidDialog] = useState(false);

  // Mock job data
  const availableJobs = [
    {
      id: 1,
      title: 'Kitchen Cabinet Painting',
      description: 'Need professional to paint 15 kitchen cabinets. All prep work will be done by homeowner.',
      category: 'Painting',
      budget: '800-1200',
      location: 'Downtown Seattle',
      distance: '2.3 miles',
      postedTime: '2 hours ago',
      urgency: 'Standard',
      homeownerRating: 4.8,
      totalBids: 3,
      requirements: ['Licensed', 'Insured', '3+ years experience'],
      estimatedDuration: '2-3 days',
      materials: 'Homeowner provides paint and supplies'
    },
    {
      id: 2,
      title: 'Bathroom Plumbing Repair',
      description: 'Leaky faucet and running toilet need immediate attention. Prefer same-day service.',
      category: 'Plumbing',
      budget: '200-400',
      location: 'Capitol Hill',
      distance: '4.1 miles',
      postedTime: '30 minutes ago',
      urgency: 'Urgent',
      homeownerRating: 4.6,
      totalBids: 1,
      requirements: ['Licensed plumber', 'Emergency availability'],
      estimatedDuration: '2-4 hours',
      materials: 'Contractor provides parts'
    },
    {
      id: 3,
      title: 'Deck Staining Project',
      description: 'Large composite deck needs professional staining. Approximately 400 sq ft.',
      category: 'Outdoor',
      budget: '600-900',
      location: 'Bellevue',
      distance: '8.7 miles',
      postedTime: '1 day ago',
      urgency: 'Flexible',
      homeownerRating: 4.9,
      totalBids: 7,
      requirements: ['Outdoor experience', 'Own equipment'],
      estimatedDuration: '1-2 days',
      materials: 'Stain provided by homeowner'
    },
    {
      id: 4,
      title: 'Electrical Outlet Installation',
      description: 'Install 4 new GFCI outlets in garage. All materials already purchased.',
      category: 'Electrical',
      budget: '300-500',
      location: 'Fremont',
      distance: '5.2 miles',
      postedTime: '4 hours ago',
      urgency: 'Standard',
      homeownerRating: 4.7,
      totalBids: 2,
      requirements: ['Licensed electrician', 'GFCI experience'],
      estimatedDuration: '3-5 hours',
      materials: 'All materials provided'
    }
  ];

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || job.category.toLowerCase() === filterCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleSubmitBid = () => {
    // Mock bid submission
    alert(`Bid submitted for ${selectedJob?.title}: $${bidAmount}`);
    setShowBidDialog(false);
    setSelectedJob(null);
    setBidAmount('');
    setBidMessage('');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'Standard': return 'bg-yellow-100 text-yellow-800';
      case 'Flexible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Find Jobs to Bid On</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search jobs by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="painting">Painting</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Jobs ({filteredJobs.length})
          </h3>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </Button>
        </div>

        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h4>
                  <p className="text-gray-600 mb-3">{job.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location} • {job.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.postedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${job.budget}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{job.homeownerRating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge className={getUrgencyColor(job.urgency)}>{job.urgency}</Badge>
                    <Badge variant="outline">{job.totalBids} bids</Badge>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p><strong>Duration:</strong> {job.estimatedDuration}</p>
                    <p><strong>Materials:</strong> {job.materials}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={() => {
                      setSelectedJob(job);
                      setShowBidDialog(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Button>

                  <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Quick Bid</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simple Bid Dialog */}
      {showBidDialog && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">{selectedJob.title}</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-gray-600">{selectedJob.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedJob.requirements.map((req: string, index: number) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Bid Amount ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter bid amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Timeline
                    </label>
                    <Input placeholder="e.g., 2-3 days" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Message
                  </label>
                  <Textarea
                    placeholder="Explain your approach and why you're the best choice..."
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowBidDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitBid}
                    disabled={!bidAmount || !bidMessage}
                    className="flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Bid</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}