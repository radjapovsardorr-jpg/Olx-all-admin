 'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import { Search, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const chats = [
  { id: 1, name: 'Jamshid K.', item: 'Chevrolet Malibu 2', unread: true },
  { id: 2, name: 'Alisher T.', item: 'Akkaunt bloklanishi', unread: false },
  { id: 3, name: 'Dilnoza Karimova', item: 'Biznes profil savollari', unread: false },
];

const initialMessages = {
  1: [
    { id: 1, sender: 'user', text: "Assalomu alaykum, e'lonim nima uchun rad etildi?", time: '14:20' },
    { id: 2, sender: 'admin', text: "Va alaykum assalom! E'londa taqiqlangan tovar yoki noto'g'ri narx ko'rsatilgan bo'lishi mumkin.", time: '14:22' },
  ],
  2: [
    { id: 3, sender: 'user', text: 'Akkauntim bloklandi, nima qilay?', time: '10:15' },
    { id: 4, sender: 'admin', text: "Salom! Akkauntingiz bo'yicha batafsil ma'lumot olish uchun qo'llab-quvvatlash xizmatiga murojaat qiling.", time: '10:16' },
  ],
  3: [
    { id: 5, sender: 'user', text: 'Biznes profilni qanday ochaman?', time: '09:30' },
    { id: 6, sender: 'admin', text: "Biznes profil uchun profilingiz sozlamalariga kirib, biznes profil bo'limini tanlang.", time: '09:32' },
  ],
};

function getReply(message) {
  const text = message.toLowerCase();

  if (/salom|assalomu|vaalaykum/.test(text))
    return "Assalomu alaykum! 😊 Sizga qanday yordam bera olaman?";
  if (/e'lon|elon|rad|joylash/.test(text))
    return "E'loningiz rad etilgan bo'lsa, uning narxi, rasmlari va tavsifini tekshiring. Qoidalarni buzuvchi ma'lumotlarni tuzatib, qayta yuboring.";
  if (/blok|bloklandi|bloklangan/.test(text))
    return "Akkaunt bloklangan bo'lsa, sababini aniqlash uchun qo'llab-quvvatlash xizmatiga murojaat qiling.";
  if (/parol|password|kir[a-z]* olmay/.test(text))
    return "Parolni unutgan bo'lsangiz, kirish sahifasidagi parolni tiklash bo'limidan foydalaning.";
  if (/narx|pul|to'lov|tolov/.test(text))
    return "Narx yoki to'lov bo'yicha yordam beramiz. Iltimos, qaysi e'lon yoki xizmat haqida so'rayotganingizni yozing.";
  if (/biznes|profil/.test(text))
    return "Biznes profilni ochish uchun profil sozlamalarini tekshiring. Muammo davom etsa, qo'llab-quvvatlash xizmatiga murojaat qiling.";
  if (/rahmat|raxmat/.test(text))
    return "Marhamat! 😊 Yana savolingiz bo'lsa, bemalol yozing.";
  if (/yordam|muammo|savol/.test(text))
    return "Albatta, yordam beraman! Muammoni batafsilroq yozib yuboring.";
  return "Xabaringiz uchun rahmat! 😊 Sizga yordam berishga harakat qilamiz. Savolingizni batafsilroq yozib yuboring.";
}

export default function XabarlarPage() {
  const { showToast } = useApp();
  const [activeChat, setActiveChat] = useState(1);
  const [search, setSearch] = useState('');
  const [messagesByChat, setMessagesByChat] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const messages = messagesByChat[activeChat] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || typing) return;

    const userMessage = {
      id: Date.now(),
      sender: 'admin',
      text,
      time: new Date().toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const chatId = activeChat;

    setMessagesByChat((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), userMessage],
    }));
    setInputText('');
    setTyping(true);

    showToast?.('Xabar yuborildi!');

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'user',
        text: getReply(text),
        time: new Date().toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), reply],
      }));
      setTyping(false);
    }, 900);
  };

  const filteredChats = chats.filter((chat) =>
    `${chat.name} ${chat.item}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#f6f9f8] min-h-screen">
      <Header />

      <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden h-[750px] flex">
          <aside className="w-64 md:w-80 shrink-0 border-r border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-800 text-sm">
                Foydalanuvchilar bilan chatlar
              </h2>
              <div className="mt-3 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Suhbatdoshni qidirish..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filteredChats.map((chat) => (
                <button
                  type="button"
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full text-left p-4 flex items-center gap-3 text-xs transition ${
                    activeChat === chat.id
                      ? 'bg-[#00DF81]/10'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                    {chat.name.split(' ').map((part) => part[0]).join('').replace('.', '').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800">{chat.name}</p>
                    <p className="text-slate-400 mt-1 truncate">{chat.item}</p>
                  </div>
                  {chat.unread && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                </button>
              ))}
            </div>
          </aside>

          <section className="flex-1 min-w-0 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">
                {chats.find((chat) => chat.id === activeChat)?.name.split(' ').map((part) => part[0]).join('').replace('.', '').slice(0, 2)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {chats.find((chat) => chat.id === activeChat)?.name}
                </h3>
                <span className="text-[10px] text-emerald-600 font-bold">
                  Avtomatik javob faol
                </span>
              </div>
            </div>

            <div className="p-4 md:p-6 flex-1 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'admin' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-md p-3.5 rounded-2xl text-xs whitespace-pre-wrap break-words ${
                      message.sender === 'admin'
                        ? 'bg-[#0b2620] text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-[9px] mt-2 block text-slate-400">
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="text-xs text-slate-400">
                  Javob yozilmoqda...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Xabar yozing..."
                className="min-w-0 flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#00DF81]"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || typing}
                className="px-4 md:px-5 py-3 bg-[#00e396] hover:bg-[#00c984] disabled:opacity-50 text-[#05372d] font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Yuborish</span>
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}