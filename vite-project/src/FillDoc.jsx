import React, { useMemo, useState, useRef } from "react";
import { toPng } from 'html-to-image';
import styles from './FillDoc.module.css';


export default function FillDoc() {
    const [form, setForm] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        specialty: "",
        course: "",
        facultyNumber: "",
        email: "",
        phoneNumber: "",
        university: "",
        academicYearFrom: "",
        academicYearTo: "",
        date: ""
    });

    const [showGuides, setShowGuides] = useState(false);

    const fullName = useMemo(() => {
        return [form.firstName, form.middleName, form.lastName].filter(Boolean).join(" ");
    }, [form.firstName, form.middleName, form.lastName]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}г.`;
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const coords = {
        fullName: { top: "21.5%", left: "53%" },
        specialty: { top: "25.2%", left: "53%" },
        course: { top: "28.8%", left: "30%" },
        facultyNumber: { top: "28.8%", left: "72%" },
        email: { top: "32.2%", left: "32%" },
        phoneNumber: { top: "32.2%", left: "72%" },
        university: { top: "39.2%", left: "52%" },
        academicYearFrom: { top: "43.5%", left: "48%" },
        academicYearTo: { top: "43.5%", left: "72%" },
        date: { top: "68.2%", left: "22%" },
    };

    const FieldOverlay = ({ value, style, placeholder }) => (
        <div
            className={
                `absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-md ` +
                ` leading-none whitespace-pre` +
                `bg-white/80 backdrop-blur-sm font-[Arial]` +
                `${showGuides ? "outline-2 outline-dashed outline-blue-500" : ""}`
            }
            style={style}
        >
            {value?.trim() ? value : placeholder}
        </div>
    );

    const elementRef = useRef(null);

    const htmlToImageConvert = () => {
        toPng(elementRef.current, { 
            cacheBust: false,
            backgroundColor: '#ffffff',
            pixelRatio: 2
        })
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = `erasmus-application-${fullName || 'document'}.png`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.log(err);
            alert('Грешка при генериране на документа. Моля опитайте отново.');
          });
      };

    const printDocument = () => {
        window.print();
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="order-2 md:order-1">
                    <div className={`flex items-center justify-between mb-3 ${styles['print-hidden']}`}>
                        <h2 className="text-xl font-semibold">Преглед на генерирания документ</h2>
                        <label className="inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                className="size-4"
                                checked={showGuides}
                                onChange={(e) => setShowGuides(e.target.checked)}
                            />
                            Покажи подсказки
                        </label>
                    </div>

                    <div ref={elementRef} className={`relative w-full aspect-[3/4] bg-white shadow-xl overflow-hidden document-container ${styles['print-document']}`} >
                        <img
                            src="/images/doc-template.png"
                            alt="Document template"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />

                        {/* Overlays */}
                        <FieldOverlay
                            value={fullName}
                            style={{ top: coords.fullName.top, left: coords.fullName.left, fontSize: "10px" }}
                            placeholder={"Вашите имена"}
                        />
                        <FieldOverlay
                            value={form.specialty}
                            style={{ top: coords.specialty.top, left: coords.specialty.left, fontSize: "10px" }}
                            placeholder={"Специалност"}
                        />
                        <FieldOverlay
                            value={form.course}
                            style={{ top: coords.course.top, left: coords.course.left, fontSize: "10px" }}
                            placeholder={"Курс"}
                        />
                        <FieldOverlay
                            value={form.facultyNumber}
                            style={{ top: coords.facultyNumber.top, left: coords.facultyNumber.left, fontSize: "10px" }}
                            placeholder={"Факултетен номер"}
                        />
                        <FieldOverlay
                            value={form.email}
                            style={{ top: coords.email.top, left: coords.email.left, fontSize: "10px" }}
                            placeholder={"Електронна поща"}
                        />
                        <FieldOverlay
                            value={form.phoneNumber}
                            style={{ top: coords.phoneNumber.top, left: coords.phoneNumber.left, fontSize: "10px" }}
                            placeholder={"Телефонен номер"}
                        />
                        <FieldOverlay
                            value={form.university}
                            style={{ top: coords.university.top, left: coords.university.left, fontSize: "10px" }}
                            placeholder={"Университет"}
                        />
                        <FieldOverlay
                            value={form.academicYearFrom}
                            style={{ top: coords.academicYearFrom.top, left: coords.academicYearFrom.left, fontSize: "10px" }}
                            placeholder={"От"}
                        />
                        <FieldOverlay
                            value={form.academicYearTo}
                            style={{ top: coords.academicYearTo.top, left: coords.academicYearTo.left, fontSize: "10px" }}
                            placeholder={"До"}
                        />
                        <FieldOverlay
                            value={formatDate(form.date)}
                            style={{ top: coords.date.top, left: coords.date.left, fontSize: "10px" }}
                            placeholder={"Дата"}
                        />

                        {/* Optional watermark */}
                        <div className={`absolute bottom-3 right-4 text-[10px] tracking-wider text-slate-400 select-none ${styles['print-hidden']}`}>
                            Преглед на генерирания документ
                        </div>
                    </div>

                </div>

                {/* RIGHT: Input form */}
                <div className={`order-1 md:order-2 ${styles['print-hidden']}`}>
                    <h2 className="text-xl font-semibold mb-3">Попълнете формуляра</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
                            <div>
                                <label className="text-sm text-slate-600">Име</label>
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={onChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                                    placeholder="Иван"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Презиме</label>
                                <input
                                    name="middleName"
                                    value={form.middleName}
                                    onChange={onChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                                    placeholder="Иванов"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Фамилия</label>
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={onChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                                    placeholder="Георгиев"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Специалност</label>
                            <input
                                name="specialty"
                                inputMode="numeric"
                                value={form.specialty}
                                onChange={onChange}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400 ${form.egn && form.egn.length !== 10 ? "border-rose-300" : ""}`}
                                placeholder="Софтуерно инженерство"
                                autoComplete="off"
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-slate-600">Курс</label>
                                <select
                                    name="course"
                                    value={form.course}
                                    onChange={onChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                                >
                                    <option value="">Избери курс</option>
                                    <option value="I">I</option>
                                    <option value="II">II</option>
                                    <option value="III">III</option>
                                    <option value="IV">IV</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Факултетен номер</label>
                                <input
                                    name="facultyNumber"
                                    inputMode="numeric"
                                    value={form.facultyNumber}
                                    onChange={onChange}
                                    className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400 ${form.egn && form.egn.length !== 10 ? "border-rose-300" : ""}`}
                                    placeholder="2309011456"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Електронна поща</label>
                            <input
                                name="email"
                                inputMode="numeric"
                                value={form.email}
                                onChange={onChange}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400 ${form.egn && form.egn.length !== 10 ? "border-rose-300" : ""}`}
                                placeholder="youremail@example.com"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600">Телефонен номер</label>
                            <input
                                name="phoneNumber"
                                inputMode="numeric"
                                value={form.phoneNumber}
                                onChange={onChange}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400 ${form.egn && form.egn.length !== 10 ? "border-rose-300" : ""}`}
                                placeholder="+359 91 931 4124"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600">Университет</label>
                            <input
                                name="university"
                                value={form.university}
                                onChange={onChange}
                                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                                placeholder='Великотърновски университет "Св. Св. Кирил и Методий"'
                                autoComplete="off"
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-slate-600">Академична година от</label>
                                <input
                                    type="number"
                                    min={1990}
                                    max={2025}
                                    step={1}
                                    name="academicYearFrom"
                                    value={form.academicYearFrom}
                                    onChange={onChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Академична година до</label>
                                <input
                                    type="number"
                                    min={1990}
                                    max={2025}
                                    step={1}
                                    name="academicYearTo"
                                    value={form.academicYearTo}
                                    onChange={onChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Дата</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={onChange}
                                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                                lang="bg"
                                data-format="dd.mm.yyyy"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setForm({ firstName: "", middleName: "", lastName: "", specialty: "", course: "", facultyNumber: "", email: "", phoneNumber: "", university: "", academicYearFrom: "", academicYearTo: "", date: "" })}
                                className="rounded-xl px-4 py-2 border hover:bg-slate-50 cursor-pointer"
                            >
                                Изчисти
                            </button>
                            <button
                                type="button"
                                onClick={() => printDocument()}
                                className="rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                            >
                                Принтирай
                            </button>
                            <button
                                type="button"
                                onClick={() => htmlToImageConvert()}
                                className="rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                            >
                                Изтегли
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
