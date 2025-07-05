// =================================================================
// COMPONENTS.JS - UI Component Generators
// Contains functions that return HTML strings for different parts of the UI.
// =================================================================

/**
 * Creates the HTML for the Dashboard page.
 * @param {object} stats - An object containing statistics like total items, borrowed items, etc.
 * @returns {string} The HTML content for the page.
 */
export function dashboardPageComponent(stats) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-blue-100 border border-blue-200 p-6 rounded-lg text-center">
                <div class="text-5xl font-bold text-blue-600">${stats.totalProcurment}</div>
                <div class="mt-2 text-lg text-blue-800">อุปกรณ์ทั้งหมด</div>
            </div>
            <div class="bg-yellow-100 border border-yellow-200 p-6 rounded-lg text-center">
                <div class="text-5xl font-bold text-yellow-600">${stats.borrowedItems}</div>
                <div class="mt-2 text-lg text-yellow-800">กำลังถูกยืม</div>
            </div>
            <div class="bg-green-100 border border-green-200 p-6 rounded-lg text-center">
                <div class="text-5xl font-bold text-green-600">${stats.availableItems}</div>
                <div class="mt-2 text-lg text-green-800">พร้อมให้ยืม</div>
            </div>
            <div class="bg-indigo-100 border border-indigo-200 p-6 rounded-lg text-center">
                <div class="text-5xl font-bold text-indigo-600">${stats.totalMembers}</div>
                <div class="mt-2 text-lg text-indigo-800">สมาชิกทั้งหมด</div>
            </div>
        </div>
        <div class="mt-8 bg-white p-6 rounded-lg custom-shadow">
            <h3 class="text-xl font-semibold mb-4">ทางลัด</h3>
            <div class="flex flex-wrap gap-4">
                <button onclick="appLogic.navigate('borrowals')" class="bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105">
                    <i class="fa-solid fa-plus mr-2"></i>ทำรายการยืม-คืน
                </button>
                <button onclick="appLogic.navigate('procurment')" class="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
                    <i class="fa-solid fa-box mr-2"></i>จัดการอุปกรณ์
                </button>
                <button onclick="appLogic.navigate('members')" class="bg-purple-500 text-white px-5 py-3 rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105">
                    <i class="fa-solid fa-users mr-2"></i>จัดการสมาชิก
                </button>
            </div>
        </div>
    `;
}


/**
 * Creates the HTML for the Procurment (Equipment) Management page.
 * @param {Array} items - The list of procurment items.
 * @param {Array} itemTypes - The list of item types for the dropdown.
 * @param {string} searchTerm - The current search term.
 * @param {string} searchType - The current selected search type.
 * @param {number} userType - The type of the current user (for permissions).
 * @returns {string} The HTML content for the page.
 */
export function procurmentPageComponent(items, itemTypes, searchTerm, searchType, userType) {
    const canManage = userType <= 2; // Admin and Manager
    const typeOptions = itemTypes.map(type => `<option value="${type.id}" ${type.id === searchType ? 'selected' : ''}>${type.name}</option>`).join('');

    const tableRows = items.map((item, index) => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-3 text-center">${index + 1}</td>
            <td class="p-3 text-center">${item.no}</td>
            <td class="p-3">${item.name}</td>
            <td class="p-3 text-center font-semibold ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}">${item.stock}</td>
            <td class="p-3 text-center">
                <a href="${item.photo}" target="_blank" class="text-blue-500 hover:text-blue-700"><i class="fa-solid fa-image"></i></a>
            </td>
            ${canManage ? `
            <td class="p-3 text-center">
                <button onclick="appLogic.editProcurment('${item.id}')" class="text-yellow-500 hover:text-yellow-700"><i class="fa-solid fa-pen-to-square"></i></button>
            </td>
            <td class="p-3 text-center">
                <button onclick="appLogic.deleteProcurment('${item.id}')" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
            </td>
            ` : '<td colspan="2"></td>'}
        </tr>
    `).join('');

    return `
        <div class="flex justify-between items-center mb-4">
             <div class="flex space-x-2">
                <input type="text" id="search-term-proc" class="border px-2 py-1 rounded-md" placeholder="ชื่อหรือรหัสอุปกรณ์..." value="${searchTerm}">
                <select id="search-type-proc" class="border px-2 py-1 rounded-md">
                    <option value="0">-- ทุกประเภท --</option>
                    ${typeOptions}
                </select>
                <button id="search-btn-proc" class="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600">ค้นหา</button>
             </div>
             ${canManage ? `<button id="add-item-btn" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                <i class="fa-solid fa-plus mr-2"></i>เพิ่มรายการอุปกรณ์
            </button>` : ''}
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
                <thead class="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr>
                        <th class="p-3 text-center">ลำดับ</th>
                        <th class="p-3 text-center">เลขอุปกรณ์</th>
                        <th class="p-3">ชื่ออุปกรณ์</th>
                        <th class="p-3 text-center">คงเหลือ</th>
                        <th class="p-3 text-center">ภาพ</th>
                        ${canManage ? '<th class="p-3 text-center">แก้ไข</th><th class="p-3 text-center">ลบ</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${tableRows.length > 0 ? tableRows : `<tr><td colspan="${canManage ? 7 : 5}" class="text-center p-4">ไม่พบข้อมูล</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Creates the HTML for the Member Management page.
 * @param {Array} members - The list of members.
 * @param {Array} borrowals - The list of borrowals to check status.
 * @param {string} searchTerm - The current search term.
 * @param {number} userType - The type of the current user (for permissions).
 * @returns {string} The HTML content for the page.
 */
export function membersPageComponent(members, borrowals, searchTerm, userType) {
    const canManage = userType <= 2; // Admin and Manager
    const filteredMembers = members.filter(m => 
        m.mb_identity.includes(searchTerm) ||
        m.mb_fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.mb_lname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tableRows = filteredMembers.map((member, index) => {
        const activeBorrowal = borrowals.find(b => b.b_identity === member.mb_identity && b.status === 1);
        let statusHtml;
        if (activeBorrowal) {
            statusHtml = `<button onclick="appLogic.viewBorrowalDetail('${activeBorrowal.b_id}')" class="text-xs font-semibold text-yellow-700 hover:underline">รอส่งคืน</button>`;
        } else {
            statusHtml = '<span class="text-xs text-green-700">ปกติ</span>';
        }

        return `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 text-center">${index + 1}</td>
                <td class="p-3 text-center">
                    <a href="#" onclick="appLogic.goToBorrowPage('${member.mb_identity}')" class="text-blue-600 hover:underline font-mono">${member.mb_identity}</a>
                </td>
                <td class="p-3">${member.mb_title_name}${member.mb_fname} ${member.mb_lname}</td>
                <td class="p-3">${member.mb_teacher}</td>
                <td class="p-3 text-center">${statusHtml}</td>
                ${canManage ? `
                <td class="p-3 text-center">
                    <button onclick="appLogic.editMember('${member.mb_id}')" class="text-yellow-500 hover:text-yellow-700"><i class="fa-solid fa-pen-to-square"></i></button>
                </td>
                <td class="p-3 text-center">
                    <button onclick="appLogic.deleteMember('${member.mb_id}')" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
                </td>
                ` : '<td colspan="2"></td>'}
            </tr>
        `;
    }).join('');

    return `
        <div class="flex justify-between items-center mb-4">
             <div class="flex space-x-2">
                <input type="text" id="search-term-member" class="border px-2 py-1 rounded-md" placeholder="รหัสหรือชื่อสมาชิก..." value="${searchTerm}">
                <button id="search-btn-member" class="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600">ค้นหา</button>
             </div>
             ${canManage ? `<button id="add-member-btn" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                <i class="fa-solid fa-user-plus mr-2"></i>ลงทะเบียนสมาชิกใหม่
            </button>` : ''}
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
                <thead class="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr>
                        <th class="p-3 text-center">ลำดับ</th>
                        <th class="p-3 text-center">รหัสนักศึกษา</th>
                        <th class="p-3">ชื่อ - นามสกุล</th>
                        <th class="p-3">อาจารย์ที่ปรึกษา</th>
                        <th class="p-3 text-center">สถานะยืม</th>
                        ${canManage ? '<th class="p-3 text-center">แก้ไข</th><th class="p-3 text-center">ลบ</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${tableRows.length > 0 ? tableRows : `<tr><td colspan="${canManage ? 7 : 5}" class="text-center p-4">ไม่พบข้อมูล</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Creates the HTML for the User Management page.
 * @param {Array} users - The list of users.
 * @param {function} getPositionName - Function to get the position name from user type.
 * @returns {string} The HTML content for the page.
 */
export function usersPageComponent(users, getPositionName) {
    const tableRows = users.map((user, index) => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-3 text-center">${index + 1}</td>
            <td class="p-3">${user.fname} ${user.lname}</td>
            <td class="p-3">${getPositionName(user.type)}</td>
            <td class="p-3 text-center">${user.username}</td>
            <td class="p-3 text-center">
                <button onclick="appLogic.editUser('${user.id}')" class="text-yellow-500 hover:text-yellow-700"><i class="fa-solid fa-pen-to-square"></i></button>
            </td>
            <td class="p-3 text-center">
                <button onclick="appLogic.deleteUser('${user.id}')" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    return `
        <div class="flex justify-end items-center mb-4">
             <button id="add-user-btn" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                <i class="fa-solid fa-user-plus mr-2"></i>เพิ่มผู้ใช้งานใหม่
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
                <thead class="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr>
                        <th class="p-3 text-center">ลำดับ</th>
                        <th class="p-3">ชื่อ - นามสกุล</th>
                        <th class="p-3">ตำแหน่ง</th>
                        <th class="p-3 text-center">Username</th>
                        <th class="p-3 text-center">แก้ไข</th>
                        <th class="p-3 text-center">ลบ</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows.length > 0 ? tableRows : `<tr><td colspan="6" class="text-center p-4">ไม่พบข้อมูล</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Creates the HTML for the add/edit procurment item form.
 * @param {Object} item - The item to edit (empty for new item).
 * @param {Array} itemTypes - The list of item types for the dropdown.
 * @returns {string} The HTML content for the form.
 */
export function procurmentFormModalContent(item, itemTypes) {
    const typeOptions = itemTypes.map(type => 
        `<option value="${type.id}" ${item.type === type.id ? 'selected' : ''}>${type.name}</option>`
    ).join('');

    return `
        <form id="procurment-form" class="space-y-4">
            <input type="hidden" id="item-id" value="${item.id || ''}">
            <div> <label for="item-no" class="block text-sm font-medium text-gray-700">เลขอุปกรณ์</label> <input type="text" id="item-no" value="${item.no || ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> </div>
            <div> <label for="item-name" class="block text-sm font-medium text-gray-700">ชื่ออุปกรณ์</label> <input type="text" id="item-name" value="${item.name || ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> </div>
            <div> <label for="item-type" class="block text-sm font-medium text-gray-700">ประเภท</label> <select id="item-type" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> <option value="">-- เลือกประเภท --</option> ${typeOptions} </select> </div>
            <div> <label for="item-stock" class="block text-sm font-medium text-gray-700">จำนวน (คงเหลือ)</label> <input type="number" id="item-stock" value="${item.stock || 0}" required min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> </div>
            <div> <label for="item-photo" class="block text-sm font-medium text-gray-700">URL รูปภาพ</label> <input type="text" id="item-photo" value="${item.photo || ''}" placeholder="https://placehold.co/80x80/..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> </div>
        </form>
    `;
}

/**
 * Creates the HTML for the add/edit member form.
 * @param {Object} member - The member to edit (empty for new member).
 * @returns {string} The HTML content for the form.
 */
export function memberFormModalContent(member) {
    const titleOptions = ['นาย', 'นางสาว', 'นาง'].map(title => 
        `<option value="${title}" ${member.mb_title_name === title ? 'selected' : ''}>${title}</option>`
    ).join('');

    return `
        <form id="member-form" class="space-y-4">
            <input type="hidden" id="member-id" value="${member.mb_id || ''}">
            <div> <label for="member-identity" class="block text-sm font-medium text-gray-700">รหัสนักศึกษา</label> <input type="text" id="member-identity-form" value="${member.mb_identity || ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> </div>
            <div> <label for="member-title" class="block text-sm font-medium text-gray-700">คำนำหน้าชื่อ</label> <select id="member-title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> ${titleOptions} </select> </div>
            <div> <label for="member-fname" class="block text-sm font-medium text-gray-700">ชื่อ</label> <input type="text" id="member-fname" value="${member.mb_fname || ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> </div>
            <div> <label for="member-lname" class="block text-sm font-medium text-gray-700">นามสกุล</label> <input type="text" id="member-lname" value="${member.mb_lname || ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> </div>
            <div> <label for="member-teacher" class="block text-sm font-medium text-gray-700">อาจารย์ที่ปรึกษา</label> <input type="text" id="member-teacher" value="${member.mb_teacher || ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"> </div>
        </form>
    `;
}

/**
 * Creates the HTML for the add/edit user form.
 * @param {Object} user - The user to edit (empty for new user).
 * @returns {string} The HTML content for the form.
 */
export function userFormModalContent(user) {
    const userTypes = [
        { id: 1, name: 'ผู้ดูแลระบบ' },
        { id: 2, name: 'หัวหน้างาน' },
        { id: 3, name: 'เจ้าหน้าที่' }
    ];
    const typeOptions = userTypes.map(type => 
        `<option value="${type.id}" ${user.type == type.id ? 'selected' : ''}>${type.name}</option>`
    ).join('');

    return `
        <form id="user-form" class="space-y-4">
            <input type="hidden" id="user-id" value="${user.id || ''}">
            <div> <label for="user-fname" class="block text-sm font-medium text-gray-700">ชื่อ</label> <input type="text" id="user-fname" value="${user.fname || ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"> </div>
            <div> <label for="user-lname" class="block text-sm font-medium text-gray-700">นามสกุล</label> <input type="text" id="user-lname" value="${user.lname || ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"> </div>
            <div> <label for="user-type" class="block text-sm font-medium text-gray-700">ตำแหน่ง</label> <select id="user-type" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"> ${typeOptions} </select> </div>
            <hr>
            <div> <label for="user-username" class="block text-sm font-medium text-gray-700">Username</label> <input type="text" id="user-username" value="${user.username || ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"> </div>
            <div> <label for="user-password" class="block text-sm font-medium text-gray-700">Password</label> <input type="password" id="user-password" placeholder="${user.id ? 'ปล่อยว่างไว้หากไม่ต้องการเปลี่ยน' : ''}" ${user.id ? '' : 'required'} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"> </div>
        </form>
    `;
}


/**
 * Creates the HTML for the Reports page.
 * @returns {string} The HTML content for the page.
 */
export function reportsPageComponent() {
    return `
        <div class="space-y-4">
            <p class="text-gray-600">เลือกรายงานที่ต้องการสร้างจากรายการด้านล่างนี้</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="border p-4 rounded-lg">
                    <h4 class="font-semibold text-lg mb-2">รายงานการยืม-คืน</h4>
                    <p class="text-sm text-gray-500 mb-3">สร้างรายงานสรุปรายการยืมและคืนทั้งหมดตามช่วงวันที่</p>
                    <button onclick="appLogic.generateBorrowalReport()" class="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 w-full">สร้างรายงาน</button>
                </div>
                <div class="border p-4 rounded-lg">
                    <h4 class="font-semibold text-lg mb-2">รายงานผู้ใช้งานระบบ</h4>
                    <p class="text-sm text-gray-500 mb-3">สร้างรายงานข้อมูลผู้ใช้งานทั้งหมดในระบบ</p>
                    <button onclick="appLogic.generateUserReport()" class="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 w-full">สร้างรายงาน</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Creates the HTML for the date range selection modal for reports.
 * @returns {string} The HTML for the modal content.
 */
export function reportDateRangeModalContent() {
    return `
        <form id="report-date-form" class="space-y-4">
            <div>
                <label for="start-date" class="block text-sm font-medium text-gray-700">ตั้งแต่วันที่</label>
                <input type="date" id="start-date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
                <label for="end-date" class="block text-sm font-medium text-gray-700">ถึงวันที่</label>
                <input type="date" id="end-date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
        </form>
    `;
}

/**
 * Creates the HTML for the borrowal report result.
 * @param {Array} reportData - The filtered borrowal data.
 * @param {function} formatDateTime - Helper function to format dates.
 * @returns {string} The HTML for the report table.
 */
export function borrowalReportModalContent(reportData, formatDateTime) {
    if (reportData.length === 0) {
        return '<p class="text-center">ไม่พบข้อมูลในช่วงวันที่ที่เลือก</p>';
    }

    const rows = reportData.map((item, index) => {
        const statusText = item.status === 1 ? 'รอส่งคืน' : 'คืนแล้ว';
        return `
            <tr class="border-b">
                <td class="p-2 text-center">${index + 1}</td>
                <td class="p-2">${item.b_name}</td>
                <td class="p-2">${formatDateTime(item.DTime)}</td>
                <td class="p-2">${formatDateTime(item.rtn_date)}</td>
                <td class="p-2 text-center">${statusText}</td>
            </tr>
        `;
    }).join('');

    return `
        <div class="max-h-96 overflow-y-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-100 sticky top-0">
                    <tr class="border-b">
                        <th class="p-2 text-center">ลำดับ</th>
                        <th class="p-2 text-left">ผู้ยืม</th>
                        <th class="p-2 text-left">วันที่ยืม</th>
                        <th class="p-2 text-left">กำหนดคืน</th>
                        <th class="p-2 text-center">สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Creates the HTML for the return verification modal.
 * @param {object} borrowal - The borrowal record to be verified.
 * @returns {string} The HTML for the modal content.
 */
export function returnVerificationModalContent(borrowal) {
    return `
        <div>
            <p class="mb-4">กรุณายืนยันตัวตนผู้คืนสำหรับรายการของ <strong>${borrowal.b_name}</strong></p>
            <form id="return-verify-form">
                 <label for="returner-identity" class="block text-sm font-medium text-gray-700">ป้อนรหัสนักศึกษา หรือ ชื่อผู้ยืม</label>
                 <input type="text" id="returner-identity" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="รหัสนักศึกษา หรือ ชื่อ">
            </form>
        </div>
    `;
}
