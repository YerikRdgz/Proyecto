import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, DollarSign, LogOut, Users, Briefcase, CheckCircle, Plus } from 'lucide-react';

// --- DATOS DE EJEMPLO (SIMULACIÓN DE BASE DE DATOS) ---
// Estos datos simulan lo que ya existiría en tu base de datos.
const initialUsers = [
  { id: 1, name: 'Admin General', email: 'admin@nexo.com', password: '123', role: 'admin', rate: 0 },
  { id: 2, name: 'Natalie Lazaro', email: 'bombero@nexo.com', password: '123', role: 'bombero', rate: 60 }, // Tarifa $60/hr
];

const initialEvents = [
  { id: 101, name: 'Mismo Rollo', date: '2025-11-22', startTime: '17:00', endTime: '23:00', location: 'QCC', type: 'Social' },
];

// Simula la tabla intermedia de asignaciones
const initialAssignments = [
  { eventId: 101, userId: 2 } // Juan Pérez asignado al Festival
];

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  // 1. ESTADOS (La memoria de la app)
  const [user, setUser] = useState(null); // ¿Quién está logueado?
  const [users, setUsers] = useState(initialUsers); // Lista de usuarios (Mecánica 1)
  const [events, setEvents] = useState(initialEvents); // Lista de eventos (Mecánica 4)
  const [assignments, setAssignments] = useState(initialAssignments); // Asignaciones
  const [shifts, setShifts] = useState([]); // Registro de horas (Mecánica 5)
  
  // Vista actual para el Admin (pestañas)
  const [adminView, setAdminView] = useState('events'); 

  // --- MECÁNICA 3: INICIO DE SESIÓN ---
  const handleLogin = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser); // Guardamos al usuario en la "memoria" activa
    } else {
      alert("Credenciales incorrectas. (Prueba: admin@nexo.com / 123)");
    }
  };

  const handleLogout = () => setUser(null);

  // --- RENDERIZADO ---
  // Si no hay usuario, mostramos el Login
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Si es Admin, mostramos Panel Admin
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
        shifts={shifts} // Para la nómina
        view={adminView}
        setView={setAdminView}
      />
    );
  }

  // Si es Bombero, mostramos Panel Bombero
  if (user.role === 'bombero') {
    return (
      <FirefighterDashboard 
        user={user} 
        onLogout={handleLogout}
        events={events}
        assignments={assignments}
        shifts={shifts}
        setShifts={setShifts}
      />
    );
  }
}

// --- PANTALLA DE LOGIN (Mecánica 3) ---
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
            <label className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
            <input 
              type="email" 
              className="mt-1 w-full p-2 border rounded bg-slate-50 text-slate-900"
              placeholder="ej. admin@nexo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
            <input 
              type="password" 
              className="mt-1 w-full p-2 border rounded bg-slate-50 text-slate-900"
              placeholder="••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition">
            Iniciar Sesión
          </button>
        </form>
        
        <div className="mt-6 text-xs text-center text-slate-400">
          <p>Credenciales Demo:</p>
          <p>Admin: admin@nexo.com / 123</p>
          <p>Bombero: bombero@nexo.com / 123</p>
        </div>
      </div>
    </div>
  );
}

// --- PANEL DE ADMINISTRADOR ---
function AdminDashboard({ user, onLogout, users, setUsers, events, setEvents, assignments, setAssignments, shifts, view, setView }) {
  
  // Función para crear usuario (Mecánica 1)
  const handleCreateUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      password: 'temp', // Contraseña por defecto
      role: formData.get('role'),
      rate: parseFloat(formData.get('rate') || 0),
    };
    setUsers([...users, newUser]);
    alert("Usuario creado correctamente");
    e.target.reset();
  };

  // Función para crear evento (Mecánica 4)
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
    };
    setEvents([...events, newEvent]);
    alert("Evento creado correctamente");
    e.target.reset();
  };

  // Función para asignar personal
  const handleAssign = (eventId, userId) => {
    if (assignments.find(a => a.eventId === eventId && a.userId === userId)) return;
    setAssignments([...assignments, { eventId, userId }]);
  };

  // --- MECÁNICA 6: CÁLCULO DE NÓMINA ---
  const calculatePayroll = () => {
    // Filtramos solo turnos completados (que tengan hora de fin)
    const completedShifts = shifts.filter(s => s.endTime);
    
    return completedShifts.map(shift => {
      const worker = users.find(u => u.id === shift.userId);
      const event = events.find(e => e.id === shift.eventId);
      
      const start = new Date(shift.startTime);
      const end = new Date(shift.endTime);
      const hours = (end - start) / (1000 * 60 * 60); // Milisegundos a horas
      
      return {
        id: shift.id,
        workerName: worker?.name,
        eventName: event?.name,
        hours: hours.toFixed(2),
        rate: worker?.rate,
        totalPay: (hours * worker?.rate).toFixed(2)
      };
    });
  };

  const payrollData = calculatePayroll();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase className="text-red-500" />
          <span className="font-bold text-xl">Panel Administrativo</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">Hola, {user.name}</span>
          <button onClick={onLogout} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded flex items-center gap-1">
            <LogOut size={14}/> Salir
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-[calc(100vh-64px)] shadow-md hidden md:block">
          <div className="p-4 space-y-2">
            <button onClick={() => setView('events')} className={`w-full text-left p-3 rounded flex items-center gap-2 ${view === 'events' ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50'}`}>
              <Calendar size={18}/> Gestión Eventos
            </button>
            <button onClick={() => setView('users')} className={`w-full text-left p-3 rounded flex items-center gap-2 ${view === 'users' ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50'}`}>
              <Users size={18}/> Gestión Personal
            </button>
            <button onClick={() => setView('payroll')} className={`w-full text-left p-3 rounded flex items-center gap-2 ${view === 'payroll' ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50'}`}>
              <DollarSign size={18}/> Nómina
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <main className="flex-1 p-8 overflow-auto h-[calc(100vh-64px)]">
          
          {/* VISTA: EVENTOS */}
          {view === 'events' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Crear Nuevo Evento (Mecánica 4)</h2>
                <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="eventName" required placeholder="Nombre del Evento" className="border p-2 rounded" />
                  <input name="location" required placeholder="Ubicación" className="border p-2 rounded" />
                  <input name="eventDate" type="date" required className="border p-2 rounded" />
                  <input name="type" placeholder="Tipo (Social, Deportivo)" className="border p-2 rounded" />
                  <div className="flex gap-2">
                    <input name="startTime" type="time" required className="border p-2 rounded w-full" />
                    <input name="endTime" type="time" required className="border p-2 rounded w-full" />
                  </div>
                  <button type="submit" className="bg-red-600 text-white p-2 rounded hover:bg-red-700 flex items-center justify-center gap-2">
                    <Plus size={16}/> Crear Evento
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-4">Eventos Activos y Asignaciones</h2>
                {events.map(event => (
                  <div key={event.id} className="border p-4 rounded mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{event.name}</h3>
                        <p className="text-sm text-slate-500">{event.date} | {event.startTime} - {event.endTime}</p>
                        <p className="text-sm text-slate-500">{event.location}</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{event.type}</div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Asignar Personal:</p>
                      <div className="flex gap-2 flex-wrap">
                        {users.filter(u => u.role === 'bombero').map(bombero => {
                          const isAssigned = assignments.some(a => a.eventId === event.id && a.userId === bombero.id);
                          return (
                            <button 
                              key={bombero.id}
                              onClick={() => handleAssign(event.id, bombero.id)}
                              disabled={isAssigned}
                              className={`text-xs px-3 py-1 rounded border ${isAssigned ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-50 hover:bg-slate-100'}`}
                            >
                              {isAssigned ? '✓ ' : '+ '} {bombero.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA: PERSONAL */}
          {view === 'users' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Registrar Personal (Mecánica 1)</h2>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <input name="name" required placeholder="Nombre Completo" className="border p-2 rounded" />
                <input name="email" type="email" required placeholder="Correo Electrónico" className="border p-2 rounded" />
                <select name="role" className="border p-2 rounded">
                  <option value="bombero">Bombero</option>
                  <option value="admin">Administrador</option>
                </select>
                <input name="rate" type="number" placeholder="Tarifa por Hora ($)" className="border p-2 rounded" />
                <button type="submit" className="md:col-span-2 bg-slate-800 text-white p-2 rounded hover:bg-slate-900">
                  Registrar Usuario
                </button>
              </form>

              <h3 className="font-bold mb-2">Directorio de Personal</h3>
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Nombre</th>
                    <th className="p-2">Rol</th>
                    <th className="p-2">Tarifa/Hr</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b">
                      <td className="p-2 text-slate-400">#{u.id}</td>
                      <td className="p-2 font-medium">{u.name}</td>
                      <td className="p-2 capitalize">{u.role}</td>
                      <td className="p-2">${u.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VISTA: NÓMINA */}
          {view === 'payroll' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <DollarSign className="text-green-600" /> 
                Cálculo Automático de Nómina (Mecánica 6)
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Este cálculo se realiza automáticamente basándose en los registros de horas completados por los bomberos.
              </p>

              {payrollData.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No hay turnos completados para calcular pagos.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-3 text-left">Bombero</th>
                      <th className="p-3 text-left">Evento</th>
                      <th className="p-3 text-right">Horas</th>
                      <th className="p-3 text-right">Tarifa</th>
                      <th className="p-3 text-right">Total a Pagar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollData.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">{item.workerName}</td>
                        <td className="p-3 text-slate-600">{item.eventName}</td>
                        <td className="p-3 text-right">{item.hours} hrs</td>
                        <td className="p-3 text-right text-slate-500">${item.rate}/hr</td>
                        <td className="p-3 text-right font-bold text-green-700">${item.totalPay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// --- PANEL DE BOMBERO ---
function FirefighterDashboard({ user, onLogout, events, assignments, shifts, setShifts }) {
  
  // Filtrar eventos asignados a este usuario
  const myEventIds = assignments.filter(a => a.userId === user.id).map(a => a.eventId);
  const myEvents = events.filter(e => myEventIds.includes(e.id));

  // --- MECÁNICA 5: REGISTRO DE HORAS ---
  
  // Fichar Entrada
  const handleClockIn = (eventId) => {
    const newShift = {
      id: Date.now(),
      userId: user.id,
      eventId: eventId,
      startTime: new Date().toISOString(),
      endTime: null, // Aún no termina
    };
    setShifts([...shifts, newShift]);
  };

  // Fichar Salida
  const handleClockOut = (eventId) => {
    const updatedShifts = shifts.map(shift => {
      if (shift.userId === user.id && shift.eventId === eventId && !shift.endTime) {
        return { ...shift, endTime: new Date().toISOString() };
      }
      return shift;
    });
    setShifts(updatedShifts);
  };

  // Verificar si estoy trabajando ahora mismo en un evento
  const getActiveShift = (eventId) => {
    return shifts.find(s => s.userId === user.id && s.eventId === eventId && !s.endTime);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar Bombero */}
      <nav className="bg-red-700 text-white p-4 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User className="text-white" />
          <span className="font-bold text-xl">Portal del Bombero</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-red-100">Hola, {user.name}</span>
          <button onClick={onLogout} className="text-xs bg-red-800 hover:bg-red-900 px-3 py-1 rounded flex items-center gap-1">
            <LogOut size={14}/> Salir
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Mis Eventos Asignados</h2>

        {myEvents.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center text-slate-500">
            No tienes eventos asignados en este momento.
          </div>
        ) : (
          <div className="space-y-4">
            {myEvents.map(event => {
              const activeShift = getActiveShift(event.id);
              const eventShifts = shifts.filter(s => s.userId === user.id && s.eventId === event.id && s.endTime);

              return (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{event.name}</h3>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                          <Calendar size={16}/> {event.date} | {event.startTime} - {event.endTime}
                        </p>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                          <CheckCircle size={16}/> {event.location}
                        </p>
                      </div>
                      
                      {/* BOTONES DE FICHAJE */}
                      <div className="flex flex-col items-end">
                        {!activeShift ? (
                          <button 
                            onClick={() => handleClockIn(event.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow transition transform hover:scale-105"
                          >
                            <Clock /> INICIAR TURNO
                          </button>
                        ) : (
                          <div className="text-right">
                            <p className="text-sm text-green-600 font-bold mb-2 animate-pulse">● Turno en curso</p>
                            <button 
                              onClick={() => handleClockOut(event.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow transition"
                            >
                              FINALIZAR TURNO
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Historial breve */}
                  {eventShifts.length > 0 && (
                    <div className="bg-slate-50 p-4 text-sm">
                      <p className="font-bold text-slate-700 mb-2">Turnos completados en este evento:</p>
                      <ul className="space-y-1">
                        {eventShifts.map(shift => {
                          const start = new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                          const end = new Date(shift.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                          return (
                            <li key={shift.id} className="flex justify-between text-slate-500 border-b border-slate-200 pb-1">
                              <span>{new Date(shift.startTime).toLocaleDateString()}</span>
                              <span>{start} - {end}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}