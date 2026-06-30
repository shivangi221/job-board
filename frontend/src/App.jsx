import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider, useAuth } from './AuthContext';

function MainApp() {
  const { user, token, login, logout } = useAuth();
  
  // App states
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [authMode, setAuthMode] = useState('login'); 

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('seeker');

  // Job Posting states
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [description, setDescription] = useState('');

  // Status message alerts
  const [message, setMessage] = useState('');

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/jobs?search=${searchTerm}`);
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (authMode === 'register') {
        const res = await axios.post('http://127.0.0.1:5000/api/auth/register', { name, email, password, role });
        setMessage('✨ Account created! You can sign in now.');
        setAuthMode('login');
      } else {
        const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });
        login(res.data.user, res.data.token);
        setMessage(`Welcome back, ${res.data.user.name}!`);
      }
      setEmail(''); setPassword(''); setName('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://127.0.0.1:5000/api/jobs', {
        employerId: user.id,
        title: jobTitle,
        company,
        location,
        type: jobType,
        description
      });
      setMessage('🎉 Structural listing published successfully!');
      fetchJobs();
      setJobTitle(''); setCompany(''); setLocation(''); setDescription('');
    } catch (err) {
      setMessage('Failed to post job.');
    }
  };

  // Reusable inline style configurations
  const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: '"Inter", system-ui, sans-serif', color: '#1e293b', backgroundColor: '#f8fafc', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', marginBottom: '32px' },
    brandTitle: { fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #2563eb, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    card: { background: '#ffffff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)', border: '1px solid #e2e8f0' },
    input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', width: '100%', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s' },
    btnPrimary: { padding: '12px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' },
    btnSuccess: { padding: '12px 20px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', width: '100%' },
    badge: { display: 'inline-block', padding: '6px 12px', fontSize: '12px', fontWeight: '700', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    jobCard: { background: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgb(0 0 0 / 0.02)', transition: 'transform 0.2s, box-shadow 0.2s' }
  };

  return (
    <div style={styles.container}>
      
      {/* GLOBAL HEADER BAR */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.brandTitle}>💼 NextGen Careers</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Discover & Deploy New Opportunities</p>
        </div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '700', color: '#0f172a' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>✨ {user.role} Dashboard</div>
              </div>
              <button onClick={logout} style={{ padding: '8px 16px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Logout</button>
            </div>
          ) : (
            <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>🔒 Access Protected System</span>
          )}
        </div>
      </header>

      {/* SYSTEM FEEDBACK NOTIFICATION */}
      {message && (
        <div style={{ padding: '16px 20px', background: '#eff6ff', color: '#1e40af', borderLeft: '5px solid #2563eb', marginBottom: '24px', borderRadius: '8px', fontWeight: '500', fontSize: '15px' }}>
          {message}
        </div>
      )}

      {/* DASHBOARD SPLIT GRID LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: user ? '1fr' : '1fr 1.2fr', gap: '32px', marginBottom: '40px', alignItems: 'start' }}>
        
        {/* LEFT COMPONENT: AUTH PANELS */}
        {!user && (
          <div style={styles.card}>
            <h2 style={{ marginTop: 0, fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              {authMode === 'login' ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              {authMode === 'login' ? 'Sign in to access curated job feeds' : 'Register your profile details below'}
            </p>
            
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {authMode === 'register' && (
                <>
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
                  <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...styles.input, backgroundColor: '#fff' }}>
                    <option value="seeker">🕵️‍♂️ Job Seeker (Find Work)</option>
                    <option value="employer">🏢 Employer (Post Jobs)</option>
                  </select>
                </>
              )}
              <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
              
              <button type="submit" style={styles.btnPrimary}>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center', color: '#64748b', margin: '20px 0 0 0' }}>
              {authMode === 'login' ? "New to the platform? " : "Already have an account? "}
              <span onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
                {authMode === 'login' ? 'Create an account' : 'Sign in instead'}
              </span>
            </p>
          </div>
        )}

        {/* WORKSPACE COMPONENT: EMPLOYER MANAGEMENT MODULE */}
        {user && user.role === 'employer' && (
          <div style={{ ...styles.card, background: '#ffffff' }}>
            <h2 style={{ marginTop: 0, fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>➕ Deploy New Job Opportunity</h2>
            <form onSubmit={handlePostJob} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: 'span 1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Job Title</label>
                <input type="text" placeholder="e.g. Full Stack Architect" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required style={styles.input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Company Name</label>
                <input type="text" placeholder="e.g. OpenAI" value={company} onChange={(e) => setCompany(e.target.value)} required style={styles.input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Workplace Location</label>
                <input type="text" placeholder="e.g. Remote / Prayagraj" value={location} onChange={(e) => setLocation(e.target.value)} required style={styles.input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Employment Schedule</label>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} style={{ ...styles.input, backgroundColor: '#fff' }}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Core Requirements & Context</label>
                <textarea placeholder="Outline roles, technological expectations, and key workflows..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{ ...styles.input, minHeight: '110px', resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ ...styles.btnSuccess, gridColumn: 'span 2', marginTop: '8px' }}>Publish Vacancy Listing</button>
            </form>
          </div>
        )}
      </div>

      {/* ACTIVE SEARCH PIPELINE VIEW & STREAM */}
      <section style={{ ...styles.card, borderColor: '#e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>🎯 Explore Available Track Openings</h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Real-time database indices matching live queries</p>
          </div>
          <div style={{ backgroundColor: '#f1f5f9', padding: '6px 16px', borderRadius: '10px', fontWeight: '600', color: '#334155', fontSize: '14px' }}>
            Available Records: {jobs.length}
          </div>
        </div>

        {/* INTERACTIVE COMPONENT: REAL TIME FILTER FIELD */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <input 
            type="text" 
            placeholder="🔍 Filter matching streams by job title (e.g., Engineer)..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ ...styles.input, paddingLeft: '44px', fontSize: '16px', background: '#f8fafc' }} 
          />
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '18px', pointerEvents: 'none' }}></span>
        </div>

        {/* DATA STREAM GRID LOOP */}
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#64748b' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>No listings correspond to your filter parameters query.</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Try signing into an Employer account above to initialize a entry record.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.map((job) => {
              // Custom matching tag colors dynamically assigned
              const isRemote = job.type === 'Remote';
              return (
                <div 
                  key={job._id} 
                  style={styles.jobCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgb(0 0 0 / 0.02)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '18px', fontWeight: '700' }}>{job.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '14px', color: '#475569' }}>
                        <span style={{ fontWeight: '600', color: '#2563eb' }}>🏢 {job.company}</span>
                        <span style={{ color: '#94a3b8' }}>•</span>
                        <span style={{ color: '#64748b' }}>📍 {job.location}</span>
                      </div>
                    </div>
                    <span style={{ 
                      ...styles.badge, 
                      backgroundColor: isRemote ? '#ecfdf5' : '#eff6ff', 
                      color: isRemote ? '#059669' : '#1d4ed8' 
                    }}>
                      {job.type}
                    </span>
                  </div>
                  <div style={{ margin: '16px 0 0 0', color: '#334155', fontSize: '14px', lineHeight: '1.6', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    {job.description}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}


//cd C:\Users\5272s\OneDrive\Desktop\Simple tsk\job-board\frontend
//npm run dev