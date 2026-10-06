import { useState, useEffect } from 'react';
import './App.css';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://localhost:8000/api/v1/students';

function App() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', roll_no: '', branch: '', year: 1, email: '',
    marks: { ds: 0, dbms: 0, os: 0, cn: 0, se: 0 }
  });

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'year' ? parseInt(value) : value });
  };

  const handleMarkChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      marks: { ...formData.marks, [name]: parseInt(value) || 0 }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      
      await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setFormData({ name: '', roll_no: '', branch: '', year: 1, email: '', marks: { ds: 0, dbms: 0, os: 0, cn: 0, se: 0 } });
      setEditingId(null);
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name, roll_no: student.roll_no, branch: student.branch, 
      year: student.year, email: student.email,
      marks: student.marks || { ds: 0, dbms: 0, os: 0, cn: 0, se: 0 }
    });
  };

    return (
    <div className="container">
      <h1>✨ Student Record System</h1>
      
      <div className="card">
        <h2>{editingId ? "Edit Student" : "Add New Student"}</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-grid">
            <div className="form-group"><label>Name:</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Roll No:</label><input type="text" name="roll_no" value={formData.roll_no} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Branch:</label><input type="text" name="branch" value={formData.branch} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Year:</label><input type="number" name="year" min="1" max="4" value={formData.year} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Email:</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
          </div>

          <div className="marks-title">🤖 Enter Subject Marks (0-100) for AI Prediction:</div>
          <div className="marks-container">
            <div className="form-group"><label>Data Structures:</label><input type="number" name="ds" min="0" max="100" value={formData.marks?.ds || 0} onChange={handleMarkChange} /></div>
            <div className="form-group"><label>DBMS:</label><input type="number" name="dbms" min="0" max="100" value={formData.marks?.dbms || 0} onChange={handleMarkChange} /></div>
            <div className="form-group"><label>OS:</label><input type="number" name="os" min="0" max="100" value={formData.marks?.os || 0} onChange={handleMarkChange} /></div>
            <div className="form-group"><label>Networks:</label><input type="number" name="cn" min="0" max="100" value={formData.marks?.cn || 0} onChange={handleMarkChange} /></div>
            <div className="form-group"><label>Software Eng:</label><input type="number" name="se" min="0" max="100" value={formData.marks?.se || 0} onChange={handleMarkChange} /></div>
          </div>

          <button type="submit" className="btn btn-primary">{editingId ? "Update Student" : "Add Student"}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData(initialFormState); }}>Cancel</button>}
        </form>
      </div>

      <div className="card">
        <h2>Student Directory</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr><th>Name</th><th>Roll No</th><th>Branch</th><th>Year</th><th>Email</th><th>AI Recommendation</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td><td>{s.roll_no}</td><td>{s.branch}</td><td>{s.year}</td><td>{s.email}</td>
                  <td>
                    <span className={`badge ${s.recommended_elective ? 'badge-ai' : 'badge-pending'}`}>
                      {s.recommended_elective || "Pending Data"}
                    </span>
                  </td>
                  <td style={{whiteSpace: 'nowrap'}}>
                    <button className="btn btn-primary" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => s.id && handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
