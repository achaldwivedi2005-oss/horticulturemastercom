# Horticulture Master — Roadmap

Spec reference: user's "PROJECT OBJECTIVE — Advanced Intelligence, RAG chatbot & 10-question quiz" file (Oct 25).

## Done
- [x] Design system, header/footer, dark mode, homepage, About, Contact
- [x] Student sign-up/login (email + Google), dashboard, admin roles, contact form
- [x] Social links (WhatsApp group, Telegram channel, Telegram quiz group), logo
- [x] Admin access for achaldwivedi1999@gmail.com (auto-granted on sign-up)
- [x] AI assistant (saved chats, 3 free guest messages, asks name/preparation/university/goal)
- [x] Google Drive PDF library (live folder, categories, search, filters, viewer)
- [x] Automatic job monitor (scheduled every 3h, official pages, AI extraction, de-duplication, run log)
- [x] Animated "Latest Agriculture & Horticulture Job Alerts" on homepage + Jobs page

- [x] Admin Jobs tab: review queue (verify/reject/pin/breaking/edit/delete/add manually), sources manager, settings (auto-publish, interval, closing-soon days, Telegram), "Run now", run logs
- [x] Job intelligence fields: degrees, PhD/NET, All-India vs state, NEW/OPEN/CLOSING SOON/CLOSED/UPDATED, deadline history, English + Hindi summary, why it matters, share on WhatsApp/Telegram
- [x] Job filters: qualification, scope/state, status, sort newest/closing soonest
- [x] Monitor pauses cleanly when AI credits run out
- [x] Added sources: ICAR-CISH, ICAR-CIAH, NHB; fixed ICAR HQ + ASRB links
- [x] "Exams & News" page (ICAR PG/PhD counselling, ASRB NET/ARS, horticulture news) with Hindi toggle, homepage notifications, admin add/edit/hide/pin
- [x] Current YP/SRF/state vacancies added by hand from official pages (3 Nov); monitor now skips old archive notices

## Blocked
- [ ] Re-reading jobs (blocked: AI credits used up; daily credits reset 05:30 IST, then the next scheduled check refills the list)
- [ ] Telegram alerts (blocked: needs a Telegram bot connected + bot added as admin of the channel)
- [ ] NBPGR + ASRB pages time out from our server (may need Firecrawl)

## Next (from spec)
- [ ] Expand monitored sources: NHB, MIDH, agriwelfare, PIB, NABARD, NSC, more ICAR institutes, SAUs, state PSCs
- [ ] Research & new varieties hub (auto + admin)
- [ ] Government schemes hub (MIDH/NHB/state)
- [ ] CUET-PG entries in Exams & News (add when NTA publishes 2027 notice)
- [ ] "Latest Horticulture Intelligence" hub with category pills
- [ ] Study-material-grounded AI chatbot (answers only from uploaded notes/books/PYQs, with source citations; Hinglish "not found" message)
- [ ] Study material text + PYQ uploader in admin (feeds chatbot + quiz)
- [ ] 10-question quiz engine from PYQ bank with explanations + Telegram/WhatsApp CTAs on quiz + result screen
- [ ] Admin CRUD for jobs/research/schemes/exams, auto-publish toggle, closing-soon threshold
- [ ] Admin edit option for page text + file attachments
- [ ] Optional alert subscription prompts
- [ ] YouTube link (blocked: waiting on user)
