import React, { useState } from 'react';
import { User, Calendar, Clock, DollarSign, LogOut, Users, Briefcase, CheckCircle, Plus, FileText, Trash2, Edit, Save, X, History, AlertTriangle, HeartPulse } from 'lucide-react';

// --- DATOS DE EJEMPLO ---
const initialUsers = [
  { 
    id: 1, name: 'Admin General', email: 'admin@nexo.com', password: '123', role: 'admin', rate: 0,
    birthDate: '1980-01-01', curp: 'ADMIN010180HDFXXX01', bloodType: 'O+', allergies: 'Ninguna' 
  },
  { 
    id: 2, name: 'Juan Pérez', email: 'bombero@nexo.com', password: '123', role: 'bombero', rate: 100,
    birthDate: '1995-05-15', curp: 'PEREZ950515HDFXXX02', bloodType: 'A+', allergies: 'Penicilina' 
  },
];

const initialEvents = [
  { 
    id: 101, name: 'Festival de Música X', date: '2025-11-20', startTime: '10:00', endTime: '18:00', location: 'Parque Central', type: 'Social', quota: 5, deadline: '2025-11-19' 
  },
  { 
    id: 102, name: 'Guardia Nocturna', date: '2025-12-01', startTime: '20:00', endTime: '06:00', location: 'Estación Norte', type: 'Operativo', quota: 2, deadline: '2025-11-30' 
  },
];

const initialAssignments = [
  { eventId: 101, userId: 2 }
];

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [events, setEvents] = useState(initialEvents);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [shifts, setShifts] = useState([]); 
  
  const [adminView, setAdminView] = useState('events'); 

  const handleLogin = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
    } else {
      alert("Credenciales incorrectas.");
    }
  };

  const handleLogout = () => setUser(null);

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  if (user.role === 'admin') {
    return (
      <AdminDashboard 
        user={user} 
        onLogout={handleLogout} 
        users={users}
        setUsers={setUsers}
        events={events}
        setEvents={setEvents}
        assignments={assignments}
        setAssignments={setAssignments}
        shifts={shifts} 
        view={adminView}
        setView={setAdminView}
      />
    );
  }

  if (user.role === 'bombero') {
    return (
      <FirefighterDashboard 
        user={user} 
        onLogout={handleLogout}
        events={events}
        assignments={assignments}
        setAssignments={setAssignments}
        shifts={shifts}
        setShifts={setShifts}
      />
    );
  }
}

// --- PANTALLA DE LOGIN ---
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-3 rounded-full">
            <User className="text-white w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">NEXO</h1>
        <p className="text-center text-slate-500 mb-6">Sistema de Gestión de Bomberos</p>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Correo</label>
            <input type="email" className="mt-1 w-full p-2 border rounded bg-slate-50" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
            <input type="password" className="mt-1 w-full p-2 border rounded bg-slate-50" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition">Iniciar Sesión</button>
        </form>
        <div className="mt-6 text-xs text-center text-slate-400"><p>Admin: admin@nexo.com / 123</p><p>Bombero: bombero@nexo.com / 123</p></div>
      </div>
    </div>
  );
}

// --- PANEL DE ADMINISTRADOR ---
function AdminDashboard({ user, onLogout, users, setUsers, events, setEvents, assignments, setAssignments, shifts, view, setView }) {
  const [editingId, setEditingId] = useState(null);
  const [tempRate, setTempRate] = useState(0);

  const handleDeleteUser = (id) => {
    if (confirm("¿Estás seguro de despedir a este empleado?")) {
      setUsers(users.filter(u => u.id !== id));
      setAssignments(assignments.filter(a => a.userId !== id));
    }
  };

  const startEditing = (user) => { setEditingId(user.id); setTempRate(user.rate); };
  const saveRate = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, rate: parseFloat(tempRate) } : u));
    setEditingId(null);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      password: 'temp',
      role: formData.get('role'),
      rate: parseFloat(formData.get('rate') || 0),
      birthDate: formData.get('birthDate'),
      curp: formData.get('curp'),
      bloodType: formData.get('bloodType'),
      allergies: formData.get('allergies'),
    };
    setUsers([...users, newUser]);
    alert("Usuario registrado.");
    e.target.reset();
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      id: Date.now(),
      name: formData.get('eventName'),
      date: formData.get('eventDate'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      location: formData.get('location'),
      type: formData.get('type'),
      quota: parseInt(formData.get('quota')),
      deadline: formData.get('deadline'),
    };
    setEvents([...events, newEvent]);
    alert("Evento creado.");
    e.target.reset();
  };

  const calculatePayroll = () => {
    const completedShifts = shifts.filter(s => s.endTime);
    return completedShifts.map(shift => {
      const worker = users.find(u => u.id === shift.userId);
      const event = events.find(e => e.id === shift.eventId);
      if (!worker || !event) return null; 

      const paidHours = 5; 
      const totalPay = paidHours * (parseFloat(worker.rate) || 0); 
      const monthKey = event.date ? event.date.substring(0, 7) : 'Sin Fecha'; 

      return {
        id: shift.id,
        workerId: worker.id,
        workerName: worker.name,
        eventName: event.name,
        eventDate: event.date,
        monthKey: monthKey,
        paidHours: paidHours,
        totalPay: totalPay
      };
    }).filter(item => item !== null);
  };

  const payrollData = calculatePayroll();

  const summaryByEmployee = Object.values(payrollData.reduce((acc, curr) => {
    if (!acc[curr.workerId]) acc[curr.workerId] = { name: curr.workerName, total: 0, shifts: 0 };
    acc[curr.workerId].total += curr.totalPay;
    acc[curr.workerId].shifts += 1;
    return acc;
  }, {}));

  const historyByMonth = payrollData.reduce((acc, curr) => {
    if (!acc[curr.monthKey]) acc[curr.monthKey] = [];
    acc[curr.monthKey].push(curr);
    return acc;
  }, {});

  const sortedMonths = Object.keys(historyByMonth).sort().reverse();

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2"><Briefcase className="text-red-500" /><span className="font-bold text-xl">Panel Administrativo</span></div>
        <div className="flex items-center gap-4"><span className="text-sm">{user.name}</span><button onClick={onLogout} className="text-xs bg-slate-700 px-3 py-1 rounded flex items-center gap-1"><LogOut size={14}/> Salir</button></div>
      </nav>

      <div className="flex">
        <div className="w-64 bg-white h-[calc(100vh-64px)] shadow-md hidden md:block p-4 space-y-2">
          <button onClick={() => setView('events')} className={`w-full text-left p-3 rounded flex gap-2 ${view === 'events' ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50'}`}><Calendar size={18}/> Eventos</button>
          <button onClick={() => setView('users')} className={`w-full text-left p-3 rounded flex gap-2 ${view === 'users' ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50'}`}><Users size={18}/> Personal</button>
          <button onClick={() => setView('payroll')} className={`w-full text-left p-3 rounded flex gap-2 ${view === 'payroll' ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50'}`}><DollarSign size={18}/> Nómina</button>
        </div>

        <main className="flex-1 p-8 overflow-auto h-[calc(100vh-64px)]">
          {/* VISTAS */}
          {view === 'events' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Crear Nuevo Evento</h2>
                <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="eventName" required placeholder="Nombre del Evento" className="border p-2 rounded" />
                  <input name="location" required placeholder="Ubicación" className="border p-2 rounded" />
                  <input name="eventDate" type="date" required className="border p-2 rounded" />
                  <input name="type" placeholder="Tipo" className="border p-2 rounded" />
                  <div className="flex gap-2"><input name="startTime" type="time" required className="border p-2 rounded w-full" /><input name="endTime" type="time" required className="border p-2 rounded w-full" /></div>
                  <div className="flex gap-2"><input name="quota" type="number" required placeholder="Cupo" className="border p-2 rounded w-full" /><input name="deadline" type="date" required className="border p-2 rounded w-full" /></div>
                  <button type="submit" className="md:col-span-2 bg-red-600 text-white p-2 rounded hover:bg-red-700 flex justify-center gap-2"><Plus size={16}/> Crear Evento</button>
                </form>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-4">Estado de Eventos</h2>
                {events.map(event => {
                  const assignedCount = assignments.filter(a => a.eventId === event.id).length;
                  return (
                    <div key={event.id} className="border p-4 rounded mb-4 flex justify-between items-center">
                      <div><h3 className="font-bold">{event.name}</h3><p className="text-sm text-slate-500">{event.date} | Cupo: {assignedCount} / {event.quota}</p></div>
                      <div className="text-right"><span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Asignados: {assignedCount}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'users' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Registrar Personal</h2>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <input name="name" required placeholder="Nombre Completo" className="border p-2 rounded" />
                <input name="email" type="email" required placeholder="Correo Electrónico" className="border p-2 rounded" />
                <input name="curp" required placeholder="CURP" className="border p-2 rounded uppercase" maxLength={18} />
                <input name="birthDate" type="date" required className="border p-2 rounded" />
                
                {/* --- CAMPOS AGREGADOS: ALERGIAS Y TIPO DE SANGRE --- */}
                <select name="bloodType" className="border p-2 rounded">
                  <option value="">Tipo de Sangre</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                <input name="allergies" placeholder="Alergias (Ej. Penicilina)" className="border p-2 rounded" />

                <select name="role" className="border p-2 rounded"><option value="bombero">Bombero</option><option value="admin">Administrador</option></select>
                <input name="rate" type="number" placeholder="Tarifa por Hora ($)" className="border p-2 rounded" />
                <button type="submit" className="md:col-span-2 bg-slate-800 text-white p-2 rounded hover:bg-slate-900">Registrar</button>
              </form>

              <h3 className="font-bold mb-2">Directorio</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-2">Nombre</th>
                      <th className="p-2">Rol</th>
                      <th className="p-2">Info Médica</th> {/* NUEVA COLUMNA */}
                      <th className="p-2">Tarifa ($/hr)</th>
                      <th className="p-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b hover:bg-slate-50">
                        <td className="p-2 font-medium">{u.name}</td>
                        <td className="p-2 capitalize">{u.role}</td>
                        
                        {/* MOSTRAR ALERGIAS Y SANGRE */}
                        <td className="p-2 text-xs">
                          <div className="flex items-center gap-1">
                            {u.bloodType && <span className="bg-red-100 text-red-800 px-1 rounded font-bold">{u.bloodType}</span>}
                            <span className="text-slate-500 truncate max-w-[100px]">{u.allergies}</span>
                          </div>
                        </td>

                        <td className="p-2">
                          {editingId === u.id ? (
                            <div className="flex items-center gap-1">
                              <input type="number" value={tempRate} onChange={(e) => setTempRate(e.target.value)} className="w-20 border rounded p-1" />
                              <button onClick={() => saveRate(u.id)} className="text-green-600"><Save size={16}/></button>
                              <button onClick={() => setEditingId(null)} className="text-red-600"><X size={16}/></button>
                            </div>
                          ) : <span>${u.rate}</span>}
                        </td>
                        <td className="p-2 flex justify-center gap-2">
                          {u.role !== 'admin' && (
                            <>
                              <button onClick={() => startEditing(u)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                              <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'payroll' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign className="text-green-600" /> Resumen Total de Pagos</h2>
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr><th className="p-3 text-left">Empleado</th><th className="p-3 text-center">Eventos</th><th className="p-3 text-right">Total a Pagar</th></tr>
                  </thead>
                  <tbody>
                    {summaryByEmployee.length === 0 && <tr><td colSpan="3" className="p-3 text-center text-slate-400">Sin datos calculados</td></tr>}
                    {summaryByEmployee.map((sum, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-3 font-bold text-slate-700">{sum.name}</td>
                        <td className="p-3 text-center">{sum.shifts}</td>
                        <td className="p-3 text-right font-bold text-green-700 text-lg">${sum.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><History className="text-slate-600" /> Archivo de Nómina Mensual</h2>
                {sortedMonths.length === 0 && <p className="text-center text-slate-400">No hay historial.</p>}
                {sortedMonths.map(month => (
                  <div key={month} className="mb-6 border rounded-lg overflow-hidden">
                    <div className="bg-slate-800 text-white p-3 font-bold flex justify-between"><span>Periodo: {month}</span><span className="text-xs bg-slate-600 px-2 py-1 rounded">Archivado</span></div>
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr><th className="p-3 text-left">Bombero</th><th className="p-3 text-left">Evento</th><th className="p-3 text-right">Fecha</th><th className="p-3 text-right">Pago (5h)</th></tr>
                      </thead>
                      <tbody>
                        {historyByMonth[month].map(item => (
                          <tr key={item.id} className="border-b">
                            <td className="p-3">{item.workerName}</td>
                            <td className="p-3 text-slate-600">{item.eventName}</td>
                            <td className="p-3 text-right">{item.eventDate}</td>
                            <td className="p-3 text-right font-medium">${item.totalPay.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// --- PANEL DE BOMBERO ---
function FirefighterDashboard({ user, onLogout, events, assignments, setAssignments, shifts, setShifts }) {
  const [tab, setTab] = useState('my-events');

  const myEventIds = assignments.filter(a => a.userId === user.id).map(a => a.eventId);
  const myEvents = events.filter(e => myEventIds.includes(e.id));
  
  const availableEvents = events.filter(e => {
    const isAssigned = myEventIds.includes(e.id);
    if (isAssigned) return false;
    const assignedCount = assignments.filter(a => a.eventId === e.id).length;
    const today = new Date().toISOString().split('T')[0];
    return assignedCount < e.quota && e.deadline >= today;
  });

  const myHistory = shifts.filter(s => s.userId === user.id && s.endTime).map(s => {
    const evt = events.find(e => e.id === s.eventId);
    const paidHours = 5; 
    const totalPay = paidHours * user.rate;
    const monthKey = evt?.date ? evt.date.substring(0, 7) : 'Varios';
    return { ...s, eventName: evt?.name, date: evt?.date, monthKey, pay: totalPay };
  });

  const historyByMonth = myHistory.reduce((acc, curr) => {
    if (!acc[curr.monthKey]) acc[curr.monthKey] = { shifts: [], total: 0 };
    acc[curr.monthKey].shifts.push(curr);
    acc[curr.monthKey].total += curr.pay;
    return acc;
  }, {});
  const sortedHistoryMonths = Object.keys(historyByMonth).sort().reverse();

  const handleSelfAssign = (eventId) => {
    if (confirm("¿Deseas inscribirte?")) {
      setAssignments([...assignments, { eventId, userId: user.id }]);
      alert("Inscrito exitosamente.");
    }
  };

  const handleClockIn = (eventId) => {
    const newShift = { id: Date.now(), userId: user.id, eventId, startTime: new Date().toISOString(), endTime: null };
    setShifts([...shifts, newShift]);
  };

  const handleClockOut = (eventId) => {
    const updated = shifts.map(s => s.userId === user.id && s.eventId === eventId && !s.endTime ? { ...s, endTime: new Date().toISOString() } : s);
    setShifts(updated);
  };

  const getActiveShift = (eventId) => shifts.find(s => s.userId === user.id && s.eventId === eventId && !s.endTime);
  
  const isEventCompleted = (eventId) => shifts.some(s => s.userId === user.id && s.eventId === eventId && s.endTime);

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-red-700 text-white p-4 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-2"><User /><span className="font-bold text-xl">Portal Bombero</span></div>
        <div className="flex items-center gap-4"><span className="text-sm">{user.name}</span><button onClick={onLogout} className="text-xs bg-red-800 px-3 py-1 rounded flex items-center gap-1"><LogOut size={14}/> Salir</button></div>
      </nav>

      <div className="flex justify-center bg-white shadow-sm mb-6">
        <button onClick={() => setTab('my-events')} className={`px-6 py-3 border-b-2 font-medium ${tab === 'my-events' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'}`}>Mis Eventos</button>
        <button onClick={() => setTab('available')} className={`px-6 py-3 border-b-2 font-medium ${tab === 'available' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'}`}>Disponibles</button>
        <button onClick={() => setTab('history')} className={`px-6 py-3 border-b-2 font-medium ${tab === 'history' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'}`}>Historial</button>
      </div>

      <main className="max-w-4xl mx-auto p-6">
        {tab === 'my-events' && (
          <div className="space-y-4">
            {myEvents.map(event => {
              const activeShift = getActiveShift(event.id);
              const completed = isEventCompleted(event.id); 

              return (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
                  <div className="flex justify-between items-start">
                    <div><h3 className="text-xl font-bold text-slate-800">{event.name}</h3><p className="text-slate-500 text-sm">{event.date} | {event.startTime} - {event.endTime}</p></div>
                    <div>
                      {completed ? (
                        <button disabled className="bg-slate-300 text-slate-500 px-4 py-2 rounded font-bold flex items-center gap-2 cursor-not-allowed"><CheckCircle size={18}/> COMPLETADO</button>
                      ) : activeShift ? (
                        <button onClick={() => handleClockOut(event.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold shadow">FINALIZAR TURNO</button>
                      ) : (
                        <button onClick={() => handleClockIn(event.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2 shadow"><Clock size={18}/> INICIAR TURNO</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'available' && (
          <div className="space-y-4">
            {availableEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                <div><h3 className="font-bold text-lg">{event.name}</h3><p className="text-sm text-slate-500">{event.date}</p></div>
                <button onClick={() => handleSelfAssign(event.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-1"><Plus size={16}/> Inscribirme</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-6">
            {sortedHistoryMonths.length === 0 && <p className="text-center text-slate-400">Sin historial.</p>}
            {sortedHistoryMonths.map(month => (
              <div key={month} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-slate-800 text-white p-4 flex justify-between items-center"><span className="font-bold text-lg capitalize">Periodo: {month}</span><div className="bg-green-600 px-3 py-1 rounded text-sm font-bold">Total Mes: ${historyByMonth[month].total.toFixed(2)}</div></div>
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Evento</th><th className="p-4">Fecha</th><th className="p-4 text-right">Pago (5hrs)</th></tr></thead>
                  <tbody>
                    {historyByMonth[month].shifts.map(h => (
                      <tr key={h.id} className="border-b hover:bg-slate-50"><td className="p-4 font-medium">{h.eventName}</td><td className="p-4 text-slate-500">{h.date}</td><td className="p-4 text-right font-bold text-green-700">${h.pay.toFixed(2)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}