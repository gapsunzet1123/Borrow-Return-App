// =================================================================
// API.JS - Data Access Layer
// ทำหน้าที่เป็นตัวกลางระหว่างแอปพลิเคชันและแหล่งข้อมูล
// ในเวอร์ชันนี้ จะดึงข้อมูลจาก Mock Database (database.js)
// ในอนาคต สามารถแก้ไขไฟล์นี้เพื่อเรียกใช้ Real API จาก Backend ได้
// =================================================================

import { itemTypes, procurment, users, members, borrowals } from './database.js';

// ----- Helper Functions for Mock Data Manipulation -----
const findById = (array, id) => array.find(item => item.id == id || item.mb_id == id);
const findIndexById = (array, id) => array.findIndex(item => item.id == id || item.mb_id == id);

// ----- API Functions -----

// --- Procurment (Equipment) ---
export async function getProcurment() {
    // ในอนาคต: return await fetch('/api/procurment').then(res => res.json());
    return Promise.resolve([...procurment]);
}

export async function saveProcurment(itemData) {
    if (itemData.id) { // Update
        const index = findIndexById(procurment, itemData.id);
        if (index > -1) procurment[index] = itemData;
    } else { // Create
        itemData.id = 'P' + Date.now();
        procurment.push(itemData);
    }
    return Promise.resolve(itemData);
}

export async function deleteProcurment(itemId) {
    const index = findIndexById(procurment, itemId);
    if (index > -1) {
        procurment.splice(index, 1);
        return Promise.resolve({ success: true });
    }
    return Promise.reject({ message: "Item not found" });
}

// --- Members ---
export async function getMembers() {
    return Promise.resolve([...members]);
}

export async function saveMember(memberData) {
    if (memberData.mb_id) { // Update
        const index = findIndexById(members, memberData.mb_id);
        if (index > -1) members[index] = memberData;
    } else { // Create
        if (members.some(m => m.mb_identity === memberData.mb_identity)) {
            return Promise.reject({ message: 'รหัสนักศึกษานี้มีในระบบแล้ว' });
        }
        memberData.mb_id = 'M' + Date.now();
        members.push(memberData);
    }
    return Promise.resolve(memberData);
}

export async function deleteMember(memberId) {
    const index = findIndexById(members, memberId);
    if (index > -1) {
        members.splice(index, 1);
        return Promise.resolve({ success: true });
    }
    return Promise.reject({ message: "Member not found" });
}


// --- Users ---
export async function getUsers() {
    return Promise.resolve([...users]);
}

export async function saveUser(userData) {
    if (userData.id) { // Update
        const index = findIndexById(users, userData.id);
        if (index > -1) {
            // Keep old password if new one is not provided
            userData.password = userData.password ? userData.password : users[index].password;
            users[index] = userData;
        }
    } else { // Create
        if (users.some(u => u.username === userData.username)) {
            return Promise.reject({ message: 'Username นี้มีผู้ใช้งานแล้ว' });
        }
        userData.id = 'U' + Date.now();
        users.push(userData);
    }
    return Promise.resolve(userData);
}

export async function deleteUser(userId) {
    const index = findIndexById(users, userId);
    if (index > -1) {
        users.splice(index, 1);
        return Promise.resolve({ success: true });
    }
    return Promise.reject({ message: "User not found" });
}

// --- Borrowals ---
export async function getBorrowals() {
    return Promise.resolve([...borrowals]);
}

export async function saveBorrowal(borrowalData) {
    borrowalData.b_id = 'B' + Date.now();
    borrowals.push(borrowalData);
    // In a real scenario, you'd also update the stock of each item.
    borrowalData.details.forEach(detail => {
        const item = findById(procurment, detail.tool_id);
        if (item) {
            item.stock -= detail.borrow;
        }
    });
    return Promise.resolve(borrowalData);
}

export async function updateBorrowalStatus(borrowalId, newStatus) {
    const borrowal = findById(borrowals, borrowalId);
    if (borrowal) {
        borrowal.status = newStatus;
        if (newStatus === 2) { // Returned
            borrowal.insdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            // Update stock
            borrowal.details.forEach(d => {
                d.repatriate = d.borrow;
                d.status = 2;
                const stockItem = findById(procurment, d.tool_id);
                if (stockItem) {
                    stockItem.stock += d.borrow;
                }
            });
        }
        return Promise.resolve(borrowal);
    }
    return Promise.reject({ message: "Borrowal not found" });
}


// --- Item Types ---
export async function getItemTypes() {
    return Promise.resolve([...itemTypes]);
}
