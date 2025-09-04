import React, { useState } from 'react';
import { MessageCircle, Send, Phone, Video, Star, Paperclip, Image, Search, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function CustomerCommunication() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversation data
  const conversations = [
    {
      id: 1,
      customerName: 'Sarah Mitchell',
      customerInitials: 'SM',
      lastMessage: 'When can you start the kitchen project?',
      timestamp: '2 hours ago',
      unreadCount: 2,
      projectTitle: 'Kitchen Cabinet Painting',
      status: 'Active',
      rating: 4.8,
      messages: [
        {
          id: 1,
          sender: 'customer',
          message: 'Hi! I saw your bid for the kitchen cabinet painting. Can we discuss the timeline?',
          timestamp: '2 days ago',
          time: '10:30 AM'
        },
        {
          id: 2,
          sender: 'provider',
          message: 'Hello Sarah! I can start next Monday and complete the project in 2-3 days. Would that work for you?',
          timestamp: '2 days ago',
          time: '11:15 AM'
        },
        {
          id: 3,
          sender: 'customer',
          message: 'That sounds perfect! What preparation do I need to do?',
          timestamp: '1 day ago',
          time: '2:45 PM'
        },
        {
          id: 4,
          sender: 'provider',
          message: 'Please remove all items from cabinets and clean the surfaces. I\'ll handle the rest including taping and drop cloths.',
          timestamp: '1 day ago',
          time: '3:20 PM'
        },
        {
          id: 5,
          sender: 'customer',
          message: 'When can you start the kitchen project?',
          timestamp: '2 hours ago',
          time: '9:15 AM'
        }
      ]
    },
    {
      id: 2,
      customerName: 'John Rodriguez',
      customerInitials: 'JR',
      lastMessage: 'Thanks for fixing the plumbing issue so quickly!',
      timestamp: '1 day ago',
      unreadCount: 0,
      projectTitle: 'Bathroom Plumbing Repair',
      status: 'Completed',
      rating: 5.0,
      messages: [
        {
          id: 1,
          sender: 'customer',
          message: 'Emergency plumbing needed ASAP! Toilet is overflowing.',
          timestamp: '3 days ago',
          time: '8:00 AM'
        },
        {
          id: 2,
          sender: 'provider',
          message: 'I can be there in 30 minutes. Please turn off water supply to toilet if possible.',
          timestamp: '3 days ago',
          time: '8:05 AM'
        },
        {
          id: 3,
          sender: 'customer',
          message: 'Thanks for fixing the plumbing issue so quickly!',
          timestamp: '1 day ago',
          time: '4:30 PM'
        }
      ]
    },
    {
      id: 3,
      customerName: 'Emily Chen',
      customerInitials: 'EC',
      lastMessage: 'Could you send me a quote for additional work?',
      timestamp: '3 hours ago',
      unreadCount: 1,
      projectTitle: 'Deck Staining Project',
      status: 'In Progress',
      rating: 4.9,
      messages: [
        {
          id: 1,
          sender: 'customer',
          message: 'The deck looks amazing! Could you send me a quote for additional work?',
          timestamp: '3 hours ago',
          time: '1:20 PM'
        }
      ]
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: Date.now(),
      sender: 'provider',
      message: newMessage,
      timestamp: 'now',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg]
    });

    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Conversations</span>
            </CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {conversation.customerInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.customerName}
                        </h4>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{conversation.projectTitle}</p>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                        <Badge className={getStatusColor(conversation.status)}>
                          {conversation.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        {selectedConversation ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {selectedConversation.customerInitials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.customerName}</h3>
                    <p className="text-sm text-gray-600">{selectedConversation.projectTitle}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">{selectedConversation.rating}</span>
                      </div>
                      <Badge className={getStatusColor(selectedConversation.status)}>
                        {selectedConversation.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'provider'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'provider' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            <div className="border-t p-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Image className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}