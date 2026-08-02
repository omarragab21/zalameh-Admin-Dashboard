import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createServer } from 'vite';

const CACHE_KEY = 'zalameh_categories_data_v3';
const storage = new Map();
let throwOnStorageGet = false;
let throwOnStorageSet = false;
let fetchHandler;
let requests;
let viteServer;
let categoryApiService;
let getCategoryResponseMeta;
let mapCategoryFromApi;
let mapSubCategoryFromApi;
let CategoryRepositoryImpl;
let validateCategoryInputs;

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const categoryFixture = ({ count = 2, subCategories, id = 7 } = {}) => ({
  id,
  name: 'مطاعم',
  translations: {
    en: { name: 'Restaurants', description: 'English description' },
    ar: { name: 'مطاعم', description: 'وصف عربي' },
  },
  image_url: 'https://example.test/category.jpg',
  is_active: true,
  sub_categories_count: count,
  sub_categories: subCategories ?? [
    {
      id: 21,
      name: 'الاكل السريع',
      translations: { en: 'Fast food', ar: 'الاكل السريع' },
      is_active: true,
    },
    {
      id: 22,
      name: 'حلويات',
      translations: { en: 'Desserts', ar: 'حلويات' },
      is_active: true,
    },
  ],
});

const cachedCategory = ({ count = 2, subCategories } = {}) => ({
  id: '7',
  nameAr: 'مطاعم',
  nameEn: 'Restaurants',
  status: 'active',
  subcategoriesCount: count,
  subcategories: subCategories ?? [
    { id: '21', parentId: '7', nameAr: 'الأول', nameEn: 'First', status: 'active' },
    { id: '22', parentId: '7', nameAr: 'الثاني', nameEn: 'Second', status: 'active' },
  ],
});

before(async () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem(key) {
        if (throwOnStorageGet) throw new Error('storage read failed');
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        if (throwOnStorageSet) throw new Error('storage write failed');
        storage.set(key, String(value));
      },
      removeItem(key) {
        storage.delete(key);
      },
      clear() {
        storage.clear();
      },
    },
  });

  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { sendBeacon: () => true },
  });

  globalThis.fetch = async (input, init = {}) => {
    const request = { url: String(input), init };
    requests.push(request);
    if (!fetchHandler) throw new Error(`Unexpected request: ${request.url}`);
    return fetchHandler(request);
  };

  viteServer = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  });

  ({ categoryApiService, getCategoryResponseMeta, mapCategoryFromApi, mapSubCategoryFromApi } =
    await viteServer.ssrLoadModule('/src/features/categories/data/api/categoryApiService.ts'));
  ({ CategoryRepositoryImpl } =
    await viteServer.ssrLoadModule('/src/features/categories/data/repositories/categoryRepositoryImpl.ts'));
  ({ validateCategoryInputs } =
    await viteServer.ssrLoadModule('/src/core/utils/securityUtils.ts'));
});

after(async () => {
  await viteServer?.close();
});

beforeEach(() => {
  storage.clear();
  throwOnStorageGet = false;
  throwOnStorageSet = false;
  requests = [];
  fetchHandler = undefined;
});

test('maps the supplied category payload and its two subcategories', () => {
  const category = mapCategoryFromApi(categoryFixture());

  assert.equal(category.id, '7');
  assert.equal(category.subcategoriesCount, 2);
  assert.equal(category.subcategories.length, 2);
  assert.equal(category.nameAr, 'مطاعم');
  assert.equal(category.nameEn, 'Restaurants');
  assert.equal(category.status, 'active');
});

test('normalizes count aliases, string statuses, and subcategory metadata', () => {
  const category = mapCategoryFromApi({
    id: 8,
    name_ar: 'خدمات',
    name_en: 'Services',
    is_active: '1',
    subcategories_count: '3',
    sub_categories: [],
  });
  const subCategory = mapSubCategoryFromApi({
    id: 30,
    category_id: 8,
    name_ar: 'صيانة',
    name_en: 'Maintenance',
    description_ar: 'وصف',
    description_en: 'Description',
    is_active: '1',
    order: '4',
  });

  assert.equal(category.subcategoriesCount, 3);
  assert.equal(category.status, 'active');
  assert.equal(subCategory.parentId, '8');
  assert.equal(subCategory.descriptionAr, 'وصف');
  assert.equal(subCategory.descriptionEn, 'Description');
  assert.equal(subCategory.order, 4);
  assert.equal(subCategory.status, 'active');
});

test('loads every categories page', async () => {
  fetchHandler = ({ url }) => {
    if (url.endsWith('/categories')) {
      return jsonResponse({ data: [categoryFixture({ id: 1, count: 1, subCategories: [] })], meta: { last_page: 2 } });
    }
    if (url.endsWith('/categories?page=2')) {
      return jsonResponse({ data: [categoryFixture({ id: 2, count: 1, subCategories: [] })], meta: { last_page: 2 } });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const categories = await categoryApiService.fetchCategories();
  assert.deepEqual(categories.map((category) => category.id), ['1', '2']);
  assert.equal(requests.length, 2);
});

test('keeps the discovered last page when a later page omits pagination metadata', async () => {
  fetchHandler = ({ url }) => {
    const page = new URL(url).searchParams.get('page') ?? '1';
    return jsonResponse({
      data: [categoryFixture({ id: Number(page), count: 1, subCategories: [] })],
      ...(page === '1' ? { meta: { last_page: 3 } } : {}),
    });
  };

  const categories = await categoryApiService.fetchCategories();
  assert.deepEqual(categories.map((category) => category.id), ['1', '2', '3']);
  assert.equal(requests.length, 3);
});

test('loads every subcategories page', async () => {
  fetchHandler = ({ url }) => {
    const page = new URL(url).searchParams.get('page');
    const id = page === '2' ? 22 : 21;
    return jsonResponse({
      data: [{ id, name_ar: `فرعي ${id}`, name_en: `Sub ${id}`, is_active: true }],
      meta: { last_page: 2 },
    });
  };

  const subCategories = await categoryApiService.fetchSubCategoriesByCategoryId('7');
  assert.deepEqual(subCategories.map((subCategory) => subCategory.id), ['21', '22']);
  assert.equal(requests.length, 2);
});

test('hydrates a broken zero count before categories reach the UI', async () => {
  fetchHandler = ({ url }) => {
    if (url.endsWith('/categories')) {
      return jsonResponse({
        data: [categoryFixture({ count: 0, subCategories: [] })],
        meta: { last_page: 1 },
      });
    }
    if (url.endsWith('/categories/7')) {
      return jsonResponse({ data: categoryFixture() });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const [category] = await new CategoryRepositoryImpl().getCategories('all');
  assert.equal(category.subcategoriesCount, 2);
  assert.equal(category.subcategories.length, 2);
  assert.equal(requests.length, 2);
});

test('falls back to the subcategories endpoint when category details cannot hydrate the count', async () => {
  fetchHandler = ({ url }) => {
    if (url.endsWith('/categories')) {
      return jsonResponse({
        data: [categoryFixture({ count: 0, subCategories: [] })],
        meta: { last_page: 1 },
      });
    }
    if (url.endsWith('/categories/7')) {
      return jsonResponse({ message: 'Temporary failure' }, 500);
    }
    if (url.includes('/sub_categories?')) {
      return jsonResponse({
        data: categoryFixture().sub_categories,
        meta: { last_page: 1 },
      });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const [category] = await new CategoryRepositoryImpl().getCategories('all');
    assert.equal(category.subcategoriesCount, 2);
    assert.equal(category.subcategories.length, 2);
  } finally {
    console.warn = originalWarn;
  }
});

test('does not request category details when the list count is already valid', async () => {
  fetchHandler = ({ url }) => {
    assert.ok(url.endsWith('/categories'));
    return jsonResponse({ data: [categoryFixture()], meta: { last_page: 1 } });
  };

  const [category] = await new CategoryRepositoryImpl().getCategories('all');
  assert.equal(category.subcategoriesCount, 2);
  assert.equal(requests.length, 1);
});

test('treats a successful empty API response as authoritative', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory()]));
  fetchHandler = () => jsonResponse({ data: [], meta: { last_page: 1 } });

  const categories = await new CategoryRepositoryImpl().getCategories('all');
  assert.deepEqual(categories, []);
  assert.deepEqual(JSON.parse(storage.get(CACHE_KEY)), []);
});

test('preserves loaded subcategories when an update response is sparse', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory()]));
  fetchHandler = ({ url, init }) => {
    assert.ok(url.endsWith('/categories/7'));
    assert.equal(init.method, 'PUT');
    return jsonResponse({
      data: {
        id: 7,
        translations: { ar: { name: 'مطاعم محدثة' }, en: { name: 'Updated restaurants' } },
        is_active: true,
      },
    });
  };

  const category = await new CategoryRepositoryImpl().updateCategory('7', { nameAr: 'مطاعم محدثة' });
  assert.equal(category.subcategoriesCount, 2);
  assert.equal(category.subcategories.length, 2);
});

test('preserves the original category id and untouched fields when an update response has no id', async () => {
  storage.set(CACHE_KEY, JSON.stringify([{
    ...cachedCategory(),
    descriptionAr: 'الوصف القديم',
    descriptionEn: 'Old description',
    image: 'https://example.test/old.jpg',
  }]));
  fetchHandler = ({ url, init }) => {
    assert.ok(url.endsWith('/categories/7'));
    assert.equal(init.method, 'PUT');
    return jsonResponse({ data: { name_ar: 'مطاعم محدثة' } });
  };

  const category = await new CategoryRepositoryImpl().updateCategory('7', {
    nameAr: 'مطاعم محدثة',
  });
  assert.equal(category.id, '7');
  assert.equal(category.nameAr, 'مطاعم محدثة');
  assert.equal(category.nameEn, 'Restaurants');
  assert.equal(category.descriptionAr, 'الوصف القديم');
  assert.equal(category.descriptionEn, 'Old description');
  assert.equal(category.image, 'https://example.test/old.jpg');
  assert.equal(category.status, 'active');
  assert.equal(category.subcategoriesCount, 2);
});

test('honors an explicit update response that removes all subcategories', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory()]));
  fetchHandler = () => jsonResponse({
    data: {
      id: 7,
      name_ar: 'مطاعم',
      name_en: 'Restaurants',
      is_active: true,
      sub_categories_count: 0,
      sub_categories: [],
    },
  });

  const category = await new CategoryRepositoryImpl().updateCategory('7', {
    nameAr: 'مطاعم',
  });
  const responseMeta = getCategoryResponseMeta(category);
  assert.equal(category.subcategoriesCount, 0);
  assert.deepEqual(category.subcategories, []);
  assert.equal(responseMeta.hasSubcategoryCount, true);
  assert.equal(responseMeta.hasSubcategoryList, true);
});

test('does not treat null relation fields in a sparse update as an explicit deletion', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory()]));
  fetchHandler = () => jsonResponse({
    data: {
      id: 7,
      name_ar: 'مطاعم محدثة',
      sub_categories_count: null,
      sub_categories: null,
    },
  });

  const category = await new CategoryRepositoryImpl().updateCategory('7', {
    nameAr: 'مطاعم محدثة',
  });
  const responseMeta = getCategoryResponseMeta(category);
  assert.equal(category.subcategoriesCount, 2);
  assert.equal(category.subcategories.length, 2);
  assert.equal(responseMeta.hasSubcategoryCount, false);
  assert.equal(responseMeta.hasSubcategoryList, false);
});

test('preserves the original subcategory id and untouched fields in a sparse update', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory({
    count: 1,
    subCategories: [{
      id: '21',
      parentId: '7',
      nameAr: 'قديم',
      nameEn: 'Old',
      descriptionAr: 'وصف قديم',
      descriptionEn: 'Old description',
      image: 'https://example.test/sub.jpg',
      status: 'active',
      order: 3,
    }],
  })]));
  fetchHandler = ({ url, init }) => {
    assert.ok(url.endsWith('/sub_categories/21'));
    assert.equal(init.method, 'PUT');
    return jsonResponse({ data: { name_ar: 'جديد' } });
  };

  const subCategory = await new CategoryRepositoryImpl().updateSubCategory(
    '7',
    '21',
    { nameAr: 'جديد' }
  );
  assert.equal(subCategory.id, '21');
  assert.equal(subCategory.parentId, '7');
  assert.equal(subCategory.nameAr, 'جديد');
  assert.equal(subCategory.nameEn, 'Old');
  assert.equal(subCategory.descriptionAr, 'وصف قديم');
  assert.equal(subCategory.descriptionEn, 'Old description');
  assert.equal(subCategory.image, 'https://example.test/sub.jpg');
  assert.equal(subCategory.status, 'active');
  assert.equal(subCategory.order, 3);
});

test('does not turn an API success into a failure when cache writes fail', async () => {
  throwOnStorageSet = true;
  fetchHandler = ({ url, init }) => {
    assert.ok(url.endsWith('/categories'));
    assert.equal(init.method, 'POST');
    return jsonResponse({ data: categoryFixture({ count: 0, subCategories: [] }) }, 201);
  };

  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const category = await new CategoryRepositoryImpl().createCategory({
      nameAr: 'مطاعم',
      nameEn: 'Restaurants',
      status: 'active',
    });
    assert.equal(category.id, '7');
  } finally {
    console.warn = originalWarn;
  }
});

test('uses the direct details endpoint for getCategoryById', async () => {
  fetchHandler = ({ url }) => {
    assert.ok(url.endsWith('/categories/7'));
    return jsonResponse({ data: categoryFixture() });
  };

  const category = await new CategoryRepositoryImpl().getCategoryById('7');
  assert.equal(category?.subcategoriesCount, 2);
  assert.equal(requests.length, 1);
});

test('sends supported subcategory fields in create requests', async () => {
  fetchHandler = ({ url, init }) => {
    assert.ok(url.endsWith('/sub_categories'));
    assert.equal(init.method, 'POST');
    assert.equal(init.body.get('category_id'), '7');
    assert.equal(init.body.get('description_ar'), 'وصف');
    assert.equal(init.body.get('description_en'), 'Description');
    return jsonResponse({
      data: { id: 31, name_ar: 'فرعي', name_en: 'Sub', is_active: true },
    }, 201);
  };

  const subCategory = await categoryApiService.createSubCategory('7', {
    parentId: '7',
    nameAr: 'فرعي',
    nameEn: 'Sub',
    descriptionAr: 'وصف',
    descriptionEn: 'Description',
    status: 'active',
  });
  assert.equal(subCategory.id, '31');
});

test('deleting from a partial list decrements the known total instead of replacing it', async () => {
  const partialSubs = Array.from({ length: 15 }, (_, index) => ({
    id: String(index + 1),
    parentId: '7',
    nameAr: `فرعي ${index + 1}`,
    nameEn: `Sub ${index + 1}`,
    status: 'active',
  }));
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory({ count: 20, subCategories: partialSubs })]));
  fetchHandler = ({ url, init }) => {
    assert.ok(url.endsWith('/sub_categories/1'));
    assert.equal(init.method, 'DELETE');
    return new Response(null, { status: 204 });
  };

  await new CategoryRepositoryImpl().deleteSubCategory('7', '1');
  const [saved] = JSON.parse(storage.get(CACHE_KEY));
  assert.equal(saved.subcategoriesCount, 19);
  assert.equal(saved.subcategories.length, 14);
});

test('accepts either Arabic or English while preserving both API translations', () => {
  const validation = validateCategoryInputs({
    nameAr: '',
    nameEn: 'Restaurants',
    isSubcategory: false,
  });

  assert.equal(validation.isValid, true);
  assert.equal(validation.sanitizedData.nameAr, 'Restaurants');
  assert.equal(validation.sanitizedData.nameEn, 'Restaurants');
});

test('rejects malformed collection responses instead of silently caching them', async () => {
  fetchHandler = () => jsonResponse({ data: { unexpected: true } });
  await assert.rejects(() => categoryApiService.fetchCategories(), /Invalid categories response/);
});

test('deduplicates concurrent category loads caused by development Strict Mode', async () => {
  let resolveResponse;
  const pendingResponse = new Promise((resolve) => {
    resolveResponse = resolve;
  });
  fetchHandler = () => pendingResponse;

  const repository = new CategoryRepositoryImpl();
  const firstLoad = repository.getCategories('all');
  const secondLoad = repository.getCategories('all');
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(requests.length, 1);

  resolveResponse(jsonResponse({ data: [categoryFixture()], meta: { last_page: 1 } }));
  const [firstResult, secondResult] = await Promise.all([firstLoad, secondLoad]);
  assert.equal(firstResult[0].subcategoriesCount, 2);
  assert.equal(secondResult[0].subcategoriesCount, 2);
});

test('keeps a valid background list load when a concurrent mutation fails', async () => {
  let resolveListResponse;
  const pendingListResponse = new Promise((resolve) => {
    resolveListResponse = resolve;
  });
  fetchHandler = ({ url, init }) => {
    if (url.endsWith('/categories') && init.method === 'GET') return pendingListResponse;
    if (url.endsWith('/categories') && init.method === 'POST') {
      return jsonResponse({ message: 'Create failed' }, 500);
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const repository = new CategoryRepositoryImpl();
  const listLoad = repository.getCategories('all');
  await new Promise((resolve) => setTimeout(resolve, 0));
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    await assert.rejects(
      () => repository.createCategory({
        nameAr: 'جديدة',
        nameEn: 'New',
        status: 'active',
      }),
      /Create failed/
    );
  } finally {
    console.warn = originalWarn;
  }

  resolveListResponse(jsonResponse({
    data: [categoryFixture()],
    meta: { last_page: 1 },
  }));
  const categories = await listLoad;
  assert.deepEqual(categories.map((category) => category.id), ['7']);
});

test('does not lose loaded categories when a create succeeds during the initial list request', async () => {
  let resolveListResponse;
  const pendingListResponse = new Promise((resolve) => {
    resolveListResponse = resolve;
  });
  fetchHandler = ({ url, init }) => {
    if (url.endsWith('/categories') && init.method === 'GET') return pendingListResponse;
    if (url.endsWith('/categories') && init.method === 'POST') {
      return jsonResponse({
        data: categoryFixture({ id: 9, count: 0, subCategories: [] }),
      }, 201);
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const repository = new CategoryRepositoryImpl();
  const listLoad = repository.getCategories('all');
  await new Promise((resolve) => setTimeout(resolve, 0));
  const create = repository.createCategory({
    nameAr: 'جديدة',
    nameEn: 'New',
    status: 'active',
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  resolveListResponse(jsonResponse({
    data: [categoryFixture({ id: 7, count: 1, subCategories: [] })],
    meta: { last_page: 1 },
  }));

  await Promise.all([listLoad, create]);
  const saved = JSON.parse(storage.get(CACHE_KEY));
  assert.deepEqual(saved.map((category) => category.id), ['9', '7']);
});

test('serializes concurrent mutation commits so neither successful create is lost', async () => {
  let resolveListResponse;
  const pendingListResponse = new Promise((resolve) => {
    resolveListResponse = resolve;
  });
  fetchHandler = ({ url, init }) => {
    if (url.endsWith('/categories') && init.method === 'GET') return pendingListResponse;
    if (url.endsWith('/categories') && init.method === 'POST') {
      const requestBody = typeof init.body === 'string'
        ? JSON.parse(init.body)
        : { name_en: init.body.get('name_en') };
      const isFirst = requestBody.name_en === 'First';
      return jsonResponse({
        data: categoryFixture({
          id: isFirst ? 8 : 9,
          count: 0,
          subCategories: [],
        }),
      }, 201);
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const repository = new CategoryRepositoryImpl();
  const listLoad = repository.getCategories('all');
  await new Promise((resolve) => setTimeout(resolve, 0));
  const firstCreate = repository.createCategory({
    nameAr: 'الأولى',
    nameEn: 'First',
    status: 'active',
  });
  const secondCreate = repository.createCategory({
    nameAr: 'الثانية',
    nameEn: 'Second',
    status: 'active',
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  resolveListResponse(jsonResponse({
    data: [categoryFixture({ id: 7, count: 1, subCategories: [] })],
    meta: { last_page: 1 },
  }));

  await Promise.all([listLoad, firstCreate, secondCreate]);
  const savedIds = JSON.parse(storage.get(CACHE_KEY))
    .map((category) => category.id)
    .sort();
  assert.deepEqual(savedIds, ['7', '8', '9']);
});

test('does not let a stale subcategory request overwrite a completed mutation', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory({
    count: 1,
    subCategories: [
      { id: '21', parentId: '7', nameAr: 'قديم', nameEn: 'Old', status: 'active' },
    ],
  })]));

  let resolveListRequest;
  const pendingListResponse = new Promise((resolve) => {
    resolveListRequest = resolve;
  });
  fetchHandler = ({ url, init }) => {
    if (url.includes('/sub_categories?') && init.method === 'GET') return pendingListResponse;
    if (url.endsWith('/sub_categories') && init.method === 'POST') {
      return jsonResponse({
        data: { id: 22, name_ar: 'جديد', name_en: 'New', is_active: true },
      }, 201);
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const repository = new CategoryRepositoryImpl();
  const staleLoad = repository.getSubCategoriesByCategoryId('7');
  await new Promise((resolve) => setTimeout(resolve, 0));
  await repository.createSubCategory('7', {
    parentId: '7',
    nameAr: 'جديد',
    nameEn: 'New',
    status: 'active',
  });
  resolveListRequest(jsonResponse({
    data: [{ id: 21, name_ar: 'قديم', name_en: 'Old', is_active: true }],
    meta: { last_page: 1 },
  }));
  await staleLoad;

  const [saved] = JSON.parse(storage.get(CACHE_KEY));
  assert.equal(saved.subcategoriesCount, 2);
  assert.deepEqual(saved.subcategories.map((subCategory) => subCategory.id), ['21', '22']);
});

test('deduplicates concurrent subcategory expansion requests', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory()]));
  let resolveResponse;
  const pendingResponse = new Promise((resolve) => {
    resolveResponse = resolve;
  });
  fetchHandler = () => pendingResponse;

  const repository = new CategoryRepositoryImpl();
  const firstLoad = repository.getSubCategoriesByCategoryId('7');
  const secondLoad = repository.getSubCategoriesByCategoryId('7');
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(requests.length, 1);

  resolveResponse(jsonResponse({
    data: categoryFixture().sub_categories,
    meta: { last_page: 1 },
  }));
  const [firstResult, secondResult] = await Promise.all([firstLoad, secondLoad]);
  assert.equal(firstResult.length, 2);
  assert.equal(secondResult.length, 2);
});

test('reconciles a stale cached count downward after loading every subcategory page', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory({ count: 5 })]));
  fetchHandler = () => jsonResponse({
    data: categoryFixture().sub_categories,
    meta: { last_page: 1 },
  });

  const subCategories = await new CategoryRepositoryImpl().getSubCategoriesByCategoryId('7');
  const [saved] = JSON.parse(storage.get(CACHE_KEY));
  assert.equal(subCategories.length, 2);
  assert.equal(saved.subcategoriesCount, 2);
  assert.equal(saved.subcategories.length, 2);
});

test('does not lower a known count when subcategory refresh fails and cache is partial', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory({ count: 5 })]));
  fetchHandler = () => jsonResponse({ message: 'Temporary failure' }, 500);
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    await assert.rejects(
      () => new CategoryRepositoryImpl().getSubCategoriesByCategoryId('7'),
      /Failed to fetch subcategories/
    );
  } finally {
    console.warn = originalWarn;
  }

  const [saved] = JSON.parse(storage.get(CACHE_KEY));
  assert.equal(saved.subcategoriesCount, 5);
  assert.equal(saved.subcategories.length, 2);
});

test('does not hide authorization failures behind cached category details', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory()]));
  fetchHandler = () => jsonResponse({ message: 'Unauthenticated.' }, 401);
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    await assert.rejects(
      () => new CategoryRepositoryImpl().getCategoryById('7'),
      /Failed to fetch category details/
    );
  } finally {
    console.warn = originalWarn;
  }
});

test('does not hide authorization failures behind cached subcategories', async () => {
  storage.set(CACHE_KEY, JSON.stringify([cachedCategory()]));
  fetchHandler = () => jsonResponse({ message: 'Unauthenticated.' }, 401);
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    await assert.rejects(
      () => new CategoryRepositoryImpl().getSubCategoriesByCategoryId('7'),
      /Failed to fetch subcategories/
    );
  } finally {
    console.warn = originalWarn;
  }
});

test('surfaces API failures when no valid cache exists', async () => {
  fetchHandler = () => jsonResponse({ message: 'Unauthenticated.' }, 401);
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    await assert.rejects(
      () => new CategoryRepositoryImpl().getCategories('all'),
      /Failed to fetch categories/
    );
  } finally {
    console.warn = originalWarn;
  }
});
