'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import {
  FolderTree,
  Plus,
  Download,
  History,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Car,
  Building,
  Smartphone,
  Briefcase,
  Shirt,
  Tag,
  Layers,
  ArrowUpDown,
  Info,
  X,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { initialCategories } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

const STORAGE_KEY = 'olx-admin-categories';

const DEFAULT_FILTERS = [
  'Maydoni (m²)',
  'Xonalar soni',
  'Ta’mirlash holati',
  'Qavatlar soni',
];

const createCategory = (id) => ({
  id,
  code: `#CAT-${100 + id}`,
  name: '',
  nameRu: '',
  desc: 'Yangi katalog toifasi',
  slug: `/yangi-toifa-${id}`,
  subCount: 0,
  listingsCount: '0',
  listingsNum: 0,
  active: true,
  icon: 'tag',
  filters: [],
  subCategories: [],
});

const normalizeCategory = (category) => ({
  ...category,
  name: category.name || '',
  nameRu: category.nameRu || '',
  desc: category.desc || '',
  slug: category.slug || '',
  active: category.active !== false,
  filters: Array.isArray(category.filters)
    ? category.filters
    : [],
  subCategories: Array.isArray(category.subCategories)
    ? category.subCategories
    : [],
  listingsNum: Number(category.listingsNum || 0),
  listingsCount: category.listingsCount ?? '0',
});

export default function KategoriyalarPage() {
  const { showToast } = useApp();

  const [categories, setCategories] = useState(
    () => initialCategories.map(normalizeCategory)
  );

  const [loaded, setLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [expandedCats, setExpandedCats] = useState({});
  const [newFilterTag, setNewFilterTag] = useState('');
  const [showAddTagInput, setShowAddTagInput] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    nameRu: '',
    slug: '',
    order: 1,
    active: true,
    icon: 'tag',
    desc: '',
    filters: [],
  });

  // 1. Oldin saqlangan kategoriyalarni yuklash.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCategories(parsed.map(normalizeCategory));
        }
      }
    } catch (error) {
      console.error('Kategoriyalarni yuklashda xato:', error);
    } finally {
      setLoaded(true);
    }
  }, []);

  // 2. O'zgarishlarni brauzer xotirasiga saqlash.
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(categories)
      );
    } catch (error) {
      console.error('Kategoriyalarni saqlashda xato:', error);
      showToast('Kategoriyalarni saqlab bo‘lmadi', 'error');
    }
  }, [categories, loaded]);

  const activeEditingCat =
    categories.find((category) => category.id === selectedCatId) ||
    null;

  // ID takrorlanishining oldini olish.
  const getNextId = () => {
    return categories.reduce(
      (max, category) => Math.max(max, Number(category.id) || 0),
      0
    ) + 1;
  };

  // Formani tanlangan kategoriya bilan to'ldirish.
  const selectCategory = (category) => {
    setSelectedCatId(category.id);
    setIsNewCategory(false);
    setShowAddTagInput(false);
    setNewFilterTag('');

    setEditForm({
      name: category.name || '',
      nameRu: category.nameRu || '',
      slug: category.slug || '',
      order: category.order ?? category.id,
      active: category.active !== false,
      icon: category.icon || 'tag',
      desc: category.desc || '',
      filters: [...(category.filters || [])],
    });
  };

  // Yangi kategoriya yaratish va darhol tahrirlashni ochish.
  const handleAddCategory = () => {
    const id = getNextId();
    const newCategory = createCategory(id);

    setCategories((previous) => [
      ...previous,
      newCategory,
    ]);

    setSelectedCatId(id);
    setIsNewCategory(true);
    setViewMode('tree');
    setShowAddTagInput(false);
    setNewFilterTag('');

    setEditForm({
      name: '',
      nameRu: '',
      slug: `/yangi-toifa-${id}`,
      order: id,
      active: true,
      icon: 'tag',
      desc: 'Yangi katalog toifasi',
      filters: [],
    });

    setExpandedCats((previous) => ({
      ...previous,
    }));

    showToast('Yangi kategoriya yaratildi. Endi ma’lumotlarini kiriting!');
  };

  // Inputlarni boshqarish.
  const updateField = (field, value) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Kategoriya holatini o'zgartirish.
  const toggleCategoryStatus = (id) => {
    setCategories((previous) =>
      previous.map((category) => {
        if (category.id !== id) return category;

        const active = !category.active;

        showToast(
          `"${category.name || 'Yangi kategoriya'}" ${
            active ? 'faollashtirildi' : 'nofaol qilindi'
          }`
        );

        return {
          ...category,
          active,
        };
      })
    );

    if (selectedCatId === id) {
      setEditForm((previous) => ({
        ...previous,
        active: !previous.active,
      }));
    }
  };

  const toggleExpand = (id) => {
    setExpandedCats((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  // Barcha asosiy kategoriyalarni yoyish.
  const expandAll = () => {
    const expanded = {};

    categories.forEach((category) => {
      expanded[category.id] = true;
    });

    setExpandedCats(expanded);
    showToast('Barcha kategoriyalar yoyildi');
  };

  // Filtr qo'shish.
  const handleAddFilter = () => {
    const value = newFilterTag.trim();

    if (!value) {
      showToast('Filtr nomini kiriting', 'error');
      return;
    }

    if (
      editForm.filters.some(
        (filter) => filter.toLowerCase() === value.toLowerCase()
      )
    ) {
      showToast('Bu filtr allaqachon mavjud', 'error');
      return;
    }

    setEditForm((previous) => ({
      ...previous,
      filters: [...previous.filters, value],
    }));

    setNewFilterTag('');
    setShowAddTagInput(false);
    showToast('Yangi filtr qo‘shildi');
  };

  const handleRemoveFilter = (filterToRemove) => {
    setEditForm((previous) => ({
      ...previous,
      filters: previous.filters.filter(
        (filter) => filter !== filterToRemove
      ),
    }));
  };

  // Saqlash: yangi va mavjud kategoriyalar uchun ishlaydi.
  const handleSave = (event) => {
    event.preventDefault();

    const name = editForm.name.trim();
    const nameRu = editForm.nameRu.trim();

    if (!name) {
      showToast('Kategoriya nomini kiriting!', 'error');
      return;
    }

    if (!nameRu) {
      showToast('Ruscha kategoriya nomini kiriting!', 'error');
      return;
    }

    if (!selectedCatId) {
      showToast('Avval kategoriya tanlang', 'error');
      return;
    }

    const slug = editForm.slug.trim().replace(/^\/+/, '');

    if (!slug) {
      showToast('URL slugni kiriting!', 'error');
      return;
    }

    const normalizedSlug = `/${slug}`;

    const duplicate = categories.some(
      (category) =>
        category.id !== selectedCatId &&
        category.slug.toLowerCase() === normalizedSlug.toLowerCase()
    );

    if (duplicate) {
      showToast('Bu URL slug boshqa kategoriyada ishlatilmoqda!', 'error');
      return;
    }

    setCategories((previous) =>
      previous.map((category) =>
        category.id === selectedCatId
          ? {
              ...category,
              name,
              nameRu,
              slug: normalizedSlug,
              order: Number(editForm.order) || category.id,
              active: editForm.active,
              icon: editForm.icon,
              desc: editForm.desc.trim(),
              filters: [...editForm.filters],
            }
          : category
      )
    );

    setEditForm((previous) => ({
      ...previous,
      name,
      nameRu,
      slug: normalizedSlug,
    }));

    setIsNewCategory(false);

    showToast(
      `"${name}" kategoriyasi muvaffaqiyatli saqlandi!`,
      'success'
    );
  };

  // Kategoriyani o'chirish.
  const handleDelete = () => {
    if (!selectedCatId) return;

    const category = categories.find(
      (item) => item.id === selectedCatId
    );

    if (!category) return;

    if (category.listingsNum > 0) {
      showToast(
        'E’lonlari bor kategoriyani avval bo‘shatish kerak!',
        'error'
      );
      setShowDeleteConfirm(false);
      return;
    }

    setCategories((previous) =>
      previous.filter((item) => item.id !== selectedCatId)
    );

    setShowDeleteConfirm(false);
    setSelectedCatId(null);
    setIsNewCategory(false);

    setEditForm({
      name: '',
      nameRu: '',
      slug: '',
      order: 1,
      active: true,
      icon: 'tag',
      desc: '',
      filters: [],
    });

    showToast('Kategoriya o‘chirildi', 'success');
  };

  // O'zgarishlarni bekor qilish.
  const handleCancel = () => {
    if (isNewCategory && selectedCatId !== null) {
      setCategories((previous) =>
        previous.filter((category) => category.id !== selectedCatId)
      );

      setSelectedCatId(null);
      setIsNewCategory(false);

      showToast('Yangi kategoriya bekor qilindi');
      return;
    }

    const category = categories.find(
      (item) => item.id === selectedCatId
    );

    if (category) {
      selectCategory(category);
    }

    setViewMode('table');
  };

  // Kategoriya ikonkalari.
  const getCategoryIcon = (iconName, className = 'w-5 h-5') => {
    const icons = {
      car: Car,
      building: Building,
      laptop: Smartphone,
      smartphone: Smartphone,
      briefcase: Briefcase,
      shirt: Shirt,
      tag: Tag,
    };

    const Icon = icons[iconName] || Tag;

    return <Icon className={className} />;
  };

  // Qidiruv va holat filtri.
  const filteredCategories = categories
    .filter((category) => {
      const search = searchVal.trim().toLowerCase();

      const matchesSearch =
        (category.name || '').toLowerCase().includes(search) ||
        (category.nameRu || '').toLowerCase().includes(search) ||
        (category.slug || '').toLowerCase().includes(search);

      if (!matchesSearch) return false;

      if (statusFilter === 'Faol') return category.active;
      if (statusFilter === 'Nofaol') return !category.active;

      return true;
    })
    .sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id));

  const activeCount = categories.filter(
    (category) => category.active
  ).length;

  const totalListings = categories.reduce(
    (sum, category) => sum + (Number(category.listingsNum) || 0),
    0
  );

  const exportCategories = () => {
    const data = JSON.stringify(categories, null, 2);
    const blob = new Blob([data], {
      type: 'application/json;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'kategoriyalar.json';
    link.click();

    URL.revokeObjectURL(url);
    showToast('Kategoriyalar fayli yuklab olindi');
  };

  return (
    <div className="min-h-screen flex-1 bg-[#f6f9f8]">
      <Header onSearch={setSearchVal} />

      <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Sarlavha */}
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00DF81]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00bfa5]">
                Tizim arxitekturasi • Katalog boshqaruvi
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-black text-slate-900">
              Kategoriyalar boshqaruvi
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Kategoriyalarni qo‘shish, tahrirlash va boshqarish.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAddCategory}
              className="flex items-center gap-2 rounded-xl bg-[#00e396] px-5 py-3 text-xs font-bold text-[#05372d] shadow-sm transition hover:bg-[#00c984] active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Yangi kategoriya qo‘shish
            </button>

            <button
              type="button"
              onClick={exportCategories}
              title="JSON faylni yuklab olish"
              className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setCategories(initialCategories.map(normalizeCategory));
                setSelectedCatId(null);
                setIsNewCategory(false);
                showToast(
                  'Boshlang‘ich kategoriyalar tiklandi',
                  'success'
                );
              }}
              title="Boshlang‘ich ma'lumotlarni tiklash"
              className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Statistikalar */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">
                Jami kategoriyalar
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                {categories.length}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {activeCount} ta faol kategoriya
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-4 text-slate-600">
              <FolderTree className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">
                Jami e’lonlar
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                {totalListings.toLocaleString('uz-UZ')}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Kategoriyalar bo‘yicha
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
              <Layers className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase text-slate-400">
                Faollik darajasi
              </p>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                {categories.length
                  ? Math.round((activeCount / categories.length) * 100)
                  : 0}%
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#00cbb4] transition-all"
                style={{
                  width: `${
                    categories.length
                      ? (activeCount / categories.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              {categories.length - activeCount} ta nofaol kategoriya
            </p>
          </div>
        </section>

        {/* Qidiruv va rejim */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1 sm:min-w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchVal}
                onChange={(event) => setSearchVal(event.target.value)}
                placeholder="Kategoriya nomi yoki slug..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-xs outline-none focus:border-[#00DF81]"
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              {['Barchasi', 'Faol', 'Nofaol'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ko‘rinish:</span>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${
                viewMode === 'table'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Jadval
            </button>

            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${
                viewMode === 'tree'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Daraxt va tahrir
            </button>
          </div>
        </section>

        {/* Jadval ko'rinishi */}
        {viewMode === 'table' && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Belgi</th>
                    <th className="px-5 py-4">Kategoriya</th>
                    <th className="px-5 py-4">Slug</th>
                    <th className="px-5 py-4">Ichki bo‘limlar</th>
                    <th className="px-5 py-4">E’lonlar</th>
                    <th className="px-5 py-4">Holat</th>
                    <th className="px-5 py-4 text-right">Amallar</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          {getCategoryIcon(category.icon)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800">
                          {category.name || 'Nomsiz kategoriya'}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {category.desc}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-slate-600">
                          {category.slug}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-600">
                        {category.subCategories.length} ta
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800">
                          {category.listingsCount}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            category.active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {category.active ? 'Faol' : 'Nofaol'}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            title="Tahrirlash"
                            onClick={() => {
                              selectCategory(category);
                              setViewMode('tree');
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            title="O‘chirish"
                            onClick={() => {
                              selectCategory(category);
                              setShowDeleteConfirm(true);
                            }}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredCategories.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-slate-400"
                      >
                        <Search className="mx-auto mb-3 h-8 w-8" />
                        <p className="font-bold">
                          Kategoriya topilmadi
                        </p>
                        <p className="mt-1">
                          Qidiruvni o‘zgartiring yoki yangi kategoriya qo‘shing.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
              Jami: <strong>{filteredCategories.length}</strong> ta kategoriya
            </div>
          </section>
        )}

        {/* Daraxt va tahrirlash */}
        {viewMode === 'tree' && (
          <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Chap tomon */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-[#00bfa5]" />
                  <h2 className="font-extrabold text-slate-800">
                    Katalog daraxti
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={expandAll}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Barchasini yoyish
                </button>
              </div>

              <div className="space-y-3">
                {filteredCategories.map((category) => {
                  const selected = selectedCatId === category.id;
                  const expanded = !!expandedCats[category.id];

                  return (
                    <div
                      key={category.id}
                      className={`overflow-hidden rounded-2xl border transition ${
                        selected
                          ? 'border-[#00DF81] bg-emerald-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 p-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleExpand(category.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expanded ? '' : '-rotate-90'
                              }`}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => selectCategory(category)}
                            className="flex min-w-0 flex-1 items-center gap-3 text-left"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                              {getCategoryIcon(category.icon)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-extrabold text-slate-800">
                                {category.name || 'Nomsiz kategoriya'}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {category.subCategories.length} ta ichki bo‘lim
                                {' · '}
                                {category.listingsCount} ta e’lon
                              </p>
                            </div>
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label="Kategoriya holatini o‘zgartirish"
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition ${
                            category.active
                              ? 'bg-[#00cbb4]'
                              : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                              category.active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {expanded && (
                        <div className="space-y-2 border-t border-slate-100 bg-slate-50/70 p-3">
                          {category.subCategories.map((sub, index) => (
                            <div
                              key={sub.id ?? `${category.id}-${index}`}
                              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3"
                            >
                              <div className="flex items-center gap-2">
                                <ChevronRight className="h-3 w-3 text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">
                                  {sub.name}
                                </span>
                              </div>

                              <span className="text-[10px] text-slate-400">
                                {sub.count ?? 0} ta
                              </span>
                            </div>
                          ))}

                          {category.subCategories.length === 0 && (
                            <p className="px-2 py-3 text-xs text-slate-400">
                              Ichki bo‘limlar mavjud emas.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredCategories.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">
                    Kategoriya topilmadi.
                  </p>
                )}
              </div>
            </div>

            {/* O'ng tomon: tahrirlash formasi */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-5">
              <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-extrabold text-slate-800">
                    {isNewCategory
                      ? 'Yangi kategoriya yaratish'
                      : 'Kategoriyani tahrirlash'}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Ma’lumotlarni kiriting va saqlang.
                  </p>
                </div>

                {selectedCatId !== null && (
                  <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800">
                    #CAT-{100 + selectedCatId}
                  </span>
                )}
              </div>

              {!activeEditingCat ? (
                <div className="py-10 text-center">
                  <FolderTree className="mx-auto h-10 w-10 text-slate-300" />

                  <p className="mt-3 font-bold text-slate-700">
                    Kategoriya tanlanmagan
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Yangi kategoriya qo‘shing yoki chap tomondan birini tanlang.
                  </p>

                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#00e396] px-4 py-3 text-xs font-bold text-[#05372d] hover:bg-[#00c984]"
                  >
                    <Plus className="h-4 w-4" />
                    Yangi kategoriya
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  {/* Ikonka */}
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase text-slate-500">
                      Kategoriya belgisi
                    </label>

                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        {getCategoryIcon(editForm.icon, 'h-6 w-6')}
                      </div>

                      <select
                        value={editForm.icon}
                        onChange={(event) =>
                          updateField('icon', event.target.value)
                        }
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold outline-none focus:border-[#00DF81]"
                      >
                        <option value="tag">Umumiy</option>
                        <option value="car">Avtotransport</option>
                        <option value="building">Ko‘chmas mulk</option>
                        <option value="laptop">Elektronika</option>
                        <option value="briefcase">Xizmatlar</option>
                        <option value="shirt">Kiyimlar</option>
                      </select>
                    </div>
                  </div>

                  {/* O'zbekcha nom */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      Kategoriya nomi (o‘zbekcha) *
                    </label>

                    <input
                      type="text"
                      required
                      autoFocus={isNewCategory}
                      value={editForm.name}
                      onChange={(event) =>
                        updateField('name', event.target.value)
                      }
                      placeholder="Masalan: Elektronika"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#00DF81]"
                    />
                  </div>

                  {/* Ruscha nom */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      Kategoriya nomi (ruscha) *
                    </label>

                    <input
                      type="text"
                      required
                      value={editForm.nameRu}
                      onChange={(event) =>
                        updateField('nameRu', event.target.value)
                      }
                      placeholder="Например: Электроника"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#00DF81]"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      URL Slug *
                    </label>

                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <span className="shrink-0 text-xs text-slate-400">
                        olx.uz/d/
                      </span>

                      <input
                        type="text"
                        required
                        value={editForm.slug.replace(/^\/+/, '')}
                        onChange={(event) =>
                          updateField(
                            'slug',
                            `/${event.target.value.replace(/^\/+/, '')}`
                          )
                        }
                        placeholder="elektronika"
                        className="min-w-0 flex-1 bg-transparent pl-1 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Tavsif */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      Qisqacha tavsif
                    </label>

                    <textarea
                      rows={2}
                      value={editForm.desc}
                      onChange={(event) =>
                        updateField('desc', event.target.value)
                      }
                      placeholder="Kategoriya haqida ma’lumot..."
                      className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none focus:border-[#00DF81]"
                    />
                  </div>

                  {/* Tartib */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      Tartib raqami
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={editForm.order}
                      onChange={(event) =>
                        updateField(
                          'order',
                          Math.max(1, Number(event.target.value) || 1)
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#00DF81]"
                    />
                  </div>

                  {/* Holat */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Kategoriya holati
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {editForm.active
                          ? 'Kategoriya faol'
                          : 'Kategoriya nofaol'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateField('active', !editForm.active)
                      }
                      className={`relative h-6 w-11 rounded-full p-0.5 transition ${
                        editForm.active
                          ? 'bg-[#00cbb4]'
                          : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          editForm.active
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Filtrlar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[11px] font-bold uppercase text-slate-600">
                        Maxsus filtrlar
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setShowAddTagInput((previous) => !previous)
                        }
                        className="text-xs font-bold text-emerald-700 hover:underline"
                      >
                        {showAddTagInput ? 'Yopish' : '+ Filtr qo‘shish'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editForm.filters.map((filter) => (
                        <span
                          key={filter}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-2 text-[11px] font-semibold text-slate-700"
                        >
                          {filter}

                          <button
                            type="button"
                            aria-label={`${filter} filtrini o‘chirish`}
                            onClick={() => handleRemoveFilter(filter)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}

                      {editForm.filters.length === 0 && (
                        <p className="text-xs text-slate-400">
                          Hozircha filtrlar mavjud emas.
                        </p>
                      )}
                    </div>

                    {showAddTagInput && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFilterTag}
                          onChange={(event) =>
                            setNewFilterTag(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              handleAddFilter();
                            }
                          }}
                          placeholder="Filtr nomi..."
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none focus:border-[#00DF81]"
                        />

                        <button
                          type="button"
                          onClick={handleAddFilter}
                          className="rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-600"
                        >
                          Qo‘shish
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Amallar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      title="Kategoriyani o‘chirish"
                      className="rounded-xl p-3 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200"
                      >
                        Bekor qilish
                      </button>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#00e396] px-4 py-3 text-xs font-extrabold text-[#05372d] shadow-sm transition hover:bg-[#00c984]"
                      >
                        <Save className="h-4 w-4" />
                        Saqlash
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </section>
        )}

        {/* Qoida */}
        <section className="flex items-start gap-3 rounded-2xl border border-emerald-900 bg-[#0b2620] p-5 text-white">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#00DF81]" />

          <div>
            <h3 className="text-sm font-bold">
              Kategoriyalar haqida
            </h3>

            <p className="mt-1 text-xs leading-6 text-slate-300">
              Yangi kategoriya yaratishda o‘zbekcha va ruscha nomlarni
              kiriting. URL slug boshqa kategoriyada takrorlanmasligi
              kerak. O‘zgarishlar ushbu brauzerda saqlanadi.
            </p>
          </div>
        </section>
      </main>

      {/* O'chirishni tasdiqlash */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDeleteConfirm(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-50 p-3 text-red-500">
                <AlertCircle className="h-6 w-6" />
              </div>

              <div>
                <h2
                  id="delete-category-title"
                  className="font-extrabold text-slate-900"
                >
                  Kategoriyani o‘chirish
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {isNewCategory
                    ? 'Yangi kategoriya bekor qilinsinmi?'
                    : `"${activeEditingCat?.name || 'Nomsiz kategoriya'}" kategoriyasini o‘chirmoqchimisiz?`}
                </p>

                {Number(activeEditingCat?.listingsNum || 0) > 0 && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    Ushbu kategoriyada e’lonlar mavjud. Uni o‘chirishdan
                    oldin e’lonlarni boshqa joyga ko‘chiring.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Yo‘q, bekor qilish
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isNewCategory) {
                    setCategories((previous) =>
                      previous.filter(
                        (category) => category.id !== selectedCatId
                      )
                    );

                    setSelectedCatId(null);
                    setIsNewCategory(false);
                    setShowDeleteConfirm(false);
                    showToast('Yangi kategoriya bekor qilindi');
                    return;
                  }

                  handleDelete();
                }}
                className="rounded-xl bg-red-500 px-4 py-3 text-xs font-bold text-white hover:bg-red-600"
              >
                Ha, o‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
