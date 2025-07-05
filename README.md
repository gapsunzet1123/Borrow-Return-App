# Sport Equipment Borrowing System

✨ ระบบยืม-คืนอุปกรณ์กีฬา ที่พัฒนาด้วย **Vanilla JavaScript** โดยเน้นการออกแบบสถาปัตยกรรมที่สะอาด (Clean Architecture) แยกส่วน Logic, UI Components, และ Data Access Layer ออกจากกันอย่างชัดเจน ทำให้ง่ายต่อการบำรุงรักษาและต่อยอดไปยัง Backend จริงในอนาคต

![สกรีนช็อต 2025-07-05 181747](https://github.com/user-attachments/assets/40b04724-f10c-40da-9372-fa94bf5e1103)
![สกรีนช็อต 2025-07-05 181802](https://github.com/user-attachments/assets/6497f75e-0b40-4446-9eb5-9bdb314bf6e2)

## 🚀 ความสามารถหลัก (Features)

* **การจัดการสิทธิ์ผู้ใช้ (Role-based Access Control)**:
    * **ผู้ดูแลระบบ (Admin)**: จัดการได้ทุกส่วนของระบบ รวมถึงข้อมูลผู้ใช้งาน
    * **อาจารย์/เจ้าหน้าที่ (Manager)**: จัดการอุปกรณ์, สมาชิก, และทำรายการยืม-คืน
    * **นักศึกษา (User)**: ดูข้อมูลและยืม-คืนอุปกรณ์ได้
* **ระบบจัดการข้อมูล (CRUD Operations)**:
    * จัดการข้อมูล **อุปกรณ์ (Procurment)**: เพิ่ม, ลบ, แก้ไข, ค้นหา
    * จัดการข้อมูล **สมาชิก (Members)**: เพิ่ม, ลบ, แก้ไข, ค้นหา
    * จัดการข้อมูล **ผู้ใช้งานระบบ (Users)**: สำหรับ Admin เท่านั้น
* **ระบบยืม-คืน (Borrow-Return Workflow)**:
    * หน้าฟอร์มสำหรับทำรายการยืม โดยมีการตรวจสอบข้อมูลสมาชิกและสต็อกของ
    * ระบบตะกร้า (Cart) สำหรับเลือกอุปกรณ์หลายรายการ
    * สามารถดูประวัติการยืมและยืนยันการคืนอุปกรณ์ได้
* **หน้าแดชบอร์ด (Dashboard)**: สรุปข้อมูลภาพรวมของระบบ เช่น จำนวนอุปกรณ์ทั้งหมด, จำนวนที่ถูกยืม, และจำนวนสมาชิก
* **ระบบรายงาน (Reporting)**: สามารถสร้างรายงานสรุปการยืม-คืนตามช่วงวันที่ และรายงานผู้ใช้งานในระบบได้
* **สถาปัตยกรรมที่พร้อมต่อยอด**:
    * [cite_start]แยกไฟล์ `api.js` สำหรับจัดการข้อมูล ทำให้ง่ายต่อการเปลี่ยนไปใช้ **Real API** ในอนาคต [cite: 1]
    * แยกไฟล์ `components.js` สำหรับสร้าง UI ทำให้โค้ดส่วนแสดงผลเป็นระเบียบ

---

## 🤔 ทำไมต้องมีโปรเจกต์นี้? (Why this project?)

โปรเจกต์นี้ถูกสร้างขึ้นเพื่อเป็น **กรณีศึกษา (Case Study)** สำหรับการพัฒนาเว็บแอปพลิเคชันด้วย **Vanilla JavaScript** ในระดับที่ซับซ้อนกว่าโปรเจกต์เริ่มต้นทั่วไป โดยมีจุดเด่นคือ:

1.  **การจัดการ State แบบ Frontend**: แสดงให้เห็นถึงวิธีการจัดการสถานะของแอปพลิเคชัน (เช่น ข้อมูลผู้ใช้, หน้าปัจจุบัน, ตะกร้าสินค้า) โดยไม่พึ่งพา Framework ใหญ่ๆ
2.  **Clean Architecture**: เป็นตัวอย่างการออกแบบโครงสร้างโปรเจกต์ที่ดี โดยแบ่งไฟล์ตามหน้าที่อย่างชัดเจน (`script.js` สำหรับ Main Logic, `api.js` สำหรับ Data, `components.js` สำหรับ View) ซึ่งเป็นพื้นฐานสำคัญในการพัฒนาซอฟต์แวร์ขนาดใหญ่
3.  [cite_start]**พร้อมสำหรับการเชื่อมต่อ Backend**: มีการเตรียมไฟล์ `คู่มือการเชื่อมต่อฐานข้อมูลจริง (Backend).txt` และ `Database Schema.sql` ไว้ให้ ทำให้ผู้ที่สนใจสามารถนำไปพัฒนาต่อยอดให้เป็นระบบที่สมบูรณ์ได้ง่ายขึ้น [cite: 1]

---

## 🛠️ การติดตั้ง (Prerequisites/Installation)

โปรเจกต์นี้เป็นเว็บแอปพลิเคชันแบบ **Static** (ทำงานฝั่ง Client เท่านั้น) จึง**ไม่จำเป็นต้องมีการติดตั้งที่ซับซ้อน**

คุณแค่ต้องมี **เว็บเบราว์เซอร์ (Web Browser)** รุ่นใหม่ๆ เช่น Google Chrome, Firefox, หรือ Microsoft Edge ก็สามารถเปิดใช้งานได้ทันที

*หมายเหตุ: โปรเจกต์นี้มีการเรียกใช้งาน Library ภายนอกผ่าน CDN ซึ่งเบราว์เซอร์จะโหลดให้เองอัตโนมัติ:*
* *TailwindCSS*
* *Font Awesome*

---

## 🕹️ วิธีการใช้งาน (How to Use)

1.  **Clone a repository** หรือ **ดาวน์โหลดไฟล์ทั้งหมด** จาก GitHub ลงในเครื่องคอมพิวเตอร์ของคุณ
2.  ไปที่โฟลเดอร์ที่คุณเก็บไฟล์ไว้
3.  **ดับเบิลคลิกที่ไฟล์ `index.html`** เพื่อเปิดโปรเจกต์ขึ้นมาในเว็บเบราว์เซอร์ของคุณ
4.  **เข้าสู่ระบบ (Login)**:
    * **Admin**: `username: admin`, `password: 1234`
    * **Manager**: `username: emp1`, `password: 1234`
    * **User**: `username: emp2`, `password: 1234`

---

## 🕹️ คู่มือการเชื่อมต่อฐานข้อมูลจริง (Backend)

ภาพรวมสถาปัตยกรรมปัจจุบัน แอปพลิเคชันของเราทำงานอยู่บน Frontend เท่านั้น (โค้ดทั้งหมดทำงานบนเบราว์เซอร์ของผู้ใช้) และใช้ข้อมูลจำลองจากไฟล์ database.js
ในการเชื่อมต่อกับฐานข้อมูลจริง เราต้องสร้างส่วนที่เรียกว่า Backend (หรือ Server-side) ขึ้นมาทำหน้าที่เป็นตัวกลางระหว่าง Frontend กับฐานข้อมูล (เช่น MySQL)
โดยมีขั้นตอนการทำงานดังนี้:
Frontend (แอปของเรา): ส่งคำขอ (Request) ไปยัง Backend ผ่านสิ่งที่เรียกว่า API (เช่น ขอรายชื่อผู้ใช้ทั้งหมด)
Backend (เซิร์ฟเวอร์): รับคำขอ แล้วไปดึงข้อมูลจาก Database
Backend: ส่งข้อมูลที่ได้กลับมาให้ Frontend ในรูปแบบของ JSON
Frontend: รับข้อมูล JSON มาแสดงผลบนหน้าเว็บ

ขั้นตอนการพัฒนา
1. สร้าง Backend APIคุณต้องสร้างเซิร์ฟเวอร์ด้วยภาษาฝั่งเซิร์ฟเวอร์ที่ถนัด ตัวเลือกที่นิยมได้แก่:
   Node.js (ใช้ภาษา JavaScript) ร่วมกับเฟรมเวิร์ก Express.js
   PHP ร่วมกับเฟรมเวิร์กเช่น Laravel หรือ Slim
   Python ร่วมกับเฟรมเวิร์กเช่น Flask หรือ Django
ตัวอย่าง API Endpoint ที่ต้องสร้าง (ใช้ Express.js เป็นตัวอย่าง):
   GET /api/users -> ดึงข้อมูลผู้ใช้ทั้งหมด
   POST /api/users -> เพิ่มผู้ใช้ใหม่
   GET /api/procurment -> ดึงข้อมูลอุปกรณ์ทั้งหมด
   POST /api/procurment -> เพิ่มอุปกรณ์ใหม่
   PUT /api/procurment/:id -> แก้ไขข้อมูลอุปกรณ์
   DELETE /api/procurment/:id -> ลบอุปกรณ์
2. แก้ไขไฟล์ api.js
เมื่อ Backend ของคุณพร้อมใช้งานแล้ว คุณจะต้องกลับมาแก้ไขฟังก์ชันในไฟล์ api.js ให้เปลี่ยนจากการเรียกใช้ข้อมูลจำลอง มาเป็นการเรียกใช้ API ของคุณผ่านคำสั่ง fetch
ตัวอย่างการแก้ไขฟังก์ชัน getProcurment:

ของเดิม (จากข้อมูลจำลอง):

import { procurment } from './database.js';

export async function getProcurment() {
    return Promise.resolve([...procurment]);
}

ของใหม่ (เรียกใช้ API จริง):

// ไม่ต้อง import procurment จาก database.js อีกต่อไป

export async function getProcurment() {
    try {
        // แก้ไข URL เป็นที่อยู่ของ Backend API ของคุณ
        const response = await fetch('http://localhost:3000/api/procurment'); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch procurment:', error);
        return []; // คืนค่าเป็น array ว่างหากเกิดข้อผิดพลาด
    }
}

ตัวอย่างการแก้ไขฟังก์ชัน saveProcurment (เพิ่ม/แก้ไข):

export async function saveProcurment(itemData) {
    const isEditing = !!itemData.id;
    const url = isEditing 
        ? `http://localhost:3000/api/procurment/${itemData.id}` 
        : 'http://localhost:3000/api/procurment';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });
        if (!response.ok) {
            throw new Error('Failed to save procurment');
        }
        return await response.json();
    } catch (error) {
        console.error('Error saving procurment:', error);
        throw error; // ส่งต่อ error ให้ส่วนที่เรียกใช้จัดการ
    }
}

คุณจะต้องแก้ไขทุกฟังก์ชันใน api.js ให้เป็นลักษณะนี้ ส่วน script.js ที่เรียกใช้ฟังก์ชันเหล่านี้ ไม่ต้องแก้ไขอะไรเลย เพราะเราได้ออกแบบให้มันเป็น async/await รอไว้อยู่แล้ว นี่คือข้อดีของการแยก Data Layer ออกมาครับ

---

## 📜 ใบอนุญาต (License)

This project is licensed under the MIT License.
