// =================================================================
// DATABASE.JS - Mock Database
// Contains all the mock data for the application.
// =================================================================

// --- Exporting Data for use in other modules ---

export const itemTypes = [
    { id: '001', name: 'ฟุตบอล' },
    { id: '002', name: 'ฟุตซอล' },
    { id: '005', name: 'วอลเล่ย์บอล' },
    { id: '006', name: 'บาสเก็ตบอล' },
    { id: '007', name: 'เปตอง' },
    { id: '008', name: 'ตะกร้อ' },
    { id: '009', name: 'แบดมินตัน' },
    { id: '010', name: 'หมากรุก' },
];

export const procurment = [
    { id: '0010', no: '001', type: '001', name: 'ลูกฟุตบอล', detail: '', stock: 2, price: '', photo: 'https://placehold.co/80x80/EFEFEF/333333?text=Football' },
    { id: '0011', no: '002', type: '002', name: 'ลูกฟุตซอล', detail: '', stock: 6, price: '', photo: 'https://placehold.co/80x80/EFEFEF/333333?text=Futsal' },
    { id: '0012', no: '003', type: '005', name: 'ลูกวอลเล่ย์บอล', detail: '.', stock: 5, price: '499', photo: 'https://placehold.co/80x80/EFEFEF/333333?text=Volleyball' },
];

// UPDATED: Removed the 'position' field to rely solely on 'type' for role definition.
export const users = [
    { id: '001', type: 1, fname: 'ผู้ดูแล', lname: 'ระบบ', username: 'admin', password: '1234', ll_date: '2018-05-14' },
    { id: '011', type: 2, fname: 'บัวลอย', lname: 'ไข่หวาน', username: 'emp1', password: '1234', ll_date: '2018-05-14' },
    { id: '012', type: 3, fname: 'บัวจม', lname: 'ไข่เค็ม', username: 'emp2', password: '1234', ll_date: '2018-05-14' },
    { id: '010', type: 3, fname: 'มารุต', lname: 'มาลี', username: 'emp3', password: '1234', ll_date: '2018-05-14' },
];

export const members = [
    { mb_id: 61, mb_identity: '5701102051007', mb_title_name: 'นาย', mb_fname: 'สันติสุข', mb_lname: 'ลีโป', mb_teacher: 'อ.อัรฮาวี', mb_status: '1', mb_date: '2018-05-14 00:00:00' }
];

export const borrowals = [
    { b_id: '0026', b_identity: '5701102051007', b_name: 'สันติสุข ลีโป', b_allow: 'ผู้ดูแลระบบ', note: '-', teacher: 'อ.อัรฮาวี', status: 1, rtn_date: '2018-06-12 12:30:00', insdate: '0000-00-00 00:00:00', DTime: '2018-06-11 07:32:29', details: [{ tool_id: '0010', borrow: 1, repatriate: 0, status: 1 }] },
    { b_id: '0025', b_identity: '5701102051007', b_name: 'สันติสุข ลีโป', b_allow: 'ผู้ดูแลระบบ', note: '-', teacher: 'อ.อัรฮาวี', status: 2, rtn_date: '2018-06-11 07:27:12', insdate: '2018-06-11 07:27:16', DTime: '2018-06-11 07:27:16', details: [{ tool_id: '0010', borrow: 0, repatriate: 1, status: 2 }] }
];
