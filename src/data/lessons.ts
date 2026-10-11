import { Lesson, Flashcard } from "../types";

export const lessonsData: Lesson[] = [
  {
    id: "buoi-1",
    sessionNum: 1,
    type: "reading",
    badge: "Reading • Unit 1 • Parts 5, 6, 7",
    title: "Buổi 1: Danh Từ & Đại Từ (Nouns & Pronouns)",
    desc: "Chức năng, vị trí của Danh từ, phân biệt danh từ đếm được / không đếm được và bảng Đại từ trong đề thi TOEIC.",
    core: [
      {
        title: "A. Chức năng của Danh từ (Noun)",
        code: ["làm S (trước V)", "làm O (sau V)", "be + N", "prep + N"],
        desc: [
          "Danh từ làm Chủ ngữ (đứng trước V), làm Tân ngữ (đứng sau V), làm bổ ngữ sau Be, hoặc đứng sau Giới từ.",
        ],
      },
      {
        title: "B. Vị trí của Danh từ",
        code: ["mạo từ + N", "TTSH + N", "(mạo từ) + adj + N"],
        desc: [
          "Cụm danh từ: Mạo từ hoặc Tính từ sở hữu đứng đầu, Tính từ bổ nghĩa đứng giữa, Danh từ chính đứng cuối cụm.",
        ],
      },
    ],
    grids: [
      {
        title: "1. Danh từ Đếm được vs Không đếm được",
        items: [
          "Đếm được (Countable): đi cùng a / an / the / many / few / several / these / those...",
          "Không đếm được (Uncountable): đi cùng the / much / a little / little / less...",
          "Danh từ không đếm được TOEIC hay bẫy: information, equipment, advice, luggage, baggage, furniture, news",
        ],
      },
      {
        title: "2. Bảng Đại Từ TOEIC (Pronouns)",
        items: [
          "Chủ ngữ (Subject): I, You, He, She, It, We, They (đứng trước V làm chủ ngữ)",
          "Tân ngữ (Object): Me, You, Him, Her, It, Us, Them (đứng sau V hoặc sau Giới từ)",
          "Tính từ sở hữu (Possessive Adj): My, Your, His, Her, Its, Our, Their (+ Danh từ)",
          "Đại từ sở hữu (Possessive Pronoun): Mine, Yours, His, Hers, Ours, Theirs (= TTSH + N, đứng độc lập)",
          "Đại từ phản thân (Reflexive): Myself, Yourself, Himself, Herself, Itself, Ourselves, Themselves (by oneself)",
        ],
      },
    ],
    tips: [
      {
        tag: "MẸO PART 5",
        text: "Trước chỗ trống có Mạo từ (a/an/the) hoặc Tính từ sở hữu, sau chỗ trống là Giới từ hoặc Động từ -> Điền ngay DANH TỪ.",
      },
      {
        tag: "BẪY CỰC NGUY HIỂM",
        text: "Phân biệt Tính từ sở hữu (bắt buộc phải có Danh từ theo sau: her car) và Đại từ sở hữu (đứng một mình, không có danh từ theo sau: The car is hers).",
      },
    ],
    homework: {
      deadline: "Thứ 6, 11/9 (Trước buổi học Reading tiếp theo)",
      tasks: [
        "LMS (Bắt buộc): HW_Pre Toeic_Reading 1_Unit 1_Part 5,6,7, - Nouns & Pronouns",
        "LMS (Bắt buộc): Vocabulary test - Pre Toeic - Reading 1 - Unit 1: Parts 5, 6, 7 - Nouns & Pronouns",
        "Student's Book: Làm trước phần Lesson Preparation của Unit 2 (trang 16, 17)",
        "Quizlet: Ôn từ vựng qua link Quizlet (buổi sau kiểm tra đầu giờ)",
      ],
      links: [
        {
          name: "Quizlet Buổi 1 (Reading 1 - Unit 1: Nouns & Pronouns)",
          url: "https://quizlet.com/1191486818/flashcards?funnelUUID=ede86e0e-c957-47fd-b128-14478ceb9ac8",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-2",
    sessionNum: 2,
    type: "listening",
    badge: "Listening • Unit 1 • Part 1",
    title: "Buổi 2: Tranh Tả Người (Photos of People)",
    desc: "Kỹ năng nghe miêu tả hành động của người trong Part 1, cấu trúc S + be + V-ing, các bẫy thường gặp.",
    core: [
      {
        title: "Cấu trúc kinh điển: Diễn tả hành động đang diễn ra",
        code: "S + be + V-ing",
        desc: "Mẹo làm bài: Lắng nghe và đối chiếu sát sao giữa Chủ ngữ (S) và Động từ hành động (V-ing).",
      },
    ],
    grids: [
      {
        title: "Chủ ngữ chỉ người (Subject)",
        items: [
          "Tranh 1 người: He / She / The man / The woman / Danh từ nghề nghiệp (doctor, chef, driver...)",
          "Tranh từ 2 người trở lên: They / People / The group / The men / The women / Passengers",
        ],
      },
      {
        title: "Động từ hành động theo bộ phận",
        items: [
          "Mắt: review, examine, inspect, look at, gaze at, read",
          "Tay: point at, arrange, hold, type, carry, shake hands",
          "Chân: hike, walk, ride, step onto, climb",
          "Tư thế: lie down, lean against (tựa vào), sit, stand",
        ],
      },
    ],
    tips: [
      {
        tag: "CHIẾN THUẬT",
        text: "Trước khi băng đọc, quan sát thật nhanh: Ai đang làm gì? Hành động của tay/mắt nổi bật nhất là gì? Tư thế đứng hay ngồi?",
      },
      {
        tag: "BẪY THƯỜNG GẶP",
        text: "Sai chủ ngữ (hình phụ nữ nhưng đọc 'He is...'), hoặc động từ không có thật trong hình (bẫy lừa tai).",
      },
    ],
    homework: {
      deadline: "Thứ 2, 14/9 (Trước buổi Listening tiếp theo)",
      tasks: [
        "LMS: HW_Pre Toeic_Listening 1_Unit 1_Part 1 - Photos of People",
        "LMS: DIAGNOSTIC TEST - TOEIC PRE",
        "LMS: Vocabulary test - Pre Toeic - Listening 1 - Unit 1",
        "Student's Book: Chuẩn bị Lesson Preparation Unit 2 (trang 112, 113)",
      ],
      links: [
        {
          name: "Quizlet Buổi 2 (Kiểm tra đầu giờ)",
          url: "https://quizlet.com/1194046606/flashcards?funnelUUID=661ad734-193e-4807-95f7-0cdbb0f13253",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-3",
    sessionNum: 3,
    type: "reading",
    badge: "Reading • Unit 2 • Parts 5, 6, 7",
    title: "Buổi 3: Tính Từ & Trạng Từ (Adjectives & Adverbs)",
    desc: "Chức năng, vị trí của Tính từ & Trạng từ, các tính từ đuôi -ly, từ vừa là Adj vừa là Adv và cấu trúc so sánh.",
    core: [
      {
        title: "A. Vị trí của Tính từ (Adj)",
        code: "Be + (a/an/the) + Adj + Noun  |  It is + Adj + to V  |  Linking V + Adj  |  Make / Keep / Find + O + Adj",
        desc: "Lưu ý Linking Verbs: look, seem, appear, sound, feel, taste, become, remain, stay + Adj.",
      },
      {
        title: "B. Vị trí của Trạng từ (Adv)",
        code: "Adv + Adj  |  Adv + V  |  V + (O) + Adv  |  Adv, S + V",
        desc: "Trạng từ bổ nghĩa cho Tính từ, Động từ thường hoặc đứng đầu câu bổ nghĩa cả câu.",
      },
    ],
    grids: [
      {
        title: "1. Tính từ có đuôi -ly (Dễ nhầm là Trạng từ)",
        items: [
          "Friendly (thân thiện), Costly (đắt đỏ)",
          "Timely (kịp thời, đúng lúc), Orderly (ngăn nắp)",
          "Lovely, Lively, Daily, Weekly...",
        ],
      },
      {
        title: "2. Vừa là Tính từ vừa là Trạng từ",
        items: [
          "Fast (nhanh - không có fastly)",
          "Hard (chăm chỉ/vất vả - hardly = hiếm khi)",
          "Early, Late (lately = gần đây), High, Close",
        ],
      },
      {
        title: "3. Cấu trúc So Sánh",
        items: [
          "So sánh hơn: Adj/Adv ngắn + er + than | more + Adj/Adv dài + than",
          "So sánh nhất: the + Adj/Adv ngắn + est | the most + Adj/Adv dài",
        ],
      },
    ],
    tips: [
      {
        tag: "MẸO 3 GIÂY",
        text: "Gặp các động từ Make / Keep / Find + Tân ngữ -> ngay lập tức tìm TÍNH TỪ điền vào (VD: Keep the room clean, find the course helpful).",
      },
    ],
    homework: {
      deadline: "Thứ 4, 16/9 (Trước buổi Reading tiếp theo)",
      tasks: [
        "LMS: HW_Reading 2 - Adjectives & Adverbs",
        "LMS: Minitest Listening Part 1 - Pre Toeic",
        "LMS: Vocabulary test - Reading 2 - Adjectives & Adverbs",
        "Student's Book: Chuẩn bị Lesson Preparation Unit 3 Reading",
      ],
      links: [
        {
          name: "Quizlet Buổi 3 (Adj & Adv)",
          url: "https://quizlet.com/vn/1192105919/toeic-pre-reading-2-adj-adv-flash-cards/?funnelUUID=ffe8a747-2c29-45d8-9cbe-b5d8358f35fb",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-4",
    sessionNum: 4,
    type: "listening",
    badge: "Listening • Unit 2 • Part 1",
    title: "Buổi 4: Tranh Tả Vật & Cảnh (Objects & Scenes)",
    desc: "3 cấu trúc vàng miêu tả tranh cảnh & vật, bẫy 'being + V3', từ vựng nội thất và giao thông.",
    core: [
      {
        title: "1. Trạng thái vật sau khi bị tác động",
        code: "S + be + V3/V-pp + place",
        desc: "Ví dụ: Some pictures are hung on the wall. (Vài bức tranh được treo trên tường)",
      },
      {
        title: "2. Sự tồn tại của vật tại một địa điểm",
        code: "There + be + Noun + place",
        desc: "Ví dụ: There is a grassy area beside the path. (Có một bãi cỏ bên cạnh lối đi)",
      },
      {
        title: "3. Vị trí tĩnh của đồ vật",
        code: "S + be + place",
        desc: "Ví dụ: Some cooking pots are on the counter. (Những chiếc nồi đang ở trên quầy)",
      },
    ],
    grids: [
      {
        title: "Nội thất & Cơ sở vật chất",
        items: [
          "Counter, shelf, drawer, cabinet, railing",
          "Hung on, placed on, arranged neatly",
        ],
      },
      {
        title: "Giao thông & Cảnh quan",
        items: [
          "Path, sidewalk, pedestrian crossing, curb",
          "Parked along, intersection, grassy area",
        ],
      },
    ],
    tips: [
      {
        tag: "BẪY CỰC NGUY HIỂM",
        text: "Khi tranh KHÔNG có người mà câu miêu tả dùng 'is/are being + V3' (đang được ai đó làm) thì 99% là đáp án SAI! (Ngoại trừ: being displayed, being cast).",
      },
    ],
    homework: {
      deadline: "Thứ 6, 18/9 (Trước buổi Listening tiếp theo)",
      tasks: [
        "LMS: HW_Listening 2_Part 1_Photos of objects and scenes",
        "LMS: Vocabulary test - Listening 2 - Unit 2: Part 1",
        "Student's Book: Chuẩn bị Lesson Preparation Unit 3 Listening",
      ],
      links: [
        {
          name: "Quizlet Buổi 4 (Vật & Cảnh)",
          url: "https://quizlet.com/vn/1208232078/to-pre-lis-2-photos-of-object-scenes-flash-cards/?new",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-5",
    sessionNum: 5,
    type: "reading",
    badge: "Reading • Unit 3 • Parts 5, 6, 7",
    title: "Buổi 5: Các Thì Ngữ Pháp Trọng Điểm (Verb Tenses)",
    desc: "Hệ thống thì Đơn, Tiếp diễn, Hoàn thành và các dấu hiệu nhận biết thời gian kinh điển trong TOEIC.",
    core: [
      {
        title: "Nhóm Thì Đơn & Tiếp Diễn",
        code: "HT Đơn: S + V/Vs/es  |  QK Đơn: S + Ved/Vbqt  |  TL Đơn: S + will V  |  Tiếp diễn: be + V-ing",
        desc: "Dấu hiệu HTĐ: always, usually, often, every day... QKĐ: yesterday, ago, last week, in 2020... TLĐ: tomorrow, next week, soon...",
      },
      {
        title: "Thì Hiện Tại Hoàn Thành",
        code: "S + have/has + V-pp (V3)",
        desc: "Dấu hiệu kinh điển: For + khoảng thời gian, Since + mốc thời gian, already, yet, recently, so far...",
      },
    ],
    grids: [
      {
        title: "Chiến Lược 3 Bước Giải Câu Thì Part 5",
        items: [
          "Bước 1: Xác định câu đã có Động từ chính chưa (nếu chưa, loại V-ing/To-V trơ trọi)",
          "Bước 2: Xét sự hòa hợp Chủ ngữ - Động từ (S số ít hay số nhiều)",
          "Bước 3: Tìm dấu hiệu thời gian và xét Chủ động / Bị động",
        ],
      },
    ],
    tips: [
      {
        tag: "LƯU Ý",
        text: "Trong mệnh đề trạng ngữ chỉ thời gian (When, While, As soon as, Before, After) KHÔNG dùng thì tương lai 'will' mà dùng Hiện tại đơn để chỉ tương lai.",
      },
    ],
    homework: {
      deadline: "Thứ 2, 21/9 (Trước buổi Reading tiếp theo)",
      tasks: [
        "LMS: HW_Pre Toeic_Reading 3_Unit 3_Parts 5, 6, 7 - Verb Tenses",
        "LMS: Vocabulary test - Reading 3 - Unit 3: Parts 5, 6, 7",
        "Student's Book: Chuẩn bị Lesson Preparation Unit 4 Reading",
      ],
      links: [
        {
          name: "Quizlet Buổi 5 (Verb Tenses)",
          url: "https://quizlet.com/1192789810/flashcards?funnelUUID=0ef38878-27ad-4b17-9443-a1017d1ce814",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-6",
    sessionNum: 6,
    type: "listening",
    badge: "Listening • Unit 3 • Part 2",
    title: "Buổi 6: Wh- Questions (1) - WHO, WHAT, WHICH",
    desc: "Kỹ năng loại trừ câu hỏi Wh-, bẫy gần âm, bẫy đồng âm và nhóm đáp án né tránh 'I don't know'.",
    core: [
      {
        title: "4 Nguyên Tắc Vàng Loại Trừ Part 2",
        code: "Wh- cấm Yes/No  |  Tránh bẫy gần âm  |  Cẩn thận từ đồng âm  |  Ưu tiên nhóm 'I don't know'",
        desc: "Nhóm câu trả lời né tránh (I have no idea, Let me check, It hasn't been announced...) có tỉ lệ đúng cực cao (~95%).",
      },
    ],
    grids: [
      {
        title: "1. WHO (Hỏi người)",
        items: [
          "Mr/Ms + Tên riêng",
          "Chức vụ/Nghề nghiệp: Manager, Supervisor, Director...",
          "Phòng ban: HR, Accounting, Marketing...",
          "Đại từ: Someone in sales, One of the interns",
        ],
      },
      {
        title: "2. WHAT (Hỏi thông tin)",
        items: [
          "What + price/cost -> Số + đơn vị tiền tệ ($50)",
          "What time -> Mốc giờ (At 3 PM)",
          "What color -> Màu sắc",
          "What's weather -> Thời tiết (Sunny, rainy)",
        ],
      },
      {
        title: "3. WHICH (Hỏi lựa chọn)",
        items: [
          "The one + Giới từ + Noun (The one on the desk)",
          "The + Adj + one (The blue one)",
          "Tên cụ thể của vật được chọn",
        ],
      },
    ],
    tips: [
      {
        tag: "QUY TẮC BẤT DI BẤT DỊCH",
        text: "Bất kể câu hỏi Wh- nào (Who, What, Where, When, Why, How) mà đáp án bắt đầu bằng 'Yes', 'No', 'Sure', 'Of course' -> LOẠI NGAY LẬP TỨC!",
      },
    ],
    homework: {
      deadline: "Thứ 4, 23/9 (Trước buổi Listening tiếp theo)",
      tasks: [
        "LMS: HW_Pre Toeic_Listening 3_Unit 3_Part 2 - Information Question (1)",
        "LMS: Minitest Reading Part 5 - Pre Toeic (Nộp đủ)",
        "LMS: Vocabulary test - Pre Toeic - Listening 3",
      ],
      links: [
        {
          name: "Quizlet Buổi 6 (Part 2 Info 1)",
          url: "https://quizlet.com/1210498948/flashcards?funnelUUID=ad9ac91d-fa3a-47cc-b438-804bf50a603b",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-7",
    sessionNum: 7,
    type: "reading",
    badge: "Reading • Unit 4 • Parts 5, 6, 7",
    title: "Buổi 7: Câu Chủ Động & Bị Động (Active vs Passive)",
    desc: "Công thức Be + V-pp ở các thì và mẹo phân biệt nhanh qua sự xuất hiện của Tân ngữ (Object).",
    core: [
      {
        title: "Cốt Lõi Bị Động: BE + V-pp (V3)",
        code: "Đơn: be + Vpp  |  Tiếp diễn: be + being + Vpp  |  Hoàn thành: have/has + been + Vpp",
        desc: "Ví dụ: The contract was signed yesterday. The building is being renovated.",
      },
    ],
    grids: [
      {
        title: "Mẹo 3 Giây Nhận Biết Trong TOEIC",
        items: [
          "Chủ động (Active): Sau chỗ trống CÓ TÂN NGỮ (Danh từ nhận tác động)",
          "Bị động (Passive): Sau chỗ trống KHÔNG CÓ TÂN NGỮ — thường ngay sau là Giới từ (by, in, at...), Trạng từ (adv) hoặc Dấu chấm câu.",
        ],
      },
    ],
    tips: [
      {
        tag: "MẸO PART 5",
        text: "Nếu phía sau chỗ trống có giới từ 'by + O' hoặc một giới từ chỉ nơi chốn mà không có danh từ làm tân ngữ, 90% chọn dạng Bị động Be + V-pp.",
      },
    ],
    homework: {
      deadline: "Thứ 6, 25/9 (Trước buổi Reading tiếp theo)",
      tasks: [
        "LMS: HW_Pre Toeic_Reading 4_Unit 4_Parts 5, 6, 7 - Active & Passive Voice",
        "LMS: Vocabulary test - Pre Toeic - Reading 4",
        "Student's Book: Chuẩn bị Lesson Preparation Unit 5 Reading",
      ],
      links: [
        {
          name: "Quizlet Buổi 7 (Active & Passive)",
          url: "https://quizlet.com/1193075390/flashcards?funnelUUID=f43eca73-806a-4e2b-bb93-20cd86d2aca1",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-8",
    sessionNum: 8,
    type: "listening",
    badge: "Listening • Unit 4 • Part 2",
    title: "Buổi 8: Wh- Questions (2) - WHEN, WHERE, WHY, HOW",
    desc: "Chi tiết các câu hỏi thời gian, vị trí, lý do (To-V / Because) và các nhánh biến thể của How.",
    core: [
      {
        title: "WHEN & WHERE",
        code: "WHEN -> Mốc thời gian (in 2 hours, at noon, on Monday)  |  WHERE -> Vị trí / Tên người giữ đồ",
        desc: "WHERE ngoài trả lời bằng địa điểm còn rất hay trả lời bằng người giữ: 'Ask John', 'With Ms. Sarah'.",
      },
      {
        title: "WHY & HOW",
        code: "WHY -> Because / To + V-bare / Giải thích không có Because  |  HOW -> Phương thức / Adj / How long / How much...",
        desc: "Lưu ý 'Why don't you/we...?' là mẫu câu MỜI RỦ / GỢI Ý -> Trả lời Đồng ý (Sounds great) hoặc Từ chối.",
      },
    ],
    grids: [
      {
        title: "Các dạng của HOW",
        items: [
          "How + be/trợ V + S + V: Phương tiện (By bus, online)",
          "How was/is + S: Cảm nhận, tình trạng (It was great)",
          "How long: Thời lượng (For 3 days)",
          "How much: Tiền ($50) | How many: Số lượng",
          "How often: Tần suất (Twice a month) | How far: Khoảng cách",
        ],
      },
    ],
    tips: [
      {
        tag: "BẪY IN + KHOẢNG THỜI GIAN",
        text: "'In 2 hours' không phải là trong vòng 2 tiếng mà là '2 tiếng NỮA' -> thường trả lời cho câu hỏi WHEN ở thì tương lai.",
      },
    ],
    homework: {
      deadline: "Thứ 2, 28/9 (Trước buổi Listening tiếp theo)",
      tasks: [
        "LMS: HW_Pre Toeic_Listening 4_Unit 4_Part 2 - Information Questions (2)",
        "LMS: Vocabulary test - Pre Toeic - Listening 4",
        "Học từ vựng Giao thông & Phương tiện trong sách hoặc Quizlet",
      ],
      links: [
        {
          name: "Quizlet Buổi 8 (Part 2 Info 2)",
          url: "https://quizlet.com/1193919008/flashcards?funnelUUID=c2169e6c-fdfc-473f-b171-d3ffa6b7c3e7",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-9",
    sessionNum: 9,
    type: "reading",
    badge: "Reading • Unit 5 + 6",
    title: "Buổi 9: To-V & Danh Động Từ (Gerunds - V-ing)",
    desc: "Vị trí To-V, chức năng V-ing làm chủ ngữ/sau giới từ và các động từ chuyên đi với To-V hoặc V-ing.",
    core: [
      {
        title: "A. Cấu Trúc To-V",
        code: "V + to V  |  V + Object + to V  |  Be + Adj + to V",
        desc: "Đi với To-V: decide, plan, hope, want, afford... Đi với O + to V: ask, require, remind, allow, encourage...",
      },
      {
        title: "B. Danh Động Từ (V-ing)",
        code: "1. Làm Chủ ngữ (chia V số ít)  |  2. Sau V đặc biệt (enjoy, consider, delay, avoid...)  |  3. Preposition + V-ing",
        desc: "Sau GIỚI TỪ luôn luôn là V-ING: interested in doing, thank you for coming, instead of going...",
      },
    ],
    grids: [
      {
        title: "Các Cụm Đi Với V-ing Cố Định",
        items: [
          "look forward to + V-ing (mong chờ)",
          "be/get used to + V-ing (quen với việc gì)",
          "spend time / money + V-ing",
          "can't help + V-ing (không thể không...)",
        ],
      },
    ],
    tips: [
      {
        tag: "LƯU Ý CHỦ NGỮ V-ING",
        text: "Khi V-ing đứng đầu câu làm Chủ ngữ, bất kể danh từ phía sau là số ít hay số nhiều thì ĐỘNG TỪ CHÍNH LUÔN CHIA Ở DẠNG SỐ ÍT (VD: Reading books IS my hobby).",
      },
    ],
    homework: {
      deadline: "Thứ 4, 30/9 (Trước buổi Reading tiếp theo)",
      tasks: [
        "LMS: HW_Pre Toeic_Reading 5,6 - To-infinitives & Gerunds",
        "LMS: Minitest Listening Part 2 - Pre Toeic",
        "LMS: Vocabulary test - Pre Toeic - Reading 5,6",
      ],
      links: [
        {
          name: "Quizlet Buổi 9 (To V & Gerunds)",
          url: "https://quizlet.com/1194235509/flashcards?funnelUUID=e80c9b8d-1332-41d3-a772-4ba9da3bb2d0",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-10",
    sessionNum: 10,
    type: "listening",
    badge: "Listening • Unit 5 • Part 2",
    title: "Buổi 10: Câu Hỏi Yes/No & Động Từ Khuyết Thiếu",
    desc: "Cách trả lời trực tiếp & gián tiếp, mẫu yêu cầu (request), mẫu gợi ý (suggestion) và từ vựng Kế toán & Đầu tư.",
    core: [
      {
        title: "Nhóm Yes/No Questions",
        code: "Bắt đầu bằng Trợ V (Do/Does/Did/Have) hoặc To Be (Is/Are/Was/Were)",
        desc: "Trả lời trực tiếp: Bắt đầu bằng Yes/No. Trả lời gián tiếp: Không có Yes/No mà giải thích lý do thực tế.",
      },
      {
        title: "Động Từ Khuyết Thiếu (Modal Verbs)",
        code: "Mẫu yêu cầu: Could/Would you...  |  Mẫu mời rủ: Would you like to... / Why don't we...",
        desc: "Đồng ý yêu cầu: Sure, No problem, Of course. Đồng ý mời rủ: That sounds great! Từ chối: Sorry, I'm afraid I can't...",
      },
    ],
    grids: [
      {
        title: "Từ Vựng Kế Toán & Đầu Tư",
        items: [
          "Budget (ngân sách), Financial report (báo cáo tài chính)",
          "Invoice (hóa đơn), Expense (chi phí), Revenue (doanh thu)",
          "Audit (kiểm toán), Investment (đầu tư), Profit (lợi nhuận)",
        ],
      },
    ],
    tips: [
      {
        tag: "MẸO HAY",
        text: "Nếu câu trả lời đưa ra lý do né tránh lịch sự (I have another meeting, Mr. Lee might know) thường là đáp án đúng.",
      },
    ],
    homework: {
      deadline: "Thứ 2, 5/10 (Trước buổi Listening tiếp theo)",
      tasks: [
        "LMS: HW_Listening 5_Unit 5_Part 2 - Yes / No Questions",
        "LMS: Vocabulary test - Listening 5 - Unit 5",
        "Student's Book: Chuẩn bị Lesson Preparation Unit 6 Listening",
      ],
      links: [
        {
          name: "Quizlet Buổi 10 (Yes/No Questions)",
          url: "https://quizlet.com/1214577473/flashcards?funnelUUID=ee9753b9-be65-4af2-8e24-e644feccfb1f",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-11",
    sessionNum: 11,
    type: "reading",
    badge: "Reading • Unit 7 • Parts 5, 6, 7",
    title: "Buổi 11: Phân Từ (Participles - V-ing & V-pp)",
    desc: "Phân biệt V-ing (chủ động, bản chất bên ngoài) vs V-pp (bị động, cảm xúc bên trong) và cụm phân từ rút gọn.",
    core: [
      {
        title: "Phân Từ Làm Tính Từ Bổ Nghĩa Danh Từ",
        code: "N + V-ing / V-ing + N: Chủ động  |  N + V-pp / V-pp + N: Bị động",
        desc: "Ví dụ: the growing economy (kinh tế đang tăng trưởng), damaged items (hàng hóa bị hỏng).",
      },
      {
        title: "Phân Từ Chỉ Cảm Xúc / Tính Chất",
        code: "V-ing: Tính chất bên ngoài gây ra  |  V-pp: Con người tự cảm nhận (xuất phát bên trong)",
        desc: "Ví dụ: a boring lecture (bài giảng gây chán) -> students are bored with the lecture (học sinh cảm thấy chán).",
      },
    ],
    grids: [
      {
        title: "Cụm Phân Từ Rút Gọn Mệnh Đề Cùng Chủ Ngữ",
        items: [
          "Chủ động: V-ing ..., S + V (Arriving at the station, he called a cab)",
          "Bị động: (Being) V-pp ..., S + V (Trained carefully, she did the job well)",
        ],
      },
    ],
    tips: [
      {
        tag: "CÁC CỤM V-PP KINH ĐIỂN",
        text: "Luôn đi với giới từ: interested in, satisfied with, disappointed with, surprised at, tired of.",
      },
    ],
    homework: {
      deadline: "Thứ 4, 7/10 (Trước buổi Reading tiếp theo)",
      tasks: [
        "LMS: HW_Pre Toeic_Reading 7_Unit 7 - Participles",
        "LMS: Vocabulary test - Pre Toeic - Reading 7",
        "Student's Book: Chuẩn bị Lesson Preparation Unit 8 Reading",
      ],
      links: [
        {
          name: "Quizlet Buổi 11 (Participles)",
          url: "https://quizlet.com/vn/1195007847/toeic-pre-read-7-participle-flash-cards/?funnelUUID=e35ba8ed-ea18-4c02-a77a-786c05c57d63",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "midterm-hub",
    sessionNum: "GK",
    type: "all",
    badge: "ĐỀ THI GIỮA KỲ • Assessment",
    title: "TỔNG KẾT & ĐỀ THI GIỮA KỲ",
    desc: "Thư mục Google Drive tải đề thi giữa kỳ, file Audio nghe và bảng đáp án chi tiết từ giáo viên.",
    core: [
      {
        title: "Lời Dặn Dò Của Cô Giáo",
        code: "Kết quả bài giữa kỳ chủ yếu giúp cả lớp nhìn lại phần nào đã nắm được và phần nào cần cải thiện thêm để có hướng đi hiệu quả, nên đừng quá áp lực nha cả nhà! ❤️",
        desc: "Cô đã gửi mail điểm số cho từng bạn. Nhớ đối chiếu lại bài làm với đáp án chi tiết.",
      },
    ],
    grids: [
      {
        title: "Tài Nguyên Có Trong Drive Giữa Kỳ",
        items: [
          "Đề thi giữa kỳ (PDF)",
          "File Audio nghe đầy đủ chất lượng cao",
          "Bảng đáp án và giải thích chi tiết",
        ],
      },
    ],
    tips: [
      {
        tag: "KHO LƯU TRỮ",
        text: "Bấm vào nút liên kết bên dưới để truy cập trực tiếp thư mục Google Drive.",
      },
    ],
    homework: {
      deadline: "Đã hoàn thành",
      tasks: [
        "Kiểm tra email nhận điểm thi giữa kỳ",
        "Tải đáp án về đối chiếu lại các câu sai",
        "Ghi chú lại các dạng bẫy bản thân hay mắc phải",
      ],
      links: [
        {
          name: "Mở Drive Đề Giữa Kỳ + Audio + Đáp Án",
          url: "https://drive.google.com/drive/folders/1Ho_72oIdKIAmbuGgvOp69bo5sB-XMG9I?usp=sharing",
        },
      ],
    },
  },
  {
    id: "buoi-13",
    sessionNum: 13,
    type: "listening",
    badge: "Listening • Unit 6 • Part 2",
    title: "Buổi 13: Các Kiểu Câu Hỏi Khác Part 2",
    desc: "Câu hỏi phủ định, câu hỏi đuôi (tag questions), câu hỏi gián tiếp và câu hỏi lựa chọn 'OR'.",
    core: [
      {
        title: "1. Câu Hỏi Phủ Định & Câu Hỏi Đuôi",
        code: "Bản chất giống Yes/No. Trả lời dựa trên SỰ THẬT khách quan",
        desc: "Nếu sự thật là CÓ thì trả lời Yes, KHÔNG thì trả lời No (không phụ thuộc câu hỏi có Not hay không).",
      },
      {
        title: "2. Câu Hỏi Gián Tiếp & Câu Hỏi Lựa Chọn 'OR'",
        code: "Gián tiếp -> Trả lời cho VẾ THỨ HAI  |  'OR' -> CẤM dùng Yes/No",
        desc: "Câu hỏi 'OR' có thể chọn Either, Neither, Both hoặc lặp lại 1 trong 2 lựa chọn, hoặc đưa ra lựa chọn khác.",
      },
    ],
    grids: [
      {
        title: "Chi Tiết Câu Hỏi Lựa Chọn 'OR'",
        items: [
          "Trả lời Yes/No: SAI 100%",
          "Chọn cả hai: Both, Either is fine",
          "Không chọn cái nào: Neither, None",
          "Đưa ra lựa chọn khác: 'Actually, I prefer tea.'",
        ],
      },
    ],
    tips: [
      {
        tag: "LƯU Ý ĐỒNG ÂM Ở CÂU OR",
        text: "Trong câu hỏi lựa chọn 'OR', đáp án lặp lại một trong hai từ lựa chọn CÓ THỂ LÀ ĐÁP ÁN ĐÚNG (khác với câu hỏi Wh- thông thường).",
      },
    ],
    homework: {
      deadline: "Thứ 6, 9/10 (Trước buổi Listening tiếp theo)",
      tasks: [
        "LMS: TOEIC PRE BỔ TRỢ HANDOUT 6 (Giao thêm)",
        "LMS: TOEIC PRE - Listening 6 - Nghe chép chính tả",
        "LMS: Minitest Reading Part 6 - Pre Toeic",
        "Student's Book: Chuẩn bị Lesson Preparation Unit 7 Listening",
      ],
      links: [
        {
          name: "Quizlet Buổi 13 (Other Questions)",
          url: "https://quizlet.com/vn/960706053/listening-6-part-2-other-types-of-questions-flash-cards/?i=73nq5i&x=1jqt",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-14",
    sessionNum: 14,
    type: "reading",
    badge: "Reading • Unit 8 • Conjunctions & Preps",
    title: "Buổi 14: Liên Từ & Giới Từ (Conjunctions vs Preps)",
    desc: "Thần chú FANBOYS, liên từ tương quan, nguyên tắc vàng phân biệt: Liên từ + SV vs Giới từ + Noun/V-ing.",
    core: [
      {
        title: "NGUYÊN TẮC VÀNG PHÂN BIỆT",
        code: "LIÊN TỪ + MỆNH ĐỀ (S + V)    vs    GIỚI TỪ + NOUN / CỤM NOUN / V-ING",
        desc: "Giới từ TUYỆT ĐỐI KHÔNG đi với một mệnh đề hoàn chỉnh có chủ ngữ và vị ngữ!",
      },
      {
        title: "1. Liên Từ Kết Hợp: FANBOYS",
        code: "F (For - vì) • A (And - và) • N (Nor - cũng không) • B (But - nhưng) • O (Or - hoặc) • Y (Yet - tuy vậy) • S (So - vì vậy)",
        desc: "2. Liên từ tương quan theo cặp: both...and..., either...or..., neither...nor..., not only...but also...",
      },
    ],
    grids: [
      {
        title: "Bảng Đối Chiếu Cặp Đôi Kinh Điển",
        items: [
          "Bởi vì: Because, Since, As (+ S+V)  vs  Because of, Due to, Owing to (+ N)",
          "Mặc dù: Although, Even though, Though (+ S+V)  vs  Despite, In spite of (+ N)",
          "Trong khi: While, Whereas (+ S+V)  vs  During (+ Noun)",
          "Để: So that, In order that (+ S+V)  vs  In order to (+ V-bare) / Otherwise",
          "Tuy nhiên: Nevertheless/yet/however",
          "Do đó: Consequently/Therefore/Thus",
          "Thêm vào đó: Moreover/Furthermore/In addition",
          "Trái lại: On the contrary",
        ],
      },
    ],
    tips: [
      {
        tag: "MẸO PART 5",
        text: "Nhìn ngay sau khoảng trống: nếu thấy S + V -> CHỌN LIÊN TỪ; nếu chỉ thấy cụm danh từ hoặc V-ing -> CHỌN GIỚI TỪ!",
      },
    ],
    homework: {
      deadline: "Thứ 2, 12/10 (Trước buổi Reading tiếp theo)",
      tasks: [
        "LMS - Bài giao thêm: Reading 8+9 - Extra HW (gạch chân phân tích câu)",
        "LMS - Bài luyện tập: HW - Reading 8",
      ],
      links: [
        {
          name: "Quizlet Buổi 14 (Conjunction & Prep)",
          url: "https://quizlet.com/vn/1219203105/to-pre-read-89-conjunction-prep-flash-cards/?i=73nq5i&x=1qqt",
          isQuizlet: true,
        },
      ],
    },
  },
  {
    id: "buoi-15",
    sessionNum: 15,
    type: "listening",
    badge: "Listening • Unit 7 • Part 3",
    title: "Buổi 15: Part 3 - Business Activities & Paraphrase",
    desc: "Cấu trúc 13 đoạn hội thoại Part 3, kỹ thuật paraphrase, mẹo bắt câu hỏi Meaning, Suggest và Topic.",
    core: [
      {
        title: "Thông Tin Cơ Bản Part 3",
        code: "13 đoạn hội thoại • Mỗi đoạn 3 câu hỏi (Tổng 39 câu) • 2-3 người nói (Nam & Nữ luân phiên)",
        desc: "Kỹ năng bao quát quan trọng nhất: PARAPHRASE (từ trong đáp án đồng nghĩa với từ trong bài nghe).",
      },
    ],
    grids: [
      {
        title: "Mẹo Theo Từng Dạng Câu Hỏi Part 3",
        items: [
          "Câu hỏi Meaning (Hàm ý câu nói): TẬP TRUNG NGHE CÂU NÓI NGAY SAU ĐÓ để nắm ngữ cảnh",
          "Câu hỏi Suggest (Lời khuyên/đề xuất): Bắt các mẫu Why don't we, How about, You should, I recommend...",
          "Câu hỏi Topic (Chủ đề chính): Chú ý 1-2 CÂU ĐẦU TIÊN của đoạn hội thoại + bắt keywords",
        ],
      },
      {
        title: "Từ Vựng Trọng Tâm Part 3",
        items: [
          "Kinh doanh: Place an order, sign contract, shipment delayed, reschedule meeting",
          "Sự kiện: Annual conference, trade show, workshop, grand opening, retirement party",
        ],
      },
    ],
    tips: [
      {
        tag: "CHIẾN LƯỢC ĐỌC TRƯỚC",
        text: "Luôn luôn đọc lướt trước câu hỏi và các đáp án của đoạn tiếp theo trong khi máy đang đọc phần hướng dẫn hoặc câu trả lời trước đó!",
      },
    ],
    homework: {
      deadline: "Thứ 4, 14/10 (Trước buổi Listening tiếp theo)",
      tasks: [
        "LMS - Bài giao thêm: Listening 7 - Nghe chép chính tả (Tải về chép và nộp lại)",
        "LMS - Bài luyện tập: HW - Listening 7",
      ],
      links: [
        {
          name: "Quizlet Buổi 15 (Part 3 Business)",
          url: "https://quizlet.com/1220030691/flashcards?funnelUUID=d476926d-3edc-4845-b823-2eb51e7cbef8",
          isQuizlet: true,
        },
      ],
    },
  },
];

export const flashcardsData: Flashcard[] = [
  {
    q: "Part 1 tả người: Cấu trúc thì nào là kinh điển nhất?",
    a: "S + be + V-ing. Cần chú ý nghe kỹ Chủ ngữ (1 người hay nhóm) và Động từ hành động.",
  },
  {
    q: "Reading: Cấu trúc nào đi với 'Make / Keep / Find' mà TOEIC rất hay ra?",
    a: "Make / Keep / Find + Object + TÍNH TỪ (Adj)! VD: Keep the room clean, find it useful.",
  },
  {
    q: "Các từ đuôi '-ly' như 'friendly, costly, timely' là Tính từ hay Trạng từ?",
    a: "Là TÍNH TỪ (Adjectives)! Đừng nhầm thành trạng từ.",
  },
  {
    q: "Part 2: Gặp câu hỏi Wh- (Who, What, Where...), đáp án có 'Yes / No' thì sao?",
    a: "LOẠI NGAY LẬP TỨC! Câu hỏi Wh- không bao giờ trả lời bằng Yes/No.",
  },
  {
    q: "Part 2: Nhóm câu trả lời nào có tỷ lệ ĐÚNG cực cao (~95%)?",
    a: "Nhóm né tránh / không biết: 'I don't know', 'Let me check', 'It hasn't been announced', 'Ask Mr. John'.",
  },
  {
    q: "Part 1 tả vật: Khi tranh KHÔNG có người, đáp án có 'is/are being + V3' thì đúng hay sai?",
    a: "99% SAI! Trừ 'is being displayed' hoặc 'is being cast (shadow)'.",
  },
  {
    q: "Reading Part 5: Làm sao phân biệt nhanh Chủ động (CĐ) và Bị động (BĐ)?",
    a: "Sau chỗ trống có Tân ngữ -> CHỦ ĐỘNG. Không có Tân ngữ (ngay sau là giới từ, trạng từ hoặc dấu chấm) -> BỊ ĐỘNG.",
  },
  {
    q: "Thần chú liên từ kết hợp FANBOYS gồm những từ nào?",
    a: "For, And, Nor, But, Or, Yet, So.",
  },
  {
    q: "Sự khác biệt cốt lõi giữa LIÊN TỪ và GIỚI TỪ?",
    a: "LIÊN TỪ + MỆNH ĐỀ (S + V). GIỚI TỪ + NOUN / CỤM NOUN / V-ING.",
  },
  {
    q: "Part 3: Câu hỏi Meaning / Hàm ý thì cần tập trung nghe ở đâu?",
    a: "TẬP TRUNG NGHE CÂU NÓI NGAY SAU ĐÓ để nắm ngữ cảnh và ý đồ của người nói!",
  },
];
