-- ตารางสำหรับเก็บตำแหน่งผู้ใช้งาน (Roles)
CREATE TABLE user_roles (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'เช่น ผู้ดูแลระบบ, หัวหน้างาน, เจ้าหน้าที่'
);

INSERT INTO user_roles (id, name) VALUES
(1, 'ผู้ดูแลระบบ'),
(2, 'หัวหน้างาน'),
(3, 'เจ้าหน้าที่');

-- ตารางผู้ใช้งานระบบ (System Users)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'ควรเก็บเป็นค่า hash ในระบบจริง',
    user_role_id INT NOT NULL,
    ll_date DATE,
    FOREIGN KEY (user_role_id) REFERENCES user_roles(id)
);

-- ตารางประเภทอุปกรณ์
CREATE TABLE item_types (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- ตารางอุปกรณ์ (Procurment)
CREATE TABLE procurment (
    id VARCHAR(50) PRIMARY KEY,
    no VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    photo VARCHAR(255),
    item_type_id VARCHAR(10),
    FOREIGN KEY (item_type_id) REFERENCES item_types(id)
);

-- ตารางสมาชิก (Members)
CREATE TABLE members (
    mb_id VARCHAR(50) PRIMARY KEY,
    mb_identity VARCHAR(20) NOT NULL UNIQUE COMMENT 'รหัสนักศึกษา',
    mb_title_name VARCHAR(20) NOT NULL,
    mb_fname VARCHAR(255) NOT NULL,
    mb_lname VARCHAR(255) NOT NULL,
    mb_teacher VARCHAR(255),
    mb_date DATETIME NOT NULL
);

-- ตารางบันทึกการยืม (Borrowals)
CREATE TABLE borrowals (
    b_id VARCHAR(50) PRIMARY KEY,
    b_identity VARCHAR(20) NOT NULL COMMENT 'รหัสนักศึกษาผู้ยืม',
    b_name VARCHAR(255) NOT NULL,
    b_allow VARCHAR(255) NOT NULL COMMENT 'ชื่อผู้อนุมัติ',
    note TEXT,
    teacher VARCHAR(255),
    status INT NOT NULL COMMENT '1=ยืม, 2=คืนแล้ว',
    rtn_date DATETIME COMMENT 'กำหนดคืน',
    insdate DATETIME COMMENT 'วันที่คืนจริง',
    DTime DATETIME NOT NULL COMMENT 'วันที่ยืม',
    FOREIGN KEY (b_identity) REFERENCES members(mb_identity)
);

-- ตารางรายละเอียดการยืม (Borrowal Details)
CREATE TABLE borrowal_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrowal_id VARCHAR(50) NOT NULL,
    tool_id VARCHAR(50) NOT NULL,
    borrow_quantity INT NOT NULL,
    repatriate_quantity INT DEFAULT 0,
    FOREIGN KEY (borrowal_id) REFERENCES borrowals(b_id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES procurment(id)
);
