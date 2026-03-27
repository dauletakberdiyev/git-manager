# 🧠 Landing Page MVP — AI Instructions

## 🎯 Goal

Build a minimal, high-converting landing page for a developer tool that automates GitHub workflow:

Task → Branch → PR → Done

The page must be:
- simple
- fast
- focused on ONE idea
- optimized for developers

---

## 🏗️ Tech Stack

- React (Vite or Next.js)
- TailwindCSS
- No UI libraries (no MUI, no Chakra)
- No backend needed

---

## 🎨 Design Requirements

- Dark theme (default)
- Clean, minimal, modern
- Inspired by:
  - Linear
  - Vercel
  - Stripe (simple sections)

### Colors
- Background: #0B0F14
- Card: #111827
- Primary: #6366F1
- Text: #E5E7EB
- Muted text: #9CA3AF

### UI Rules
- Border radius: 12px–16px
- Soft shadows
- Large spacing between sections
- Max width: 1100px centered

---

## 📄 Page Structure (STRICT)

### 1. Navbar

Include:
- Logo (text-based)
- Right side: "Login with GitHub" button

Sticky top navbar

---

### 2. Hero Section (MOST IMPORTANT)

Content:

Headline:
"Task → Branch → PR → Done"

Subheadline:
"Automate your GitHub workflow. No manual tracking."

CTA Button:
"Login with GitHub"

Small text under button:
"Takes less than 30 seconds"

Add code-style example block:

Task: "Add auth"  
→ branch: feature/add-auth  
→ PR merged → DONE

---

### 3. Demo Section

Title:
"See it in action"

Subtitle:
"From idea to done in seconds"

Include:
- placeholder for GIF/video
- use a styled container (rounded, dark card)

---

### 4. How It Works

Title:
"How it works"

Steps (numbered):

1. Create a task  
2. A branch is created automatically  
3. Write your code  
4. Open & merge a PR  
5. Task is marked as done  

Add small caption:
"No manual updates. No context switching."

---

### 5. Features Section

Title:
"What you get"

List (simple bullets, no cards):

- Auto branch creation from tasks  
- PR → task auto-complete  
- Simple kanban per repository  
- AI task breakdown  

---

### 6. Audience Section

Title:
"Built for solo developers"

Text:
"If you're building alone and tired of managing tasks manually — this is for you."

---

### 7. Final CTA

Title:
"Start building faster"

Button:
"Login with GitHub"

Text:
"Free to start"

---

## 🧩 Components to Create

- Navbar
- Hero
- DemoSection
- HowItWorks
- Features
- Audience
- CTA

Each should be a separate React component.

---

## ⚙️ Behavior

- Smooth scroll between sections
- Button hover effects
- Responsive (mobile + desktop)
- Mobile: stack sections vertically

---

## 📱 Responsive Rules

- Mobile first
- Text centered on mobile
- Grid → column layout on small screens

---

## 🚫 Do NOT include

- pricing section
- testimonials
- blog
- footer links overload
- animations libraries
- complex UI

---

## 🧠 Copywriting Rules

- Keep sentences short
- No buzzwords
- No marketing fluff
- Write like talking to a developer

---

## 📦 Output Requirements

The AI must generate:

1. Full React page
2. Tailwind styling
3. Clean component structure
4. Ready-to-run code

---

## ✅ Success Criteria

- User understands product in 5 seconds
- Clear call-to-action
- Visual focus on workflow automation
- Looks like a modern dev tool landing

---

## 💡 Key Principle

Do NOT overdesign.

This is a dev tool:
→ clarity > beauty
→ speed > complexity