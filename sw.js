/*--- ❗ При внесении изменений, меняем название версии кеша: для обновления данных у пользователей ---*/
const staticCache = 'static-cache-v1' 
const dynamicCache = 'dynamic-cache-v1'

const assetUrls = [
  './index.html',
  './offline.html', 
  './scripts/app.js',
  './styles/main.css'
]

/*--- Добавление статических файлов в кеш ---*/
self.addEventListener('install', async event => {
  const cache = await caches.open(staticCache)
  await cache.addAll(assetUrls)
})

/*--- Удаляем все старые версии кеша ---*/
self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCache)
      .filter(name => name !== dynamicCache)
      .map(name => caches.delete(name))
  )
})

/*--- Отлавливаем запросы ---*/
self.addEventListener('fetch', event => {
  const {request} = event

/*--- Определяем, как будет обрабатываться запрос ---*/
  const url = new URL(request.url)
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request)) 
  } else {
    event.respondWith(networkFirst(request))
  }
})

/*--- Проверка и получение запрашиваемых данных сначала из кеша: cacheFirst ---*/
async function cacheFirst(request) { 
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

/*--- Проверка и получение запрашиваемых данных сначала по сети, с сервера: networkFirst ---*/
async function networkFirst(request) {
  const cache = await caches.open(dynamicCache)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? await caches.match('./offline.html')
  }
}
