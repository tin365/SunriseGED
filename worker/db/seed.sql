INSERT OR IGNORE INTO users (id, email, password_hash, role, name, totp_enabled, must_change_password)
VALUES (
  'usr_admin_001',
  'admin@sunrisegeded.org',
  '$2b$12$PLACEHOLDER_REPLACE_WITH_REAL_BCRYPT_HASH',
  'super_admin',
  'Sunrise Administrator',
  0,
  1
);

INSERT OR IGNORE INTO posts (id, title_en, title_my, title_th, body_en, body_my, body_th, excerpt_en, excerpt_my, excerpt_th, type, status, published_at)
VALUES
(
  'post_001',
  'Welcome to Sunrise GED',
  'Sunrise GED မှ ကြိုဆိုပါသည်',
  'ยินดีต้อนรับสู่ Sunrise GED',
  '<p>Sunrise Trauma Healing Education opens its doors to Myanmar refugee teens in Mae Sot, Thailand, offering GED preparation, trauma healing, and a community built on compassion and hope.</p>',
  '<p>Sunrise Trauma Healing Education သည် ထိုင်းနိုင်ငံ မေဆော့မြို့ရှိ မြန်မာဒုက္ခသည် လူငယ်များအတွက် GED ပြင်ဆင်မှု၊ စိတ်ဒဏ်ရာကုသမှုနှင့် သနားကြင်နာမှု၊ မျှော်လင့်ချက်တို့အပေါ် တည်ဆောက်ထားသော အသိုင်းအဝိုင်းကို ပေးအပ်နေပါသည်။</p>',
  '<p>Sunrise Trauma Healing Education เปิดประตูต้อนรับเยาวชนผู้ลี้ภัยจากเมียนมาในแม่สอด ประเทศไทย ด้วยการเตรียมสอบ GED การเยียวยาบาดแผลทางใจ และชุมชนที่ตั้งอยู่บนความเมตตาและความหวัง</p>',
  'A new beginning for students in Mae Sot.',
  'မေဆော့ရှိ ကျောင်းသားများအတွက် အစသစ်တစ်ခု။',
  'จุดเริ่มต้นใหม่สำหรับนักเรียนในแม่สอด',
  'announcement',
  'published',
  datetime('now', '-3 days')
),
(
  'post_002',
  'Community Sports Day Builds Confidence',
  'အသိုင်းအဝိုင်း အားကစားနေ့က ယုံကြည်မှု တည်ဆောက်ပေးသည်',
  'วันกีฬาชุมชนช่วยสร้างความมั่นใจ',
  '<p>Students, teachers, and volunteers gathered for a day of team games, shared meals, and encouragement. Activities like these help young people rebuild trust and joy.</p>',
  '<p>ကျောင်းသား၊ ဆရာများနှင့် စေတနာ့ဝန်ထမ်းများသည် အဖွဲ့လိုက်ကစားနည်းများ၊ အတူစားသောက်ခြင်းနှင့် အားပေးမှုများအတွက် စုဝေးခဲ့ကြပါသည်။ ဤကဲ့သို့သော လှုပ်ရှားမှုများက လူငယ်များ၏ ယုံကြည်မှုနှင့် ပျော်ရွှင်မှုကို ပြန်လည်တည်ဆောက်ရာတွင် ကူညီပေးပါသည်။</p>',
  '<p>นักเรียน ครู และอาสาสมัครรวมตัวกันเพื่อเล่นเกมเป็นทีม รับประทานอาหารร่วมกัน และให้กำลังใจกัน กิจกรรมเช่นนี้ช่วยให้เยาวชนฟื้นฟูความไว้วางใจและความสุข</p>',
  'Team activities support healing and belonging.',
  'အဖွဲ့လိုက် လှုပ်ရှားမှုများက ကုသမှုနှင့် ပါဝင်မှုခံစားချက်ကို ထောက်ပံ့သည်။',
  'กิจกรรมเป็นทีมสนับสนุนการเยียวยาและความรู้สึกเป็นส่วนหนึ่ง',
  'activity',
  'published',
  datetime('now', '-2 days')
),
(
  'post_003',
  'GED Preparation Classes Open for Applications',
  'GED ပြင်ဆင်ရေး အတန်းများအတွက် လျှောက်လွှာ ဖွင့်ထားပါသည်',
  'เปิดรับสมัครชั้นเรียนเตรียม GED',
  '<p>Applications are open for the next GED preparation cohort. Students should apply early so the team can review education history, support needs, and language level.</p>',
  '<p>လာမည့် GED ပြင်ဆင်ရေးအုပ်စုအတွက် လျှောက်လွှာများ ဖွင့်ထားပါသည်။ ပညာရေးနောက်ခံ၊ အထောက်အပံ့လိုအပ်ချက်များနှင့် ဘာသာစကားအဆင့်ကို အဖွဲ့မှ စိစစ်နိုင်ရန် ကျောင်းသားများ အစောပိုင်း လျှောက်ထားသင့်ပါသည်။</p>',
  '<p>ขณะนี้เปิดรับสมัครนักเรียนกลุ่มใหม่สำหรับการเตรียมสอบ GED นักเรียนควรสมัครล่วงหน้าเพื่อให้ทีมงานตรวจสอบประวัติการศึกษา ความต้องการด้านการสนับสนุน และระดับภาษา</p>',
  'Apply early for the next student cohort.',
  'လာမည့်အုပ်စုအတွက် အစောပိုင်း လျှောက်ထားပါ။',
  'สมัครล่วงหน้าสำหรับนักเรียนรุ่นถัดไป',
  'news',
  'published',
  datetime('now', '-1 day')
);

INSERT OR IGNORE INTO media (id, type, title_en, title_my, title_th, url, thumbnail_url, youtube_id, created_at)
VALUES
('media_001', 'photo', 'Classroom learning circle', 'စာသင်ခန်း လေ့လာရေးဝိုင်း', 'วงเรียนรู้ในห้องเรียน', '/sample/classroom.jpg', '/sample/classroom.jpg', NULL, datetime('now', '-5 days')),
('media_002', 'photo', 'Student activity day', 'ကျောင်းသား လှုပ်ရှားမှုနေ့', 'วันกิจกรรมนักเรียน', '/sample/activity.jpg', '/sample/activity.jpg', NULL, datetime('now', '-4 days')),
('media_003', 'youtube', 'Sunrise community introduction', 'Sunrise အသိုင်းအဝိုင်း မိတ်ဆက်', 'แนะนำชุมชน Sunrise', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'dQw4w9WgXcQ', datetime('now', '-3 days')),
('media_004', 'document', 'Enrollment information sheet', 'ကျောင်းဝင်ခွင့် အချက်အလက်စာရွက်', 'เอกสารข้อมูลการสมัคร', '/documents/enrollment-info.pdf', NULL, NULL, datetime('now', '-2 days'));
