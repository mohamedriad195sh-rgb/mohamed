/**
 * Mohamed Riyad Khalil - Developer Portfolio
 * Vanilla JavaScript Engine
 * Features:
 *  - Universal File Upload & In-Browser Execution (HTML, PDF, C++, Python, ZIP, Images, etc.)
 *  - IndexedDB High-Capacity Storage (No 5MB quota limitations, stores full files)
 *  - Live In-Browser Execution for Uploaded HTML Web Pages
 *  - One-Click Download / View for Code, PDFs, and Archives
 *  - Bilingual Support (English / Arabic with RTL)
 *  - Dark / Light Mode Theming (Dark by default)
 *  - IntersectionObserver Scroll Animations
 *  - Scroll Reading Progress Indicator
 *  - Scrollspy Active Navigation Tracking
 *  - Responsive Mobile Navigation Drawer
 *  - WhatsApp Clipboard Helper with Toast Notifications
 *  - Interactive Contact Form with Validation & WhatsApp Linking
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Storage Keys & State Variables
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'mrk_portfolio_theme';
  const LANG_STORAGE_KEY = 'mrk_portfolio_lang';
  const DB_NAME = 'MRK_Portfolio_Files_DB';
  const DB_VERSION = 1;
  const STORE_NAME = 'custom_projects';

  let currentLang = 'en';
  let selectedMainFile = null;
  let selectedMainFileDataUrl = null;
  let selectedScreenshotDataUrl = null;

  // --------------------------------------------------------------------------
  // 2. IndexedDB High-Capacity Storage Manager
  // --------------------------------------------------------------------------
  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function dbSaveProject(project) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(project);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function dbGetAllProjects() {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('IndexedDB read fallback:', e);
      return [];
    }
  }

  async function dbDeleteProject(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --------------------------------------------------------------------------
  // 3. Bilingual Dictionary (English & Arabic)
  // --------------------------------------------------------------------------
  const translations = {
    en: {
      meta: {
        title: "Mohamed Riyad Khalil | Software Engineering Student & Aspiring Web Developer",
        description: "Portfolio of Mohamed Riyad Khalil — Second-Year Software Engineering student at the Faculty of Computers and Information. Specializing in C++, Python, HTML, CSS, and modern JavaScript."
      },
      brand: 'Mohamed<span>.dev</span>',
      nav: {
        about: "About",
        education: "Education",
        skills: "Skills",
        projects: "Projects",
        vision: "Vision",
        contact: "Contact",
        chatWhatsApp: "Chat WhatsApp"
      },
      hero: {
        status: "Available for Junior Roles & Web Projects",
        headline: 'Engineering Clean Code & <span class="gradient-text">Modern Web Solutions.</span>',
        role: "Mohamed Riyad Khalil &mdash; Software Engineering Student | Aspiring Web Developer",
        description: "Dedicated second-year Computer and Information Science undergraduate specializing in Software Engineering. Blending core computer science algorithms with modern web technologies to engineer responsive, robust, and accessible digital products.",
        btnProjects: "View Featured Work",
        btnWhatsApp: "WhatsApp: 01015044275",
        btnContact: "Contact Me",
        stat1Value: '2nd <span>Year</span>',
        stat1Label: "Software Engineering Major",
        stat2Value: '5<span>+</span>',
        stat2Label: "Core Languages & Tech",
        stat3Value: '100<span>%</span>',
        stat3Label: "Dedication to Craft"
      },
      about: {
        tag: "About Me",
        title: 'Driven by Engineering Principles & <span class="gradient-text">Practical Execution</span>',
        subtitle: "A forward-thinking mindset translating computer science theory into modern, responsive digital solutions.",
        lead: 'I am a passionate <strong>Software Engineering undergraduate</strong> at the Faculty of Computers and Information, currently in my second academic year.',
        p1: "My journey is rooted in a disciplined curiosity for how computing systems operate at both the theoretical and application layers. From implementing algorithmic structures in C++ and Python to sculpting intuitive, dynamic web interfaces with HTML, CSS, and modern JavaScript, I thrive at the crossroads of logical problem solving and human-centered design.",
        p2: "I take pride in independently authoring clean, maintainable code, rapidly learning new technologies, and consistently turning conceptual requirements into working software. My goal is to work alongside forward-looking teams where I can bring energy, high standards, and continuous improvement to production codebases.",
        pillar1Title: "Independent Development",
        pillar1Desc: "Writing structured programs autonomously with an emphasis on clarity and correctness.",
        pillar2Title: "Modern Web Stack",
        pillar2Desc: "Building responsive, mobile-first layouts with semantic markup and vanilla JavaScript.",
        pillar3Title: "Strong Fundamentals",
        pillar3Desc: "Deep comprehension of data structures, OOP principles, and computational logic.",
        pillar4Title: "Continuous Growth",
        pillar4Desc: "Relentlessly advancing skillsets, adopting best practices, and building practical projects."
      },
      edu: {
        tag: "Academic Background",
        title: 'Education & <span class="gradient-text">Engineering Foundations</span>',
        subtitle: "Rigorous academic training grounded in software engineering principles and computer science theory.",
        institution: "Faculty of Computers and Information",
        degree: "Bachelor of Science in Software Engineering (In Progress)",
        status: "Current Status: Second-Year Student",
        focusTitle: "Core Academic Focus Areas",
        focus1: "Object-Oriented Programming (OOP) architectures in C++ & Python.",
        focus2: "Algorithmic thinking, data structure selection, and computational complexity.",
        focus3: "Software engineering life cycles, specification analysis, and design patterns.",
        focus4: "Database systems concepts, relational data integrity, and normalization.",
        labTitle: "Practical Laboratory & Application",
        lab1: "Designing modular, bug-free command-line tools to solve structured problems.",
        lab2: "Synthesizing classroom algorithms into dynamic web-based visualizers.",
        lab3: "Practicing collaborative debugging and writing maintainable code documentation.",
        lab4: "Conducting performance benchmarking across data processing routines."
      },
      skills: {
        tag: "Technical Toolbox",
        title: 'Skills & <span class="gradient-text">Core Competencies</span>',
        subtitle: "A balanced fusion of foundational programming languages, web standards, and engineering practices.",
        cat1Title: "Web Development",
        cat1Desc: "Specialized in crafting pixel-perfect, mobile-friendly layouts without heavy framework overhead, prioritizing accessibility and speed.",
        cat2Title: "Programming Languages",
        cat2Desc: "Demonstrated ability to write standalone programs independently, decomposing complex computational problems into clean modules.",
        cat3Title: "Engineering Competencies",
        cat3Desc: "Continuous focus on high maintainability, structured debugging workflows, and translating abstract client requirements into working features."
      },
      projects: {
        addBtn: "➕ Add New Assignment / Project from Site",
        tag: "Practical Work",
        title: 'Featured <span class="gradient-text">Practical Projects</span>',
        subtitle: "Real code implementations demonstrating software engineering discipline, algorithmic problem solving, and modern frontend design.",
        p1Category: "Web Development & System Design",
        p1Title: "Responsive Developer Portfolio & Theming Engine",
        p1Desc: "A single-page, ultra-responsive developer showcase engineered purely with semantic HTML5, modern CSS custom properties, and vanilla JavaScript. Features dynamic theme switching, intersection scroll animations, and fluid typography.",
        p1Live: "Current Live App",
        p1Inquire: "Inquire on WhatsApp",
        p2Category: "Software Engineering & OOP",
        p2Title: "C++ Academic Record & Management System",
        p2Desc: "An object-oriented software application built in C++ to manage student records, compute GPAs, search records via optimized sorting and hashing algorithms, and persist data through structured file streams.",
        p2Walkthrough: "Request Code Walkthrough",
        p3Category: "Interactive Frontend Utility",
        p3Title: "Interactive Smart Calculator & Mathematical Suite",
        p3Desc: "A browser utility built with pure JavaScript and CSS Grid. Highlights precision arithmetic handling, keyboard event binding, real-time expression history, and responsive tactile interactions.",
        p3Discuss: "Discuss Project",
        p4Category: "Scripting & Automation",
        p4Title: "Python Task Automator & Data Parser",
        p4Desc: "A command-line productivity suite engineered in Python to parse structured log files, automate repetitive directory management tasks, and generate formatted status reports with robust error handling.",
        p4Connect: "Connect Regarding Python"
      },
      modal: {
        title: "Add New Assignment / Project to Site",
        fieldMainFile: "Upload Assignment / Project File (HTML, PDF, C++, Python, ZIP, etc.)",
        dropzoneText: "Click or Drag & Drop ANY File Here",
        fieldTitle: "Assignment / Project Title",
        fieldSubject: "Subject / Category (e.g. Web Dev Course / C++ OOP)",
        fieldDesc: "Description / Summary",
        fieldTags: "Technologies (comma-separated)",
        fieldImage: "Optional Cover / Screenshot Image",
        fieldLink: "External URL / GitHub Link (Optional if file is uploaded)",
        btnCancel: "Cancel",
        btnSubmit: "Add Directly to Website",
        customBadge: "Added from Site",
        viewLiveHtml: "Run Live Web Page (HTML)",
        downloadFile: "Download File",
        viewDocument: "View Document",
        deleteConfirm: "Are you sure you want to delete this assignment from your site?",
        successAdd: "New assignment added successfully with your uploaded file!"
      },
      vision: {
        badge1: "Career Interests & Ambition",
        title1: "Professional Web Developer Pathway",
        desc1: "My immediate objective is to immerse myself in practical industry environments, contributing to live web development projects while collaborating with seasoned engineers. By gaining hands-on production experience, I aim to elevate my mastery from foundational web technologies into advanced full-stack architectures.",
        badge2: "Long-Term Vision",
        title2: "Building High-Impact Software Solutions",
        desc2: "My overarching career goal is to architect resilient software products that resolve concrete, practical challenges for users and organizations. I strive to combine rigorous computer science fundamentals with elegant UI execution to produce software that is accessible, performant, and purposeful."
      },
      contact: {
        tag: "Let's Connect",
        title: 'Get in Touch with <span class="gradient-text">Mohamed</span>',
        subtitle: "Interested in collaborating on a web project, offering an internship opportunity, or discussing software engineering? Let's talk.",
        directHeading: "Direct & Instant Communication",
        directSub: "I am actively responsive via WhatsApp and open to discussing developer internships, freelance projects, and tech collaborations.",
        waLabel: "Direct WhatsApp",
        waBtn: "Open Instant WhatsApp Chat",
        meta1: "Faculty of Computers & Information • Software Engineering",
        meta2: "Available for Summer Internships, Part-Time & Junior Roles",
        meta3: "Direct WhatsApp Phone: +20 1015044275",
        formHeading: "Send a Direct Inquiry",
        nameLabel: "Your Name",
        emailLabel: "Email or Phone",
        msgLabel: "Message / Project Details",
        sendBtn: "Send Message",
        placeholders: {
          name: "e.g. Sarah Jenkins",
          email: "e.g. sarah@example.com or phone",
          message: "Hello Mohamed, I am looking for a web developer to build..."
        }
      },
      footer: {
        tagline: "Software Engineering Student &bull; Aspiring Web Developer",
        rights: "Designed & engineered with semantic HTML, CSS & JavaScript.",
        wa: "Direct WhatsApp: <strong>01015044275</strong>"
      },
      toasts: {
        copiedPhone: "Copied 01015044275 to clipboard!",
        switchedLang: "Switched language to English",
        formSending: "Sending...",
        formSuccess: "Thank you, {name}! Your message was prepared.",
        formError: "Please fill in all fields before sending.",
        whatsAppPrompt: "Would you also like to deliver this message directly via WhatsApp right now?"
      },
      btnLangLabel: "العربية",
      btnLangAria: "Switch language to Arabic",
      btnLangMobile: "التحويل إلى العربية"
    },

    ar: {
      meta: {
        title: "محمد رياض خليل | طالب هندسة برمجيات ومطور ويب واعد",
        description: "الموقع التعريفي ومحفظة أعمال محمد رياض خليل — طالب بالفرقة الثانية بكلية الحاسبات والمعلومات، تخصص هندسة البرمجيات. خبرة في C++، بايثون، وتقنيات الويب الحديثة."
      },
      brand: 'محمد<span>.dev</span>',
      nav: {
        about: "عنّي",
        education: "التعليم",
        skills: "المهارات",
        projects: "المشاريع",
        vision: "الرؤية",
        contact: "تواصل معي",
        chatWhatsApp: "محادثة واتساب"
      },
      hero: {
        status: "متاح لفرص التدريب ومشاريع الويب",
        headline: 'هندسة برمجيات نظيفة و<span class="gradient-text">حلول ويب حديثة.</span>',
        role: "محمد رياض خليل &mdash; طالب هندسة برمجيات | مطور ويب واعد",
        description: "طالب شغوف بالسنة الثانية بكلية الحاسبات والمعلومات، متخصص في هندسة البرمجيات. أجمع بين أسس علوم الحاسب والخوارزميات وتقنيات الويب الحديثة لهندسة منتجات رقمية تفاعلية، متجاوبة وذات كفاءة عالية.",
        btnProjects: "استعراض المشاريع",
        btnWhatsApp: "واتساب: 01015044275",
        btnContact: "تواصل معي",
        stat1Value: 'السنة <span>الثانية</span>',
        stat1Label: "تخصص هندسة البرمجيات",
        stat2Value: '5<span>+</span>',
        stat2Label: "لغات وتقنيات أساسية",
        stat3Value: '100<span>%</span>',
        stat3Label: "شغف وإتقان للبرمجة"
      },
      about: {
        tag: "نبذة عني",
        title: 'شغف بالمعايير الهندسية و<span class="gradient-text">التطبيق العملي</span>',
        subtitle: "رؤية طموحة لتحويل نظريات علوم الحاسب إلى حلول وتطبيقات ويب عصرية ومتجاوبة.",
        lead: 'أنا <strong>طالب هندسة برمجيات</strong> طموح في كلية الحاسبات والمعلومات، حالياً بالفرقة الدراسية الثانية.',
        p1: "تنطلق مسيرتي من شغف عميق بفهم كيفية عمل الأنظمة الحاسوبية وتكاملها من النواة وحتى واجهات الاستخدام. بدءاً من كتابة الخوارزميات وهياكل البيانات بلغات C++ وPython، ووصولاً إلى تصميم وبناء واجهات مستخدم تفاعلية وسريعة الاستجابة باستخدام HTML وCSS وأحدث معايير JavaScript؛ أسعى دائماً لتحقيق التوازن المثالي بين قوة المنطق البرمجي والتجربة الإنسانية الممتعة.",
        p2: "أفخر بقدرتي على كتابة كود منظم ونظيف بشكل مستقل، وسرعة اكتساب التقنيات الحديثة، وتحويل المتطلبات النظرية إلى برمجيات حقيقية فعالة. هدفي الانضمام إلى بيئة عمل ملهمة تتيح لي المساهمة بطاقة إيجابية ومعايير برمجية عالية في مشاريع إنتاجية كبرى.",
        pillar1Title: "تطوير مستقل",
        pillar1Desc: "كتابة وبناء برامج متكاملة باستقلالية تامة مع التركيز على تنظيم الكود ودقته.",
        pillar2Title: "واجهات ويب عصرية",
        pillar2Desc: "تصميم وتطوير صفحات ويب متجاوبة بنسبة 100% مع كافة الشاشات والأجهزة.",
        pillar3Title: "أسس برمجية متينة",
        pillar3Desc: "استيعاب معمق لمفاهيم البرمجة كائنية التوجه (OOP) وهياكل البيانات والتحليل المنطقي.",
        pillar4Title: "تطور مستمر",
        pillar4Desc: "حرص دائم على صقل المهارات، ومواكبة أفضل الممارسات، وبناء مشاريع عملية جديدة."
      },
      edu: {
        tag: "المسار الأكاديمي",
        title: 'التعليم و<span class="gradient-text">الأسس الهندسية</span>',
        subtitle: "دراسة أكاديمية متعمقة ترتكز على مبادئ هندسة البرمجيات وعلوم الحاسب التطبيقية.",
        institution: "كلية الحاسبات والمعلومات",
        degree: "بكالوريوس هندسة البرمجيات (قيد الدراسة)",
        status: "المرحلة الحالية: طالب بالفرقة الثانية",
        focusTitle: "المجالات الأكاديمية التخصصية",
        focus1: "بناء معماريات البرمجة كائنية التوجه (OOP) بلغات C++ وPython.",
        focus2: "التفكير الخوارزمي، واختيار هياكل البيانات المثلى، وتحليل التعقيد الحسابي.",
        focus3: "دورات حياة تطوير البرمجيات، وتحليل المتطلبات، وأنماط التصميم (Design Patterns).",
        focus4: "مفاهيم أنظمة قواعد البيانات وسلامة البيانات العلائقية.",
        labTitle: "التطبيق العملي والمختبري",
        lab1: "بناء أدوات وبرامج سطر أوامر معيارية خالية من الأخطاء لحل مشكلات محددة.",
        lab2: "تحويل الخوارزميات الأكاديمية إلى تطبيقات وأدوات ويب تفاعلية.",
        lab3: "ممارسة أساليب التنقيح (Debugging) وتوثيق الكود البرمجي وفق معايير الجودة.",
        lab4: "قياس واختبار كفاءة وسرعة معالجة البيانات."
      },
      skills: {
        tag: "الحقيبة التقنية",
        title: 'المهارات و<span class="gradient-text">الكفاءات الأساسية</span>',
        subtitle: "مزيج متوازن يجمع بين لغات البرمجة الأساسية، معايير الويب الحديثة، وممارسات هندسة البرمجيات.",
        cat1Title: "تطوير الويب",
        cat1Desc: "إتقان تصميم صفحات فائقة الدقة وسريعة التحميل متوافقة مع الهواتف دون الاعتماد على مكتبات ثقيلة، مع مراعاة سرعة الأداء وسهولة الوصول.",
        cat2Title: "لغات البرمجة",
        cat2Desc: "قدرة مثبتة على بناء وتطوير برامج مستقلة وتفكيك المسائل البرمجية المعقدة إلى وحدات برمجية واضحة ومنظمة.",
        cat3Title: "الكفاءات الهندسية",
        cat3Desc: "تركيز دائم على قابلية صيانة الكود، ومنهجيات اكتشاف الأخطاء المنظمة، وتحويل متطلبات العميل إلى وظائف برمجية فعالة."
      },
      projects: {
        addBtn: "➕ إضافة أسايمنت أو مشروع جديد من الموقع مباشرة",
        tag: "مشاريع عملية",
        title: 'مشاريع تطبيقية <span class="gradient-text">مختارة</span>',
        subtitle: "نماذج برمجية حقيقية تعكس الانضباط الهندسي، وحل المشكلات بالخوارزميات، وتصميم واجهات ويب حديثة.",
        p1Category: "تطوير الويب وتصميم الأنظمة",
        p1Title: "موقع شخصي متجاوب مع محرك للسمات ودعم اللغات",
        p1Desc: "منصة محفظة أعمال فردية ذات تجاوب فائق، مبرمجة بالكامل عبر HTML5 ومعاملات CSS المخصصة وجافاسكريبت نقية. تتضمن تبديل السمة الداكنة والفاتحة ودعم اللغتين مع تأثيرات التمرير التفاعلية.",
        p1Live: "الموقع الحالي",
        p1Inquire: "استفسر عبر واتساب",
        p2Category: "هندسة البرمجيات والبرمجة الكائنية",
        p2Title: "نظام إدارة السجلات الأكاديمية بلغة C++",
        p2Desc: "برنامج متكامل يطبق مفاهيم الـ OOP لإدارة وحساب المعدلات التراكمية للطلاب، والبحث السريع عبر خوارزميات الترتيب والبحث، وحفظ البيانات في ملفات مهيكلة.",
        p2Walkthrough: "طلب معاينة الكود",
        p3Category: "واجهات ويب تفاعلية",
        p3Title: "آلة حاسبة ذكية وتطبيق رياضي تفاعلي",
        p3Desc: "تطبيق متصفح مبني بجافاسكريبت نقية وشبكات CSS Grid. يتميز بمعالجة دقيقة للعمليات الرياضية، ودعم إدخال لوحة المفاتيح وسجل العمليات الحسابية وتصميم تفاعلي سريع.",
        p3Discuss: "مناقشة تفاصيل المشروع",
        p4Category: "البرمجة النصية والأتمتة",
        p4Title: "أداة أتمتة المهام ومعالجة الملفات بلغة Python",
        p4Desc: "أداة سطر أوامر فعالة مبرمجة بلغة Python لقراءة سجلات البيانات، وأتمتة ترتيب المجلدات المتكررة، وتوليد تقارير إحصائية دورية مع معالجة استثنائية للأخطاء.",
        p4Connect: "تواصل بخصوص Python"
      },
      modal: {
        title: "إضافة أسايمنت أو مشروع جديد إلى الموقع",
        fieldMainFile: "ارفع أي ملف (HTML, PDF, C++, Python, ZIP, صورة...)",
        dropzoneText: "اضغط هنا لاختيار أي ملف أو اسحبه إلى هنا مباشرة",
        fieldTitle: "عنوان الأسايمنت أو المشروع",
        fieldSubject: "اسم المادة أو التصنيف (مثال: مادة الويب / معمل C++)",
        fieldDesc: "وصف الأسايمنت أو ما تم تنفيذه",
        fieldTags: "التقنيات المستخدمة (مفصولة بفاصلة)",
        fieldImage: "صورة أو سكرين شوت إضافية (اختياري)",
        fieldLink: "رابط خارجي أو رابط GitHub (اختياري إن رفعت ملفاً)",
        btnCancel: "إلغاء",
        btnSubmit: "إضافة مباشرة إلى الموقع",
        customBadge: "أسايمنت مضاف",
        viewLiveHtml: "تشغيل صفحة الويب مباشرة (HTML Live)",
        downloadFile: "تحميل الملف الأصلي",
        viewDocument: "معاينة المستند",
        deleteConfirm: "هل أنت متأكد من رغبتك في حذف هذا الأسايمنت من الموقع؟",
        successAdd: "تمت إضافة الأسايمنت وحفظ ملفك بنجاح في الموقع!"
      },
      vision: {
        badge1: "المسار والاهتمام المهني",
        title1: "مسار الاحتراف في تطوير الويب",
        desc1: "هدفي المباشر هو الانخراط في بيئة عمل برمجية حقيقية، والمساهمة في مشاريع ويب حية بالتعاون مع مطورين محترفين، وتوظيف خبراتي لصقل مهاراتي من الأساسيات إلى هندسة الأنظمة الكاملة.",
        badge2: "الرؤية بعيدة المدى",
        title2: "بناء برمجيات وحلول ذات أثر حقيقي",
        desc2: "هدفي المهني الأسمى هو تطوير حلول برمجية مبتكرة وعملية تحل مشاكل ملموسة للمستخدمين والشركات، مع الجمع بين قوة المعايير الهندسية وسلاسة تجربة الاستخدام لتوفير برمجيات سريعة، آمنة ومفيدة."
      },
      contact: {
        tag: "تواصل معي",
        title: 'تواصل مع <span class="gradient-text">محمد رياض</span>',
        subtitle: "مهتم بالتعاون في مشروع ويب، أو توفير فرصة تدريب برمجية، أو مناقشة أفكار تقنية؟ يسعدني تواصلك دائماً.",
        directHeading: "تواصل مباشر وفوري",
        directSub: "أجيب بسرعة عبر تطبيق واتساب ومتاح دائماً لمناقشة فرص التدريب والمشاريع التقنية.",
        waLabel: "واتساب مباشر",
        waBtn: "فتح محادثة واتساب فورية",
        meta1: "كلية الحاسبات والمعلومات • تخصص هندسة البرمجيات",
        meta2: "متاح لفرص التدريب الصيفي، العمل الجزئي، والمشاريع البرمجية",
        meta3: "رقم الواتساب المباشر: 01015044275 (+20)",
        formHeading: "إرسال رسالة مباشرة",
        nameLabel: "الاسم الكريم",
        emailLabel: "البريد الإلكتروني أو الهاتف",
        msgLabel: "تفاصيل الرسالة أو المشروع",
        sendBtn: "إرسال الرسالة",
        placeholders: {
          name: "مثال: أحمد محمود",
          email: "مثال: ahmed@example.com أو الهاتف",
          message: "مرحباً محمد، أود التحدث معك بخصوص مشروع ويب..."
        }
      },
      footer: {
        tagline: "طالب هندسة برمجيات &bull; مطور ويب واعد",
        rights: "صُمم وطُوّر بمعايير الويب النظيفة HTML وCSS وجافاسكريبت.",
        wa: "واتساب مباشر: <strong>01015044275</strong>"
      },
      toasts: {
        copiedPhone: "تم نسخ رقم الواتساب 01015044275 بنجاح!",
        switchedLang: "تم التحويل إلى اللغة العربية بنجاح",
        formSending: "جاري الإرسال...",
        formSuccess: "شكراً لك يا {name}! تم تجهيز رسالتك بنجاح.",
        formError: "يرجى ملء جميع الحقول قبل إرسال الرسالة.",
        whatsAppPrompt: "هل ترغب أيضاً في فتح محادثة مباشرة عبر واتساب الآن لنفس الرسالة؟"
      },
      btnLangLabel: "English",
      btnLangAria: "Switch language to English",
      btnLangMobile: "Switch to English"
    }
  };

  // Helper function to extract nested values
  function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // --------------------------------------------------------------------------
  // 4. Theme Engine (Dark Theme as Primary Default)
  // --------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  function toggleTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        newTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'
      );
    }
  }

  initTheme();

  // --------------------------------------------------------------------------
  // 5. Toast Notification System
  // --------------------------------------------------------------------------
  function triggerToast(message) {
    const toastNotice = document.getElementById('toastNotice');
    if (!toastNotice) return;
    const textSpan = toastNotice.querySelector('.toast-text');
    if (textSpan) textSpan.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // 6. Language Engine (English / Arabic with RTL Support)
  // --------------------------------------------------------------------------
  function applyLanguage(lang, showToastNotification = false) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);

    const isRtl = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    const dict = translations[lang];

    // Document Meta
    if (dict.meta) {
      document.title = dict.meta.title;
      const metaDesc = document.getElementById('metaDescription');
      if (metaDesc) metaDesc.setAttribute('content', dict.meta.description);
    }

    // Brand Name
    const brandText = document.getElementById('brandText');
    if (brandText) {
      brandText.innerHTML = dict.brand;
    }

    // Update all elements with data-i18n
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const translation = getNestedTranslation(dict, key);
      if (translation !== null && translation !== undefined) {
        el.innerHTML = translation;
      }
    });

    // Form Placeholders
    const senderName = document.getElementById('senderName');
    const senderEmail = document.getElementById('senderEmail');
    const senderMessage = document.getElementById('senderMessage');
    if (senderName && dict.contact.placeholders.name) {
      senderName.setAttribute('placeholder', dict.contact.placeholders.name);
    }
    if (senderEmail && dict.contact.placeholders.email) {
      senderEmail.setAttribute('placeholder', dict.contact.placeholders.email);
    }
    if (senderMessage && dict.contact.placeholders.message) {
      senderMessage.setAttribute('placeholder', dict.contact.placeholders.message);
    }

    // Modal Form Placeholders
    const projTitle = document.getElementById('projTitle');
    const projSubject = document.getElementById('projSubject');
    const projDesc = document.getElementById('projDesc');
    const projLink = document.getElementById('projLink');
    if (projTitle) projTitle.setAttribute('placeholder', isRtl ? 'مثال: أسايمنت 1 - تصميم صفحة ويب متجاوبة' : 'e.g. Assignment 1 - Responsive Layout');
    if (projSubject) projSubject.setAttribute('placeholder', isRtl ? 'مثال: مادة تطوير الويب / معمل C++' : 'e.g. Web Development Course / C++ Lab');
    if (projDesc) projDesc.setAttribute('placeholder', isRtl ? 'اكتب نبذة سريعة عن المطلوب وما قمت بتنفيذه في الأسايمنت...' : 'Brief explanation of the assignment requirements and solution...');
    if (projLink) projLink.setAttribute('placeholder', isRtl ? 'مثال: رابط GitHub أو رابط خارجي (اختياري)' : 'e.g. https://github.com/... (optional)');

    // Language Toggle Buttons
    const langLabel = document.getElementById('langLabel');
    const langToggleBtn = document.getElementById('langToggleBtn');
    const mobileLangLabel = document.getElementById('mobileLangLabel');

    if (langLabel) langLabel.textContent = dict.btnLangLabel;
    if (langToggleBtn) {
      langToggleBtn.setAttribute('aria-label', dict.btnLangAria);
      langToggleBtn.setAttribute('title', dict.btnLangAria);
    }
    if (mobileLangLabel) mobileLangLabel.textContent = dict.btnLangMobile;

    // Refresh custom project cards text
    refreshCustomCardsLang(isRtl);

    if (showToastNotification) {
      triggerToast(dict.toasts.switchedLang);
    }
  }

  function toggleLanguage() {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    applyLanguage(nextLang, true);
  }

  function refreshCustomCardsLang(isRtl) {
    const customCards = document.querySelectorAll('.custom-project-card');
    customCards.forEach((card) => {
      const badge = card.querySelector('.custom-badge');
      if (badge) badge.textContent = isRtl ? 'أسايمنت جامعي' : 'Added from Site';
    });
  }

  // --------------------------------------------------------------------------
  // 7. Universal File Execution & Download Engine
  // --------------------------------------------------------------------------
  function openOrDownloadProjectFile(proj) {
    if (!proj) return;

    // 1. If user uploaded an HTML file: render live in a new browser tab!
    if (proj.fileDataUrl && proj.fileName && proj.fileName.toLowerCase().endsWith('.html')) {
      try {
        const base64Content = proj.fileDataUrl.split(',')[1];
        const decodedHtml = decodeURIComponent(escape(atob(base64Content)));
        const blob = new Blob([decodedHtml], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        const newWindow = window.open(blobUrl, '_blank');
        if (!newWindow) {
          triggerToast('Please allow popups to open the live HTML page.');
        }
        return;
      } catch (err) {
        console.warn('Blob HTML decode fallback:', err);
        window.open(proj.fileDataUrl, '_blank');
        return;
      }
    }

    // 2. If PDF document or image: open directly in browser viewer
    if (proj.fileDataUrl && proj.fileName && (proj.fileName.toLowerCase().endsWith('.pdf') || (proj.fileType && proj.fileType.startsWith('image/')))) {
      try {
        const base64Data = proj.fileDataUrl.split(',')[1];
        const mime = proj.fileType || (proj.fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        return;
      } catch (err) {
        window.open(proj.fileDataUrl, '_blank');
        return;
      }
    }

    // 3. If any other file (C++, Python, ZIP, text, etc.): download directly with original file name
    if (proj.fileDataUrl) {
      const a = document.createElement('a');
      a.href = proj.fileDataUrl;
      a.download = proj.fileName || 'assignment_file';
      document.body.appendChild(a);
      a.click();
      a.remove();
      triggerToast(currentLang === 'ar' ? `جاري تحميل الملف: ${proj.fileName}` : `Downloading ${proj.fileName}...`);
      return;
    }

    // 4. If external link was provided: open link
    if (proj.link && proj.link !== '#' && proj.link !== '') {
      window.open(proj.link, '_blank', 'noopener,noreferrer');
      return;
    }

    triggerToast(currentLang === 'ar' ? 'لا يوجد ملف مرتبط بهذا المشروع' : 'No file attached to this project');
  }

  // --------------------------------------------------------------------------
  // 8. Custom Projects Rendering (Cards)
  // --------------------------------------------------------------------------
  function createProjectCardElement(proj) {
    const isAr = currentLang === 'ar';
    const dict = translations[currentLang] || translations.en;
    const card = document.createElement('article');
    card.className = 'project-card custom-project-card reveal is-revealed';
    card.id = proj.id;

    // Detect file type and prepare appropriate button label & icon
    const isHtmlFile = proj.fileName && proj.fileName.toLowerCase().endsWith('.html');
    const isPdfFile = proj.fileName && proj.fileName.toLowerCase().endsWith('.pdf');
    const isCodeFile = proj.fileName && /\.(cpp|c|py|js|ts|java|cs|php|sql|sh)$/i.test(proj.fileName);
    const isZipFile = proj.fileName && /\.(zip|rar|7z|tar|gz)$/i.test(proj.fileName);
    const hasUploadedFile = Boolean(proj.fileDataUrl);

    let actionLabel = dict.modal.downloadFile;
    let actionIcon = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>';

    if (isHtmlFile) {
      actionLabel = isAr ? '🌐 تشغيل صفحة الـ HTML مباشرة' : '🌐 Run Live HTML Webpage';
      actionIcon = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>';
    } else if (isPdfFile) {
      actionLabel = isAr ? '📕 فتح مستند PDF' : '📕 View PDF Document';
      actionIcon = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>';
    } else if (isCodeFile) {
      actionLabel = isAr ? `⚙️ تحميل الكود البرمجي (${proj.fileName})` : `⚙️ Download Source Code (${proj.fileName})`;
    } else if (isZipFile) {
      actionLabel = isAr ? `📦 تحميل الأرشيف (${proj.fileName})` : `📦 Download ZIP Archive (${proj.fileName})`;
    } else if (!hasUploadedFile && proj.link) {
      actionLabel = isAr ? '🔗 فتح الرابط الخارجي' : '🔗 Open External Link';
      actionIcon = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>';
    }

    const tagsHtml = (proj.tags || [])
      .map((t) => `<span class="tech-tag-sm">${escapeHtml(t)}</span>`)
      .join('');

    // Preview header: custom screenshot OR file type visual mockup
    let previewHtml = '';
    if (proj.screenshot) {
      previewHtml = `<img src="${proj.screenshot}" alt="${escapeHtml(proj.title)}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else if (proj.fileDataUrl && proj.fileType && proj.fileType.startsWith('image/')) {
      previewHtml = `<img src="${proj.fileDataUrl}" alt="${escapeHtml(proj.title)}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
      let iconColor = 'var(--accent-primary)';
      let screenText = proj.fileName || proj.subject || 'Assignment File';
      let iconSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>';

      if (isHtmlFile) {
        iconColor = '#38bdf8';
        iconSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>';
      } else if (isCodeFile) {
        iconColor = '#10b981';
        iconSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>';
      } else if (isPdfFile) {
        iconColor = '#ef4444';
      }

      previewHtml = `
        <div class="mockup-inner">
          <div class="mockup-bar">
            <span class="mockup-dot"></span>
            <span class="mockup-dot"></span>
            <span class="mockup-dot"></span>
          </div>
          <div class="mockup-screen">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:36px;height:36px;color:${iconColor};margin-bottom:0.5rem;">
              ${iconSvg}
            </svg>
            <span style="font-weight: 600; color: var(--text-primary);">${escapeHtml(screenText)}</span>
            ${proj.fileSize ? `<span style="font-size: 0.72rem; color: var(--text-muted);">${formatFileSize(proj.fileSize)}</span>` : ''}
          </div>
        </div>
      `;
    }

    const badgeText = isAr ? 'أسايمنت جامعي' : 'Added from Site';
    const deleteTitle = isAr ? 'حذف هذا الأسايمنت' : 'Delete assignment';

    // File info badge inside card body
    const fileBadgeHtml = proj.fileName
      ? `<div class="project-file-badge">
           <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
           <span>${escapeHtml(proj.fileName)} ${proj.fileSize ? `(${formatFileSize(proj.fileSize)})` : ''}</span>
         </div>`
      : '';

    card.innerHTML = `
      <div class="custom-card-header">
        <span class="custom-badge">${badgeText}</span>
        <button type="button" class="btn-delete-card" data-id="${proj.id}" title="${deleteTitle}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div class="project-preview-mockup">
        ${previewHtml}
      </div>

      <div class="project-content">
        <span class="project-category">${escapeHtml(proj.subject)}</span>
        <h3 class="project-title">${escapeHtml(proj.title)}</h3>
        ${fileBadgeHtml}
        <p class="project-description">${escapeHtml(proj.desc)}</p>
        <div class="project-tech-stack">
          ${tagsHtml}
        </div>
        <div class="project-links">
          <button type="button" class="project-link-item btn-action-execute" style="cursor: pointer; background: none; border: none; font-size: 0.9rem; font-weight: 700; color: var(--accent-primary); display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>${actionLabel}</span>
            ${actionIcon}
          </button>
        </div>
      </div>
    `;

    // Click handler for opening/downloading the file
    const actionBtn = card.querySelector('.btn-action-execute');
    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openOrDownloadProjectFile(proj);
      });
    }

    // Delete handler
    const deleteBtn = card.querySelector('.btn-delete-card');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteCustomProject(proj.id);
      });
    }

    return card;
  }

  async function renderAllCustomProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    // Remove existing custom cards to avoid duplicate rendering
    document.querySelectorAll('.custom-project-card').forEach((el) => el.remove());

    const userProjects = await dbGetAllProjects();
    userProjects.forEach((proj) => {
      const card = createProjectCardElement(proj);
      projectsGrid.prepend(card);
    });
  }

  async function deleteCustomProject(id) {
    const dict = translations[currentLang] || translations.en;
    const confirmed = confirm(dict.modal.deleteConfirm);
    if (!confirmed) return;

    await dbDeleteProject(id);

    const cardEl = document.getElementById(id);
    if (cardEl) {
      cardEl.style.transition = 'all 0.4s ease';
      cardEl.style.opacity = '0';
      cardEl.style.transform = 'scale(0.9)';
      setTimeout(() => cardEl.remove(), 400);
    }
    triggerToast(currentLang === 'ar' ? 'تم حذف الأسايمنت بنجاح' : 'Assignment deleted successfully');
  }

  // --------------------------------------------------------------------------
  // 9. DOM Ready Initializations & Event Bindings
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // 9.1 Set Language
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    applyLanguage(savedLang === 'ar' ? 'ar' : 'en', false);

    // 9.2 Load all custom projects from IndexedDB
    renderAllCustomProjects();

    // 9.3 Language Toggle Buttons
    const langToggleBtn = document.getElementById('langToggleBtn');
    const mobileLangToggleBtn = document.getElementById('mobileLangToggleBtn');
    if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
    if (mobileLangToggleBtn) mobileLangToggleBtn.addEventListener('click', toggleLanguage);

    // 9.4 Theme Toggle Button
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

    // 9.5 Interactive Add Project Modal Setup
    const openAddProjectModalBtn = document.getElementById('openAddProjectModalBtn');
    const closeAddProjectModalBtn = document.getElementById('closeAddProjectModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addProjectModal = document.getElementById('addProjectModal');
    const addProjectForm = document.getElementById('addProjectForm');

    // Inputs inside modal
    const projMainFileInput = document.getElementById('projMainFile');
    const fileDropzone = document.getElementById('fileDropzone');
    const selectedFileBadge = document.getElementById('selectedFileBadge');
    const selectedFileName = document.getElementById('selectedFileName');
    const selectedFileSize = document.getElementById('selectedFileSize');
    const htmlLiveNotice = document.getElementById('htmlLiveNotice');
    const clearSelectedFileBtn = document.getElementById('clearSelectedFileBtn');

    const projScreenshotFileInput = document.getElementById('projScreenshotFile');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');

    const projTitle = document.getElementById('projTitle');
    const projSubject = document.getElementById('projSubject');
    const projTags = document.getElementById('projTags');

    function openModal() {
      if (!addProjectModal) return;
      addProjectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (projTitle) setTimeout(() => projTitle.focus(), 100);
    }

    function closeModal() {
      if (!addProjectModal) return;
      addProjectModal.classList.remove('open');
      document.body.style.overflow = '';
      if (addProjectForm) addProjectForm.reset();
      clearMainFile();
      if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
      if (imagePreview) imagePreview.src = '';
      selectedScreenshotDataUrl = null;
    }

    function clearMainFile() {
      selectedMainFile = null;
      selectedMainFileDataUrl = null;
      if (projMainFileInput) projMainFileInput.value = '';
      if (selectedFileBadge) selectedFileBadge.style.display = 'none';
      if (fileDropzone) fileDropzone.style.display = 'block';
      if (htmlLiveNotice) htmlLiveNotice.style.display = 'none';
    }

    if (openAddProjectModalBtn) openAddProjectModalBtn.addEventListener('click', openModal);
    if (closeAddProjectModalBtn) closeAddProjectModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (clearSelectedFileBtn) clearSelectedFileBtn.addEventListener('click', clearMainFile);

    if (addProjectModal) {
      addProjectModal.addEventListener('click', (e) => {
        if (e.target === addProjectModal) closeModal();
      });
    }

    // Drag & drop visual feedback
    if (fileDropzone) {
      ['dragenter', 'dragover'].forEach((eventName) => {
        fileDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          fileDropzone.classList.add('dragover');
        });
      });
      ['dragleave', 'drop'].forEach((eventName) => {
        fileDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          fileDropzone.classList.remove('dragover');
        });
      });
    }

    // Main file chosen handler (ANY file type: HTML, PDF, C++, Python, ZIP, etc.)
    function handleSelectedFile(file) {
      if (!file) return;
      selectedMainFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        selectedMainFileDataUrl = e.target.result;

        // Show selected file badge
        if (selectedFileName) selectedFileName.textContent = file.name;
        if (selectedFileSize) selectedFileSize.textContent = `(${formatFileSize(file.size)})`;
        if (selectedFileBadge) selectedFileBadge.style.display = 'flex';
        if (fileDropzone) fileDropzone.style.display = 'none';

        // Detect HTML file
        const isHtml = file.name.toLowerCase().endsWith('.html');
        if (htmlLiveNotice) {
          htmlLiveNotice.style.display = isHtml ? 'block' : 'none';
        }

        // Auto-fill Title if empty
        if (projTitle && !projTitle.value.trim()) {
          const rawName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          // Capitalize & clean
          projTitle.value = rawName.replace(/[-_]/g, ' ');
        }

        // Auto-suggest category and tags if empty
        if (isHtml) {
          if (projSubject && !projSubject.value.trim()) projSubject.value = currentLang === 'ar' ? 'مادة تطوير الويب' : 'Web Development Course';
          if (projTags) projTags.value = 'HTML5, CSS3, JavaScript';
        } else if (file.name.toLowerCase().endsWith('.cpp')) {
          if (projSubject && !projSubject.value.trim()) projSubject.value = currentLang === 'ar' ? 'برمجة C++ وهياكل البيانات' : 'C++ & Data Structures';
          if (projTags) projTags.value = 'C++, OOP, Algorithms';
        } else if (file.name.toLowerCase().endsWith('.py')) {
          if (projSubject && !projSubject.value.trim()) projSubject.value = currentLang === 'ar' ? 'لغة بايثون والأتمتة' : 'Python & Automation';
          if (projTags) projTags.value = 'Python 3, Scripting';
        } else if (file.name.toLowerCase().endsWith('.pdf')) {
          if (projSubject && !projSubject.value.trim()) projSubject.value = currentLang === 'ar' ? 'تقرير أسايمنت جامعي' : 'Academic Assignment Report';
          if (projTags) projTags.value = 'Documentation, PDF Report';
        }
      };
      reader.readAsDataURL(file);
    }

    if (projMainFileInput) {
      projMainFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        handleSelectedFile(file);
      });
    }

    // Optional screenshot / image cover handler
    if (projScreenshotFileInput) {
      projScreenshotFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          selectedScreenshotDataUrl = event.target.result;
          if (imagePreview && imagePreviewContainer) {
            imagePreview.src = selectedScreenshotDataUrl;
            imagePreviewContainer.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Form submission: save to IndexedDB and update UI
    if (addProjectForm) {
      addProjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titleVal = projTitle ? projTitle.value.trim() : '';
        const subjectVal = projSubject ? projSubject.value.trim() : '';
        const descVal = document.getElementById('projDesc')?.value.trim();
        const tagsVal = projTags ? projTags.value.trim() : '';
        const linkVal = document.getElementById('projLink')?.value.trim();

        if (!titleVal || !subjectVal || !descVal) return;

        const tagsArray = tagsVal
          ? tagsVal.split(',').map((t) => t.trim()).filter(Boolean)
          : ['Assignment'];

        const newProject = {
          id: 'custom_proj_' + Date.now(),
          title: titleVal,
          subject: subjectVal,
          desc: descVal,
          tags: tagsArray,
          fileName: selectedMainFile ? selectedMainFile.name : null,
          fileSize: selectedMainFile ? selectedMainFile.size : null,
          fileType: selectedMainFile ? selectedMainFile.type : null,
          fileDataUrl: selectedMainFileDataUrl,
          screenshot: selectedScreenshotDataUrl,
          link: linkVal || '',
          createdAt: new Date().toISOString()
        };

        // Save in IndexedDB (handles large files without localStorage 5MB limit!)
        await dbSaveProject(newProject);

        // Prepend directly to UI
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
          const newCardEl = createProjectCardElement(newProject);
          projectsGrid.prepend(newCardEl);
          newCardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const dict = translations[currentLang] || translations.en;
        triggerToast(dict.modal.successAdd);
        closeModal();
      });
    }

    // ------------------------------------------------------------------------
    // 9.6 Header, Scroll Progress, Scrollspy & Contact Form
    // ------------------------------------------------------------------------
    const siteHeader = document.getElementById('siteHeader');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const mobileToggleBtn = document.getElementById('mobileToggleBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const copyWhatsAppBtn = document.getElementById('copyWhatsAppBtn');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    function handleScrollEvents() {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollProgressBar && docHeight > 0) {
        const progressPercentage = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        scrollProgressBar.style.width = `${progressPercentage}%`;
      }

      if (siteHeader) {
        if (scrollY > 30) {
          siteHeader.classList.add('scrolled');
        } else {
          siteHeader.classList.remove('scrolled');
        }
      }

      if (backToTopBtn) {
        if (scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      updateScrollspy(scrollY);
    }

    function updateScrollspy(scrollY) {
      let currentSectionId = '';
      const headerOffset = 130;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - headerOffset;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (!currentSectionId && scrollY < 200 && sections.length > 0) {
        currentSectionId = sections[0].getAttribute('id');
      }

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });

      mobileNavLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', handleScrollEvents, { passive: true });
    handleScrollEvents();

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Mobile Drawer Logic
    function openMobileMenu() {
      if (!mobileDrawer || !mobileToggleBtn || !mobileBackdrop) return;
      mobileDrawer.classList.add('open');
      mobileBackdrop.classList.add('open');
      mobileToggleBtn.classList.add('is-active');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      if (!mobileDrawer || !mobileToggleBtn || !mobileBackdrop) return;
      mobileDrawer.classList.remove('open');
      mobileBackdrop.classList.remove('open');
      mobileToggleBtn.classList.remove('is-active');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (mobileToggleBtn) {
      mobileToggleBtn.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);
    mobileNavLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (addProjectModal && addProjectModal.classList.contains('open')) {
          closeModal();
        } else if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          closeMobileMenu();
        }
      }
    });

    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
      );
      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
    }

    // WhatsApp Clipboard Handler
    if (copyWhatsAppBtn) {
      copyWhatsAppBtn.addEventListener('click', async () => {
        const phoneNumber = copyWhatsAppBtn.getAttribute('data-phone') || '01015044275';
        const dict = translations[currentLang] || translations.en;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(phoneNumber);
          } else {
            const textArea = document.createElement('textarea');
            textArea.value = phoneNumber;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
          }
          triggerToast(dict.toasts.copiedPhone);
        } catch (err) {
          triggerToast(`WhatsApp: ${phoneNumber}`);
        }
      });
    }

    // Contact Form
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const dict = translations[currentLang] || translations.en;
        const nameInput = document.getElementById('senderName');
        const emailInput = document.getElementById('senderEmail');
        const messageInput = document.getElementById('senderMessage');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
          if (formStatus) {
            formStatus.textContent = dict.toasts.formError;
            formStatus.className = 'form-status error';
          }
          return;
        }

        const originalBtnText = submitBtn ? submitBtn.innerHTML : dict.contact.sendBtn;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 50 50" style="width:18px;height:18px;animation:spin 1s linear infinite;">
              <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80" stroke-dashoffset="60"></circle>
            </svg>
            ${dict.toasts.formSending}
          `;
        }

        setTimeout(() => {
          if (formStatus) {
            formStatus.textContent = dict.toasts.formSuccess.replace('{name}', name);
            formStatus.className = 'form-status success';
          }

          contactForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }

          triggerToast(dict.toasts.formSuccess.replace('{name}', name));

          const greeting = currentLang === 'ar' 
            ? `مرحباً محمد، أنا ${name} (${email}). رسالتي: ${message}`
            : `Hi Mohamed, my name is ${name} (${email}). Message: ${message}`;
          const whatsappUrl = `https://wa.me/201015044275?text=${encodeURIComponent(greeting)}`;

          setTimeout(() => {
            const openDirect = confirm(dict.toasts.whatsAppPrompt);
            if (openDirect) {
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            }
          }, 600);
        }, 800);
      });
    }

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  });
})();
