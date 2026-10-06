const API_BASE = 'http://127.0.0.1:8000/api';

async function getJSON(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error('Network error');
  return res.json();
}

export async function fetchMenuItems(){
  return getJSON(`${API_BASE}/menuitems/`);
}

export async function createMenuItem(data){
  const res = await fetch(`${API_BASE}/menuitems/`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const json = await res.json();
  if(!res.ok){
    const msg = Object.entries(json).map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(', '):v}`).join('; ');
    throw new Error(msg || 'Failed to create menu item');
  }
  return json;
}

export async function updateMenuItem(id,data){
  const res = await fetch(`${API_BASE}/menuitems/${id}/`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const json = await res.json();
  if(!res.ok){
    const msg = Object.entries(json).map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(', '):v}`).join('; ');
    throw new Error(msg || 'Failed to update menu item');
  }
  return json;
}

export async function deleteMenuItem(id){
  const res = await fetch(`${API_BASE}/menuitems/${id}/`, {method:'DELETE'});
  if(!res.ok) throw new Error('Failed to delete menu item');
  return res;
}

export async function fetchCategories(){
  return getJSON(`${API_BASE}/categories/`);
}

export async function fetchDashboard(){
  return getJSON(`${API_BASE}/dashboard/`);
}

export async function fetchLocations(){
  return getJSON(`${API_BASE}/locations/`);
}

export async function createLocation(data){
  const res = await fetch(`${API_BASE}/locations/`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!res.ok) throw new Error('Failed to create location');
  return res.json();
}

export async function updateLocation(id, data){
  const res = await fetch(`${API_BASE}/locations/${id}/`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!res.ok) throw new Error('Failed to update location');
  return res.json();
}

export async function deleteLocation(id){
  return fetch(`${API_BASE}/locations/${id}/`, {method:'DELETE'});
}

// Staff APIs
export async function fetchStaff(){
  return getJSON(`${API_BASE}/staff/`);
}

export async function createStaff(data){
  const res = await fetch(`${API_BASE}/staff/`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  return res.json();
}

export async function updateStaff(id,data){
  const res = await fetch(`${API_BASE}/staff/${id}/`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  return res.json();
}

export async function deleteStaff(id){
  return fetch(`${API_BASE}/staff/${id}/`, {method:'DELETE'});
}

export async function fetchStaffAttendance(){
  return getJSON(`${API_BASE}/staff_attendance/`);
}

export async function createStaffAttendance(data){
  const res = await fetch(`${API_BASE}/staff_attendance/`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  return res.json();
}

export async function startWork(staffId){
  const res = await fetch(`${API_BASE}/staff/start_work/`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({staff: staffId})});
  if(!res.ok) throw new Error('start work failed');
  return res.json();
}

export async function registerStaff(data){
  const res = await fetch(`${API_BASE}/auth/register/`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  if(!res.ok) throw new Error('register failed');
  return res.json();
}

export async function loginStaff(credentials){
  const res = await fetch(`${API_BASE}/auth/login/`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(credentials)});
  if(!res.ok) throw new Error('login failed');
  return res.json();
}

export async function createCategory(data){
  const res = await fetch(`${API_BASE}/categories/`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  return res.json();
}

export async function updateCategory(id,data){
  const res = await fetch(`${API_BASE}/categories/${id}/`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  return res.json();
}

export async function deleteCategory(id){
  return fetch(`${API_BASE}/categories/${id}/`, {method:'DELETE'});
}

export async function fetchCoupons(){
  return getJSON(`${API_BASE}/coupons/`);
}

export async function createCoupon(data){
  const res = await fetch(`${API_BASE}/coupons/`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!res.ok) throw new Error('Failed to create coupon');
  return res.json();
}

export async function fetchGroceries(){
  return getJSON(`${API_BASE}/groceries/`);
}

export async function createGrocery(data){
  const res = await fetch(`${API_BASE}/groceries/`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!res.ok) throw new Error('Failed to save grocery item');
  return res.json();
}

export async function updateGrocery(id,data){
  const res = await fetch(`${API_BASE}/groceries/${id}/`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!res.ok) throw new Error('Failed to update grocery item');
  return res.json();
}

export async function deleteGrocery(id){
  return fetch(`${API_BASE}/groceries/${id}/`, {method:'DELETE'});
}

export async function updateStaffAttendance(id, data){
  const res = await fetch(`${API_BASE}/staff_attendance/${id}/`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!res.ok) throw new Error('Failed to update attendance');
  return res.json();
}

export default {
  fetchMenuItems,createMenuItem,updateMenuItem,deleteMenuItem,
  fetchCategories,createCategory,updateCategory,deleteCategory,
  fetchLocations,createLocation,updateLocation,deleteLocation,
  fetchCoupons,createCoupon,deleteCoupon,
  fetchGroceries,createGrocery,updateGrocery,deleteGrocery,
  updateStaffAttendance
}

