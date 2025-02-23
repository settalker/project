import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, Users, Waves, Eye, Bell, Settings, Bug, X } from 'lucide-react';

interface Ticket {
  id: number;
  timestamp: string;
  status: 'open' | 'closed';
  comments: string[];
}

function App() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [isPersonDrowning, setIsPersonDrowning] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showDrowningAlert, setShowDrowningAlert] = useState(false);

  // Effect to handle drowning detection
  useEffect(() => {
    if (isPersonDrowning) {
      setShowDrowningAlert(true);
      // Create a new ticket
      const newTicket: Ticket = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        status: 'open',
        comments: ['Drowning incident detected']
      };
      setTickets(prev => [...prev, newTicket]);
    }
  }, [isPersonDrowning]);

  const handleCloseTicket = (ticketId: number) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: 'closed' as const } 
        : ticket
    ));
    setShowTicketModal(false);
  };

  const handleAddComment = () => {
    if (!activeTicket || !newComment.trim()) return;

    setTickets(prev => prev.map(ticket => 
      ticket.id === activeTicket.id 
        ? { ...ticket, comments: [...ticket.comments, newComment] }
        : ticket
    ));
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Drowning Alert Modal */}
      {showDrowningAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-600">⚠️ EMERGENCY ALERT</h2>
              <button 
                onClick={() => setShowDrowningAlert(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-lg font-semibold mb-4">Potential drowning incident detected!</p>
            <p className="mb-4">Immediate attention required. Please check pool status immediately.</p>
            <button
              onClick={() => setShowDrowningAlert(false)}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Acknowledge Alert
            </button>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && activeTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Incident Ticket #{activeTicket.id}</h2>
              <button 
                onClick={() => setShowTicketModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Created: {activeTicket.timestamp}</p>
              <p className="text-sm text-gray-600">Status: 
                <span className={activeTicket.status === 'open' ? 'text-red-600' : 'text-green-600'}>
                  {' '}{activeTicket.status}
                </span>
              </p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Comments:</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                {activeTicket.comments.map((comment, index) => (
                  <p key={index} className="mb-2 text-sm">{comment}</p>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Add a comment..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Comment
              </button>
              {activeTicket.status === 'open' && (
                <button
                  onClick={() => handleCloseTicket(activeTicket.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Close Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Waves className="h-8 w-8" />
              <h1 className="text-2xl font-bold">PoolGuard Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-blue-700 rounded-full">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 hover:bg-blue-700 rounded-full">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatusCard
            title="System Status"
            value={isMonitoring ? "Active Monitoring" : "System Paused"}
            icon={<Activity className="h-8 w-8 text-green-500" />}
            color="bg-green-50"
          />
          <StatusCard
            title="Current Occupancy"
            value="2 People Detected"
            icon={<Users className="h-8 w-8 text-blue-500" />}
            color="bg-blue-50"
          />
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Monitoring Controls</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                isMonitoring 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <Eye className="h-5 w-5" />
              <span>{isMonitoring ? 'Pause Monitoring' : 'Start Monitoring'}</span>
            </button>
          </div>
        </div>

        {/* Incident History */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Incident History</h2>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setActiveTicket(ticket);
                  setShowTicketModal(true);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Incident #{ticket.id}</h3>
                    <p className="text-sm text-gray-600">{ticket.timestamp}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    ticket.status === 'open' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-gray-500 text-center py-4">No incident history</p>
            )}
          </div>
        </div>

        {/* Recent Alerts Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {tickets.slice().reverse().map((ticket) => (
              <div 
                key={ticket.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setActiveTicket(ticket);
                  setShowTicketModal(true);
                }}
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    ticket.status === 'open' ? 'text-red-500' : 'text-green-500'
                  }`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">Incident #{ticket.id}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        ticket.status === 'open' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{ticket.comments[0]}</p>
                    <p className="text-xs text-gray-500 mt-1">{ticket.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent alerts</p>
            )}
          </div>
        </div>
      </main>

      {/* Debug Button */}
      <button
        className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        onMouseDown={() => setIsPersonDrowning(true)}
        onMouseUp={() => setIsPersonDrowning(false)}
        onMouseLeave={() => setIsPersonDrowning(false)}
      >
        <Bug className="h-6 w-6" />
      </button>
    </div>
  );
}

function StatusCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <p className="text-gray-900 text-lg font-semibold mt-1">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

export default App;