// =================================================================
// SCRIPT.JS - Main Application Logic
// =================================================================

// Import API functions and UI components
import * as api from './api.js';
import { dashboardPageComponent, procurmentPageComponent, membersPageComponent, usersPageComponent, reportsPageComponent, procurmentFormModalContent, memberFormModalContent, userFormModalContent, reportDateRangeModalContent, borrowalReportModalContent, returnVerificationModalContent } from './components.js';


document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const state = {
        currentUser: null,
        currentPage: 'login',
        // Data is now fetched via API, not stored directly in state
    };

    // --- DOM Elements ---
    const app = document.getElementById('app');

    // =================================================================
    // HELPER FUNCTIONS
    // =================================================================
    
    function formatDateTime(dateTimeString) {
        if (!dateTimeString || dateTimeString.startsWith('0000')) return '-';
        const date = new Date(dateTimeString);
        if (isNaN(date)) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('th-TH', options);
    }

    async function getItemTypeName(typeId) {
        const itemTypes = await api.getItemTypes();
        const type = itemTypes.find(t => t.id === typeId);
        return type ? type.name : 'ไม่ระบุ';
    }
    
    async function getItemName(itemId) {
        const procurment = await api.getProcurment();
        const item = procurment.find(p => p.id === itemId);
        return item ? item.name : 'ไม่พบรายการ';
    }
    
    function getUserPositionName(userType) {
        switch(userType) {
            case 1: return 'ผู้ดูแลระบบ';
            case 2: return 'อาจารย์ที่ดูแลอุปกรณ์';
            case 3: return 'อาจารย์/นักศึกษา';
            default: return 'ไม่ระบุ';
        }
    }

    function closeModal() {
        const modal = document.getElementById('custom-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    function showModal(title, content, buttons = [{ text: 'ปิด', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }]) {
        closeModal();
        const modalHtml = `
            <div class="modal-backdrop" id="custom-modal">
                <div class="modal-content animate-fade-in">
                    <h2 class="text-2xl font-bold mb-4">${title}</h2>
                    <div class="text-gray-700 mb-6">${content}</div>
                    <div class="flex justify-end space-x-2">
                        ${buttons.map(btn => `<button class="px-4 py-2 rounded text-white ${btn.className}" onclick="appLogic.handleModalAction('${btn.actionName || ''}')">${btn.text}</button>`).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function hasPermission(level = 'manager') {
        if (!state.currentUser) return false;
        const userLevel = state.currentUser.type; // 1: Admin, 2: Manager, 3: Officer
        if (level === 'admin') {
            return userLevel === 1;
        }
        if (level === 'manager') {
            return userLevel <= 2;
        }
        return false;
    }

    // =================================================================
    // RENDER FUNCTIONS (Now mostly async)
    // =================================================================

    function renderLogin() {
        state.currentPage = 'login';
        app.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-200">
                <div class="bg-white p-8 rounded-lg custom-shadow w-full max-w-md text-center">
                    <img src="https://placehold.co/150x150/000000/FFFFFF?text=Logo" alt="Logo" class="mx-auto mb-4 rounded-full">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">ระบบยืม-คืนอุปกรณ์</h1>
                    <p class="text-gray-600 mb-8">โปรเจคทดลองใช้</p>
                    <form id="login-form">
                        <div class="mb-4">
                            <input type="text" id="username" placeholder="ชื่อผู้ใช้งาน" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="admin">
                        </div>
                        <div class="mb-6">
                            <input type="password" id="password" placeholder="รหัสผ่าน" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="1234">
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">เข้าสู่ระบบ</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }

    function renderMainLayout(pageContent, pageTitle) {
        const user = state.currentUser;
        if (!user) {
            renderLogin();
            return;
        }
        const userPositionName = getUserPositionName(user.type);
        app.innerHTML = `
            <div class="min-h-screen bg-gray-100 flex flex-col">
                <header class="bg-white custom-shadow">
                    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div class="flex items-center space-x-4">
                            <img src="https://placehold.co/80x80/000000/FFFFFF?text=Logo" alt="Logo" class="h-16 w-16 rounded-full">
                            <div>
                                <h1 class="text-2xl font-bold text-gray-800">ระบบยืม-คืนอุปกรณ์กีฬา</h1>
                                <p class="text-gray-600">โปรเจคทดลองใช้</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold">${user.fname} ${user.lname}</p>
                            <p class="text-sm text-gray-500">${userPositionName}</p>
                            <a href="#" data-page="logout" class="text-sm text-blue-600 hover:underline">ออกจากระบบ</a>
                        </div>
                    </div>
                </header>
                <nav class="bg-gray-800 text-white">
                    <div class="container mx-auto px-4">
                        <div id="main-menu" class="flex space-x-4"></div>
                    </div>
                </nav>
                <main class="container mx-auto p-6 flex-grow">
                    <h2 class="text-3xl font-bold text-gray-800 mb-6">${pageTitle}</h2>
                    <div id="page-content" class="bg-white p-6 rounded-lg custom-shadow">
                        ${pageContent}
                    </div>
                </main>
                <footer class="bg-gray-800 text-white text-center py-4 mt-8">
                    <p>&copy; ${new Date().getFullYear()} ระบบยืม-คืนอุปกรณ์กีฬา โปรเจคทดลองใช้</p>
                </footer>
            </div>
        `;
        renderMenu();
        document.querySelector('a[data-page="logout"]').addEventListener('click', (e) => {
            e.preventDefault();
            navigate('logout');
        });
    }
    
    function renderMenu() {
        const menuContainer = document.getElementById('main-menu');
        if (!menuContainer) return;
        const menuItems = [
            { text: 'หน้าแรก', page: 'dashboard', roles: [1, 2, 3] },
            { text: 'จัดการอุปกรณ์', page: 'procurment', roles: [1, 2] },
            { text: 'รายการยืม-คืน', page: 'borrowals', roles: [1, 2, 3] },
            { text: 'ข้อมูลสมาชิก', page: 'members', roles: [1, 2, 3] },
            { text: 'ข้อมูลผู้ใช้งาน', page: 'users', roles: [1] },
            { text: 'รายงาน', page: 'reports', roles: [1, 2, 3] },
        ];
        let menuHtml = '';
        menuItems.forEach(item => {
            if (item.roles.includes(state.currentUser.type)) {
                const isActive = state.currentPage === item.page ? 'bg-gray-900' : '';
                menuHtml += `<a href="#" data-page="${item.page}" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 ${isActive}">${item.text}</a>`;
            }
        });
        menuContainer.innerHTML = menuHtml;
        menuContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigate(e.target.getAttribute('data-page'));
            });
        });
    }

    async function renderDashboardPage() {
        state.currentPage = 'dashboard';
        const procurment = await api.getProcurment();
        const borrowals = await api.getBorrowals();
        const members = await api.getMembers();
        const stats = {
            totalProcurment: procurment.length,
            borrowedItems: borrowals.filter(b => b.status === 1).length,
            availableItems: procurment.reduce((sum, item) => sum + item.stock, 0),
            totalMembers: members.length
        };
        const pageContent = dashboardPageComponent(stats);
        renderMainLayout(pageContent, 'ภาพรวมระบบ');
    }
    
    async function renderProcurmentPage(searchTerm = '', searchType = '0') {
        state.currentPage = 'procurment';
        let procurment = await api.getProcurment();
        const itemTypes = await api.getItemTypes();

        if (searchTerm) {
            procurment = procurment.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                item.no.includes(searchTerm)
            );
        }
        if (searchType !== '0') {
            procurment = procurment.filter(item => item.type === searchType);
        }
        const pageContent = procurmentPageComponent(procurment, itemTypes, searchTerm, searchType, state.currentUser.type);
        renderMainLayout(pageContent, 'จัดการข้อมูลอุปกรณ์');
        document.getElementById('search-btn-proc').addEventListener('click', () => {
            const term = document.getElementById('search-term-proc').value;
            const type = document.getElementById('search-type-proc').value;
            renderProcurmentPage(term, type);
        });
        const addItemBtn = document.getElementById('add-item-btn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', handleAddProcurment);
        }
    }

    async function renderMembersPage(searchTerm = '') {
        state.currentPage = 'members';
        const members = await api.getMembers();
        const borrowals = await api.getBorrowals();
        const pageContent = membersPageComponent(members, borrowals, searchTerm, state.currentUser.type);
        renderMainLayout(pageContent, 'จัดการข้อมูลสมาชิก');
        document.getElementById('search-btn-member').addEventListener('click', () => {
            const term = document.getElementById('search-term-member').value;
            renderMembersPage(term);
        });
        const addMemberBtn = document.getElementById('add-member-btn');
        if(addMemberBtn) {
            addMemberBtn.addEventListener('click', handleAddMember);
        }
    }

    async function renderUsersPage() {
        state.currentPage = 'users';
        if (!hasPermission('admin')) {
            renderMainLayout('<p class="text-red-500">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>', 'ไม่สามารถเข้าถึงได้');
            return;
        }
        const users = await api.getUsers();
        const pageContent = usersPageComponent(users, getUserPositionName);
        renderMainLayout(pageContent, 'จัดการข้อมูลผู้ใช้งาน');
        document.getElementById('add-user-btn').addEventListener('click', handleAddUser);
    }

    function renderReportsPage() {
        state.currentPage = 'reports';
        const pageContent = reportsPageComponent();
        renderMainLayout(pageContent, 'จัดการรายงาน');
    }

    async function renderBorrowalsPage(filterStatus = '1') {
        state.currentPage = 'borrowals';
        const borrowals = await api.getBorrowals();
        const filteredBorrowals = borrowals.filter(b => b.status.toString() === filterStatus);
        const tableRows = filteredBorrowals.map((item, index) => {
            const statusText = item.status === 1 ? 'รอส่งคืน' : 'คืนแล้ว';
            const statusColor = item.status === 1 ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100';
            const totalItems = item.details.reduce((sum, d) => sum + d.borrow, 0);
            return `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-3 text-center">${index + 1}</td> <td class="p-3">${item.b_name}</td> <td class="p-3 text-center">${totalItems} รายการ</td> <td class="p-3">${formatDateTime(item.DTime)}</td> <td class="p-3">${formatDateTime(item.rtn_date)}</td> <td class="p-3 text-center"><span class="px-2 py-1 text-xs font-semibold rounded-full ${statusColor}">${statusText}</span></td> <td class="p-3 text-center"><button onclick="appLogic.viewBorrowalDetail('${item.b_id}')" class="text-blue-500 hover:text-blue-700"><i class="fa-solid fa-eye"></i></button></td> <td class="p-3 text-center">${item.status === 1 ? `<button onclick="appLogic.returnItems('${item.b_id}')" class="text-green-500 hover:text-green-700"><i class="fa-solid fa-undo"></i></button>` : '-'}</td>
                </tr>`;
        }).join('');
        const pageContent = `
            <div class="flex justify-between items-center mb-4">
                 <div class="flex items-center space-x-2"> <label class="font-medium">สถานะ:</label> <select id="filter-status" class="border px-2 py-1 rounded-md"> <option value="1" ${filterStatus === '1' ? 'selected' : ''}>รายการยืม (รอส่งคืน)</option> <option value="2" ${filterStatus === '2' ? 'selected' : ''}>รายการคืนแล้ว</option> </select> </div>
                 <button id="add-borrow-btn" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"><i class="fa-solid fa-plus mr-2"></i>ทำรายการยืมใหม่</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-700">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-200"> <tr> <th class="p-3 text-center">ลำดับ</th><th class="p-3">ชื่อผู้ยืม</th><th class="p-3 text-center">จำนวน</th><th class="p-3">วันที่ยืม</th><th class="p-3">กำหนดคืน</th><th class="p-3 text-center">สถานะ</th><th class="p-3 text-center">รายละเอียด</th><th class="p-3 text-center">คืน</th> </tr> </thead>
                    <tbody>${tableRows.length > 0 ? tableRows : '<tr><td colspan="8" class="text-center p-4">ไม่พบข้อมูล</td></tr>'}</tbody>
                </table>
            </div>`;
        renderMainLayout(pageContent, 'รายการยืม-คืนอุปกรณ์');
        document.getElementById('filter-status').addEventListener('change', (e) => renderBorrowalsPage(e.target.value));
        document.getElementById('add-borrow-btn').addEventListener('click', () => renderAddBorrowPage());
    }
    
    async function renderAddBorrowPage(identity = '', memberInfo = null) {
        state.currentPage = 'addBorrow';
        const cartItemsHtml = await Promise.all(state.cart.map(async item => `
            <tr class="border-b"><td class="p-2">${await getItemName(item.id)}</td><td class="p-2 text-center">${item.quantity}</td><td class="p-2 text-center"><button onclick="appLogic.removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button></td></tr>`));
        
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const pageContent = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-2">
                    <h3 class="text-xl font-semibold mb-3 border-b pb-2">ข้อมูลผู้ยืม</h3>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-2"> <input type="text" id="member-identity" placeholder="รหัสนักศึกษา" class="border px-3 py-2 rounded-md w-full" value="${identity}"> <button id="find-member-btn" class="bg-blue-500 text-white px-4 py-2 rounded-md whitespace-nowrap">ตรวจสอบ</button> </div>
                        ${memberInfo ? `<div class="bg-green-50 border border-green-200 p-4 rounded-md"><p><strong>ชื่อ-สกุล:</strong> ${memberInfo.mb_title_name} ${memberInfo.mb_fname} ${memberInfo.mb_lname}</p><p><strong>อาจารย์ที่ปรึกษา:</strong> ${memberInfo.mb_teacher}</p>${memberInfo.hasActiveBorrowal ? `<p class="text-red-600 font-bold mt-2">สถานะ: ยังไม่คืนอุปกรณ์, ไม่สามารถยืมเพิ่มได้</p>` : ''}</div>` : (identity ? `<div class="bg-red-50 border border-red-200 p-4 rounded-md"><p>ไม่พบข้อมูลสมาชิก</p></div>` : '')}
                    </div>
                    <h3 class="text-xl font-semibold mb-3 border-b pb-2 mt-6">ข้อมูลการยืม</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div><label class="block text-sm font-medium text-gray-700">กำหนดส่งคืน</label><input type="datetime-local" id="return-date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></div>
                         <div><label class="block text-sm font-medium text-gray-700">ผู้อนุมัติให้ยืม</label><input type="text" id="approver" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100" value="${state.currentUser.fname}" readonly></div>
                         <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700">หมายเหตุ</label><textarea id="note" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">-</textarea></div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3"> <button id="cancel-borrow-btn" class="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">ยกเลิก</button> <button id="submit-borrow-btn" class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700" ${!memberInfo || memberInfo.hasActiveBorrowal ? 'disabled' : ''}>บันทึกการยืม</button> </div>
                </div>
                <div>
                    <h3 class="text-xl font-semibold mb-3 border-b pb-2">รายการยืม</h3>
                    <button id="select-items-btn" class="w-full bg-indigo-500 text-white py-2 rounded-md mb-4 hover:bg-indigo-600">เลือกรายการอุปกรณ์</button>
                    <div class="bg-gray-50 p-3 rounded-md min-h-[200px]">
                        <table class="w-full text-sm">
                           <thead><tr class="border-b"><th class="text-left p-2">รายการ</th><th class="text-center p-2">จำนวน</th><th class="text-center p-2">ลบ</th></tr></thead>
                           <tbody id="cart-items-body">${cartItemsHtml.join('')}</tbody>
                        </table>
                    </div>
                    <div class="mt-4 text-right font-bold">รวม: ${totalItems} ชิ้น</div>
                </div>
            </div>`;
        renderMainLayout(pageContent, 'ทำรายการยืมอุปกรณ์');
        document.getElementById('find-member-btn').addEventListener('click', handleFindMember);
        document.getElementById('select-items-btn').addEventListener('click', handleSelectItems);
        document.getElementById('cancel-borrow-btn').addEventListener('click', () => navigate('borrowals'));
        document.getElementById('submit-borrow-btn').addEventListener('click', handleSubmitBorrow);
    }

    // =================================================================
    // EVENT HANDLERS & LOGIC
    // =================================================================

    async function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = await api.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            state.currentUser = user;
            navigate('dashboard');
        } else {
            showModal('เกิดข้อผิดพลาด', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
    }
    
    async function handleFindMember() {
        const identity = document.getElementById('member-identity').value;
        if (!identity) {
            showModal('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกรหัสนักศึกษา');
            return;
        }
        const members = await api.getMembers();
        const borrowals = await api.getBorrowals();
        const member = members.find(m => m.mb_identity === identity);
        let memberData = null;
        if (member) {
            const hasActiveBorrowal = borrowals.some(b => b.b_identity === identity && b.status === 1);
            memberData = {...member, hasActiveBorrowal};
        }
        renderAddBorrowPage(identity, memberData);
    }
    
    async function handleSelectItems() {
        const allProcurment = await api.getProcurment();
        const availableItems = allProcurment.filter(item => item.stock > 0);
        let itemsHtml = availableItems.map(item => `
            <div class="flex justify-between items-center p-2 border-b">
                <span>${item.name} (คงเหลือ: ${item.stock})</span>
                <div class="flex items-center space-x-2"> <input type="number" id="qty-${item.id}" min="1" max="${item.stock}" value="1" class="w-16 text-center border rounded"> <button onclick="appLogic.addToCart('${item.id}')" class="bg-blue-500 text-white px-2 py-1 rounded text-sm">เพิ่ม</button> </div>
            </div>`).join('');
        if (availableItems.length === 0) {
            itemsHtml = '<p class="text-center text-gray-500">ไม่มีอุปกรณ์ที่พร้อมให้ยืมในขณะนี้</p>';
        }
        showModal('เลือกอุปกรณ์ที่ต้องการยืม', itemsHtml);
    }
    
    async function addToCart(itemId) {
        const allProcurment = await api.getProcurment();
        const item = allProcurment.find(p => p.id === itemId);
        const quantityInput = document.getElementById(`qty-${itemId}`);
        const quantity = parseInt(quantityInput.value, 10);
        if (!item || isNaN(quantity) || quantity <= 0) return;
        if (quantity > item.stock) {
            showModal('เกิดข้อผิดพลาด', `จำนวนที่ต้องการยืม (${quantity}) มากกว่าของที่มีในสต็อก (${item.stock})`);
            return;
        }
        const existingItemIndex = state.cart.findIndex(c => c.id === itemId);
        if (existingItemIndex > -1) {
            state.cart[existingItemIndex].quantity += quantity;
        } else {
            state.cart.push({ id: itemId, quantity: quantity });
        }
        closeModal();
        const currentIdentity = document.getElementById('member-identity')?.value || '';
        const members = await api.getMembers();
        renderAddBorrowPage(currentIdentity, members.find(m => m.mb_identity === currentIdentity));
    }
    
    async function removeFromCart(itemId) {
        state.cart = state.cart.filter(item => item.id !== itemId);
        const currentIdentity = document.getElementById('member-identity')?.value || '';
        const members = await api.getMembers();
        renderAddBorrowPage(currentIdentity, members.find(m => m.mb_identity === currentIdentity));
    }
    
    async function handleSubmitBorrow() {
        const identity = document.getElementById('member-identity').value;
        const members = await api.getMembers();
        const borrowals = await api.getBorrowals();
        const member = members.find(m => m.mb_identity === identity);
        const returnDate = document.getElementById('return-date').value;
        const note = document.getElementById('note').value;
        
        let errors = [];
        if (!member) errors.push('ไม่พบข้อมูลผู้ยืม กรุณาตรวจสอบรหัสนักศึกษา');
        if (state.cart.length === 0) errors.push('ยังไม่ได้เลือกรายการอุปกรณ์ที่จะยืม');
        if (!returnDate) errors.push('กรุณากำหนดวันที่และเวลาส่งคืน');
        if (member && borrowals.some(b => b.b_identity === member.mb_identity && b.status === 1)) {
            errors.push('สมาชิกคนนี้มีรายการที่ยังไม่ส่งคืน ไม่สามารถยืมเพิ่มได้');
        }
        if (errors.length > 0) {
            showModal('ข้อมูลไม่สมบูรณ์', `<ul class="list-disc pl-5">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`);
            return;
        }

        const newBorrowal = {
            b_identity: member.mb_identity, b_name: `${member.mb_title_name} ${member.mb_fname} ${member.mb_lname}`, b_allow: state.currentUser.fname, note: note, teacher: member.mb_teacher, status: 1, rtn_date: returnDate, insdate: '0000-00-00 00:00:00', DTime: new Date().toISOString().slice(0, 19).replace('T', ' '), details: state.cart.map(item => ({ tool_id: item.id, borrow: item.quantity, repatriate: 0, status: 1 }))
        };
        
        await api.saveBorrowal(newBorrowal);
        state.cart = [];
        showModal('สำเร็จ', 'บันทึกข้อมูลการยืมเรียบร้อยแล้ว');
        navigate('borrowals');
    }
    
    async function viewBorrowalDetail(borrowalId) {
        const borrowals = await api.getBorrowals();
        const borrowal = borrowals.find(b => b.b_id === borrowalId);
        if (!borrowal) return;
        const detailsHtml = await Promise.all(borrowal.details.map(async d => `<tr><td class="py-1">${await getItemName(d.tool_id)}</td><td class="py-1 text-center">${d.borrow}</td><td class="py-1 text-center">${d.repatriate}</td></tr>`));
        const content = `<p><strong>ผู้ยืม:</strong> ${borrowal.b_name}</p><p><strong>วันที่ยืม:</strong> ${formatDateTime(borrowal.DTime)}</p><p><strong>กำหนดคืน:</strong> ${formatDateTime(borrowal.rtn_date)}</p><hr class="my-3"><h4 class="font-semibold mb-2">รายการอุปกรณ์</h4><table class="w-full text-sm"><thead><tr class="border-b"><th class="text-left">ชื่อ</th><th class="text-center">ยืม</th><th class="text-center">คืนแล้ว</th></tr></thead><tbody>${detailsHtml.join('')}</tbody></table>`;
        showModal('รายละเอียดการยืม', content);
    }
    
    async function returnItems(borrowalId) {
        const borrowals = await api.getBorrowals();
        const borrowal = borrowals.find(b => b.b_id === borrowalId);
        if (!borrowal) return;

        const formContent = returnVerificationModalContent(borrowal);
        showModal('ยืนยันการคืนอุปกรณ์', formContent, [
            { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' },
            { text: 'ยืนยันการคืน', className: 'bg-green-600 hover:bg-green-700', actionName: `confirmReturn-${borrowalId}` }
        ]);
    }

    async function handleConfirmReturn(borrowalId) {
        const identityInput = document.getElementById('returner-identity').value.trim();
        const borrowals = await api.getBorrowals();
        const borrowal = borrowals.find(b => b.b_id === borrowalId);

        if (!identityInput) {
            alert('กรุณาป้อนข้อมูลเพื่อยืนยันตัวตน');
            return;
        }

        const isMatch = (identityInput === borrowal.b_identity) || (borrowal.b_name.includes(identityInput));

        if (!isMatch) {
            showModal('ยืนยันตัวตนไม่สำเร็จ', 'ข้อมูลที่ป้อนไม่ตรงกับข้อมูลผู้ยืม');
            return;
        }

        await api.updateBorrowalStatus(borrowalId, 2);
        
        closeModal();
        showModal('สำเร็จ', 'บันทึกการคืนอุปกรณ์เรียบร้อย');
        renderBorrowalsPage();
    }


    // --- Procurment CRUD Handlers ---
    async function handleAddProcurment() {
        if (!hasPermission('manager')) { showModal('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์ในการเพิ่มข้อมูล'); return; }
        const itemTypes = await api.getItemTypes();
        const formContent = procurmentFormModalContent({}, itemTypes);
        showModal('เพิ่มอุปกรณ์ใหม่', formContent, [ { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }, { text: 'บันทึก', className: 'bg-blue-600 hover:bg-blue-700', actionName: 'saveProcurment' } ]);
    }
    async function handleEditProcurment(itemId) {
        if (!hasPermission('manager')) { showModal('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์ในการแก้ไขข้อมูล'); return; }
        const allProcurment = await api.getProcurment();
        const itemTypes = await api.getItemTypes();
        const item = allProcurment.find(p => p.id === itemId);
        if (!item) return;
        const formContent = procurmentFormModalContent(item, itemTypes);
        showModal('แก้ไขอุปกรณ์', formContent, [ { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }, { text: 'บันทึกการแก้ไข', className: 'bg-blue-600 hover:bg-blue-700', actionName: 'saveProcurment' } ]);
    }
    async function handleDeleteProcurment(itemId) {
        if (!hasPermission('manager')) { showModal('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์ในการลบข้อมูล'); return; }
        const allProcurment = await api.getProcurment();
        const item = allProcurment.find(p => p.id === itemId);
        if (!item) return;
        showModal('ยืนยันการลบ', `คุณต้องการลบอุปกรณ์ "${item.name}" ใช่หรือไม่?`, [ { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }, { text: 'ยืนยัน', className: 'bg-red-600 hover:bg-red-700', actionName: `confirmDeleteProcurment-${itemId}` } ]);
    }
    async function saveProcurment() {
        const id = document.getElementById('item-id').value;
        const newItemData = {
            id: id, no: document.getElementById('item-no').value, name: document.getElementById('item-name').value, type: document.getElementById('item-type').value, stock: parseInt(document.getElementById('item-stock').value, 10), photo: document.getElementById('item-photo').value, detail: '', price: ''
        };
        if (!newItemData.no || !newItemData.name || !newItemData.type) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน'); return;
        }
        await api.saveProcurment(newItemData);
        closeModal(); renderProcurmentPage(); showModal('สำเร็จ', 'บันทึกข้อมูลอุปกรณ์เรียบร้อยแล้ว');
    }

    // --- Member CRUD Handlers ---
    function handleAddMember() {
        if (!hasPermission('manager')) { showModal('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์ในการเพิ่มข้อมูล'); return; }
        const formContent = memberFormModalContent({});
        showModal('ลงทะเบียนสมาชิกใหม่', formContent, [ { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }, { text: 'บันทึก', className: 'bg-blue-600 hover:bg-blue-700', actionName: 'saveMember' } ]);
    }
    async function handleEditMember(memberId) {
        if (!hasPermission('manager')) { showModal('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์ในการแก้ไขข้อมูล'); return; }
        const members = await api.getMembers();
        const member = members.find(m => m.mb_id == memberId);
        if (!member) return;
        const formContent = memberFormModalContent(member);
        showModal('แก้ไขข้อมูลสมาชิก', formContent, [ { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }, { text: 'บันทึกการแก้ไข', className: 'bg-blue-600 hover:bg-blue-700', actionName: 'saveMember' } ]);
    }
    async function handleDeleteMember(memberId) {
        if (!hasPermission('manager')) { showModal('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์ในการลบข้อมูล'); return; }
        const members = await api.getMembers();
        const borrowals = await api.getBorrowals();
        const member = members.find(m => m.mb_id == memberId);
        if (!member) return;
        const hasActiveBorrowal = borrowals.some(b => b.b_identity === member.mb_identity && b.status === 1);
        if (hasActiveBorrowal) {
            showModal('ไม่สามารถลบได้', 'สมาชิกคนนี้มีรายการยืมที่ยังไม่ส่งคืน'); return;
        }
        showModal('ยืนยันการลบ', `คุณต้องการลบสมาชิก "${member.mb_fname} ${member.mb_lname}" ใช่หรือไม่?`, [ { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }, { text: 'ยืนยัน', className: 'bg-red-600 hover:bg-red-700', actionName: `confirmDeleteMember-${memberId}` } ]);
    }
    async function saveMember() {
        const id = document.getElementById('member-id').value;
        const newMemberData = {
            mb_id: id, mb_identity: document.getElementById('member-identity-form').value, mb_title_name: document.getElementById('member-title').value, mb_fname: document.getElementById('member-fname').value, mb_lname: document.getElementById('member-lname').value, mb_teacher: document.getElementById('member-teacher').value, mb_status: '1', mb_date: new Date().toISOString()
        };
        if (!newMemberData.mb_identity || !newMemberData.mb_fname || !newMemberData.mb_lname) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน'); return;
        }
        try {
            await api.saveMember(newMemberData);
            closeModal(); renderMembersPage(); showModal('สำเร็จ', 'บันทึกข้อมูลสมาชิกเรียบร้อยแล้ว');
        } catch (error) {
            alert(error.message);
        }
    }
    
    // --- User CRUD Handlers (Admin only) ---
    function handleAddUser() {
        if (!hasPermission('admin')) { showModal('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์ในการเพิ่มข้อมูล'); return; }
        const formContent = userFormModalContent({});
        showModal('เพิ่มผู้ใช้งานใหม่', formContent, [ { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }, { text: 'บันทึก', className: 'bg-blue-600 hover:bg-blue-700', actionName: 'saveUser' } ]);
    }
    async function handleEditUser(userId) {
        if (!hasPermission('admin')) { showModal('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์ในการแก้ไขข้อมูล'); return; }
        const users = await api.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return;
        const formContent = userFormModalContent(user);
        showModal('แก้ไขข้อมูลผู้ใช้งาน', formContent, [ { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }, { text: 'บันทึกการแก้ไข', className: 'bg-blue-600 hover:bg-blue-700', actionName: 'saveUser' } ]);
    }
    async function handleDeleteUser(userId) {
        if (!hasPermission('admin')) { showModal('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์ในการลบข้อมูล'); return; }
        if (userId == state.currentUser.id) {
            showModal('ผิดพลาด', 'คุณไม่สามารถลบตัวเองได้');
            return;
        }
        const users = await api.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return;
        showModal('ยืนยันการลบ', `คุณต้องการลบผู้ใช้งาน "${user.fname} ${user.lname}" ใช่หรือไม่?`, [ { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' }, { text: 'ยืนยัน', className: 'bg-red-600 hover:bg-red-700', actionName: `confirmDeleteUser-${userId}` } ]);
    }
    async function saveUser() {
        const id = document.getElementById('user-id').value;
        const password = document.getElementById('user-password').value;
        const newUserData = {
            id: id,
            fname: document.getElementById('user-fname').value,
            lname: document.getElementById('user-lname').value,
            type: parseInt(document.getElementById('user-type').value, 10),
            username: document.getElementById('user-username').value,
            password: password, // Will be handled in API
            ll_date: new Date().toISOString().slice(0, 10)
        };

        if (!newUserData.fname || !newUserData.lname || !newUserData.username) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, นามสกุล, username)'); return;
        }
        if (!id && !password) {
            alert('กรุณากำหนดรหัสผ่านสำหรับผู้ใช้งานใหม่'); return;
        }
        try {
            await api.saveUser(newUserData);
            closeModal(); renderUsersPage(); showModal('สำเร็จ', 'บันทึกข้อมูลผู้ใช้งานเรียบร้อยแล้ว');
        } catch(error) {
            alert(error.message);
        }
    }


    // --- Report Handlers ---
    async function handleGenerateUserReport() {
        const users = await api.getUsers();
        const rows = users.map(user => {
            const positionName = getUserPositionName(user.type);
            return `<tr><td class="border p-2">${user.fname} ${user.lname}</td><td class="border p-2">${positionName}</td></tr>`;
        }).join('');
        const content = `<table class="w-full border-collapse"><thead><tr class="bg-gray-200"><th class="border p-2 text-left">ชื่อ-สกุล</th><th class="border p-2 text-left">ตำแหน่ง</th></tr></thead><tbody>${rows}</tbody></table>`;
        showModal('รายงานผู้ใช้งานระบบ', content);
    }
    function handleGenerateBorrowalReport() {
        const formContent = reportDateRangeModalContent();
        showModal('เลือกช่วงวันที่สำหรับรายงาน', formContent, [
            { text: 'ยกเลิก', className: 'bg-gray-500 hover:bg-gray-600', actionName: 'close' },
            { text: 'สร้างรายงาน', className: 'bg-teal-600 hover:bg-teal-700', actionName: 'showBorrowalReport' }
        ]);
    }
    async function showBorrowalReport() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        if (!startDate || !endDate) {
            alert('กรุณาเลือกช่วงวันที่ให้ครบถ้วน');
            return;
        }

        const start = new Date(startDate).getTime();
        const end = new Date(endDate).setHours(23, 59, 59, 999); // Include the whole end day
        
        const borrowals = await api.getBorrowals();
        const filteredData = borrowals.filter(b => {
            const borrowTime = new Date(b.DTime).getTime();
            return borrowTime >= start && borrowTime <= end;
        });

        const reportContent = borrowalReportModalContent(filteredData, formatDateTime);
        showModal('รายงานการยืม-คืน', reportContent);
    }

    // =================================================================
    // ROUTER / NAVIGATION
    // =================================================================
    function navigate(page) {
        if (state.currentPage === 'addBorrow' && page !== 'addBorrow') { state.cart = []; }
        state.currentPage = page;
        switch (page) {
            case 'dashboard': renderDashboardPage(); break;
            case 'procurment': renderProcurmentPage(); break;
            case 'borrowals': renderBorrowalsPage(); break;
            case 'members': renderMembersPage(); break;
            case 'reports': renderReportsPage(); break;
            case 'users': renderUsersPage(); break;
            case 'logout': state.currentUser = null; state.cart = []; renderLogin(); break;
            default: renderLogin();
        }
    }
    
    // Expose functions to be called from HTML (onclick)
    window.appLogic = {
        handleModalAction: async (actionName) => {
            if (actionName === 'close') closeModal();
            else if (actionName === 'saveProcurment') await saveProcurment();
            else if (actionName === 'saveMember') await saveMember();
            else if (actionName === 'saveUser') await saveUser();
            else if (actionName === 'showBorrowalReport') await showBorrowalReport();
            else if (actionName.startsWith('confirmReturn-')) {
                const borrowalId = actionName.split('-')[1];
                await handleConfirmReturn(borrowalId);
            }
            else if (actionName.startsWith('confirmDeleteProcurment-')) {
                const itemId = actionName.split('-')[1];
                await api.deleteProcurment(itemId);
                closeModal(); renderProcurmentPage(); showModal('สำเร็จ', 'ลบข้อมูลอุปกรณ์เรียบร้อยแล้ว');
            } else if (actionName.startsWith('confirmDeleteMember-')) {
                const memberId = actionName.split('-')[1];
                await api.deleteMember(memberId);
                closeModal(); renderMembersPage(); showModal('สำเร็จ', 'ลบข้อมูลสมาชิกเรียบร้อยแล้ว');
            } else if (actionName.startsWith('confirmDeleteUser-')) {
                const userId = actionName.split('-')[1];
                await api.deleteUser(userId);
                closeModal(); renderUsersPage(); showModal('สำเร็จ', 'ลบข้อมูลผู้ใช้งานเรียบร้อยแล้ว');
            }
        },
        navigate, viewBorrowalDetail, returnItems, addToCart, removeFromCart,
        editProcurment: handleEditProcurment, deleteProcurment: handleDeleteProcurment,
        editMember: handleEditMember, deleteMember: handleDeleteMember,
        editUser: handleEditUser, deleteUser: handleDeleteUser,
        generateUserReport: handleGenerateUserReport, generateBorrowalReport: handleGenerateBorrowalReport,
        goToBorrowPage: (identity) => { navigate('borrowals'); setTimeout(() => { renderAddBorrowPage(identity); handleFindMember(); }, 100); }
    };

    // =================================================================
    // INITIALIZATION
    // =================================================================
    navigate('login');
});
